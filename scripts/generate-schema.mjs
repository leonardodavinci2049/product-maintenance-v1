import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPool } from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const SCHEMA_OUTPUT = resolve(ROOT, "src/database/schema.ts");

const CUSTOM_TYPES_HEADER = `export type OrganizationMemberRole =
  | "owner"
  | "manager"
  | "salesperson"
  | "operator"
  | "cashier"
  | "finance"
  | "shipping"
  | "customer";
`;

const RELATION_FIELDS = {
  Organization: ["member?: Member[];"],
  Member: ["user?: User;"],
};

const TABLES_TO_SKIP = [];

const TABLE_NAME_OVERRIDES = {
  organizationmeta: "OrganizationMeta",
  organizationrole: "OrganizationRole",
  teammember: "TeamMember",
  twofactor: "TwoFactor",
  usermeta: "UserMeta",
};

const TYPE_ALIASES = {
  TblLogLogin: "LogLogin",
  TblLogOperation: "LogOperation",
};

// ─── ENV ─────────────────────────────────────────────────────────────────────

function loadEnv() {
  const envFiles = [".env", ".env.local"];
  const vars = {};

  for (const file of envFiles) {
    try {
      const content = readFileSync(resolve(ROOT, file), "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        vars[key] = value;
      }
    } catch {
      // file not found, skip
    }
  }

  return vars;
}

// ─── TYPE MAPPING ────────────────────────────────────────────────────────────

function mysqlTypeToTs(dataType, columnType) {
  const dt = dataType.toLowerCase();

  if (
    dt === "int" ||
    dt === "bigint" ||
    dt === "smallint" ||
    dt === "mediumint" ||
    dt === "tinyint" ||
    dt === "decimal" ||
    dt === "float" ||
    dt === "double" ||
    dt === "numeric"
  ) {
    return "number";
  }

  if (
    dt === "varchar" ||
    dt === "char" ||
    dt === "text" ||
    dt === "mediumtext" ||
    dt === "longtext" ||
    dt === "tinytext" ||
    dt === "enum" ||
    dt === "set" ||
    dt === "json"
  ) {
    return "string";
  }

  if (
    dt === "datetime" ||
    dt === "timestamp" ||
    dt === "date" ||
    dt === "time"
  ) {
    return "Date";
  }

  if (dt === "tinyint" && columnType === "tinyint(1)") {
    return "boolean";
  }

  if (dt === "bit") {
    return "boolean";
  }

  if (dt === "blob" || dt === "mediumblob" || dt === "longblob") {
    return "Buffer";
  }

  return "string";
}

// ─── NAMING ──────────────────────────────────────────────────────────────────

function toPascalCase(str) {
  if (str.includes("_") || str.includes("-")) {
    return str
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const env = loadEnv();

  const requiredVars = [
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_NAME",
    "DATABASE_USER",
    "DATABASE_PASSWORD",
  ];
  for (const key of requiredVars) {
    if (!env[key]) {
      console.error(`Missing env var: ${key}`);
      process.exit(1);
    }
  }

  const pool = createPool({
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    connectionLimit: 2,
  });

  try {
    console.log(
      `Connecting to ${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}...`,
    );

    const [tables] = await pool.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
       ORDER BY TABLE_NAME`,
      [env.DATABASE_NAME],
    );

    console.log(`Found ${tables.length} tables`);

    const lines = [];

    if (CUSTOM_TYPES_HEADER) {
      lines.push(CUSTOM_TYPES_HEADER);
    }

    for (const table of tables) {
      const tableName = table.TABLE_NAME;

      if (TABLES_TO_SKIP.includes(tableName)) continue;

      const [columns] = await pool.query(
        `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
         ORDER BY ORDINAL_POSITION`,
        [env.DATABASE_NAME, tableName],
      );

      const typeName =
        TABLE_NAME_OVERRIDES[tableName] || toPascalCase(tableName);
      const fields = [];

      for (const col of columns) {
        const name = col.COLUMN_NAME;
        const nullable = col.IS_NULLABLE === "YES";

        let tsType;
        if (col.DATA_TYPE === "tinyint" && col.COLUMN_TYPE === "tinyint(1)") {
          tsType = "boolean";
        } else {
          tsType = mysqlTypeToTs(col.DATA_TYPE, col.COLUMN_TYPE);
        }

        if (nullable) {
          fields.push(`  ${name}?: ${tsType} | null;`);
        } else {
          fields.push(`  ${name}: ${tsType};`);
        }
      }

      const relations = RELATION_FIELDS[typeName];
      if (relations) {
        for (const rel of relations) {
          fields.push(`  ${rel}`);
        }
      }

      lines.push(`export type ${typeName} = {`);
      lines.push(fields.join("\n"));
      lines.push("};\n");
    }

    const output = lines.join("\n");

    const aliasLines = Object.entries(TYPE_ALIASES).map(
      ([original, alias]) => `export type ${alias} = ${original};`,
    );
    const finalOutput = aliasLines.length
      ? `${output}\n${aliasLines.join("\n")}\n`
      : output;

    writeFileSync(SCHEMA_OUTPUT, finalOutput, "utf-8");
    console.log(`Schema written to ${SCHEMA_OUTPUT}`);
    console.log(`Generated ${tables.length} types`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
