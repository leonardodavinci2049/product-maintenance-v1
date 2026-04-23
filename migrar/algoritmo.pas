 unit UdtmFunctions;

interface

 uses
  System.Classes, FireDAC.Stan.Intf, FireDAC.Stan.Option, FireDAC.Stan.Error,
  FireDAC.UI.Intf, FireDAC.Phys.Intf, FireDAC.Stan.Def, FireDAC.Stan.Pool,
  FireDAC.Stan.Async, System.DateUtils, System.JSON,
  FireDAC.Phys, FireDAC.Phys.FB, FireDAC.Phys.FBDef,
  FireDAC.VCLUI.Wait, FireDAC.Stan.Param, FireDAC.DatS, FireDAC.DApt.Intf,
  FireDAC.DApt, Data.DB, FireDAC.Comp.DataSet, FireDAC.Comp.Client,
  FireDAC.Phys.IBBase, FireDAC.Comp.UI, Datasnap.Provider,System.IniFiles,
   System.SysUtils,IdHashMessageDigest, Winapi.Windows,System.IOUtils,
  Vcl.Dialogs,Vcl.Forms, FireDAC.Phys.MySQL, FireDAC.Phys.MySQLDef;



type

  TTipoParametro = (tpBoolean, tpInteger, tpString, tpDate, tpTime, tpDateTime, tbDouble);


    TDtmFunctions = class(TDataModule)
    FDQ_PALAVRA_PODEROSA: TFDQuery;
    FDQ_PALAVRA_PODEROSAID_COPYWRITE: TIntegerField;
    FDQ_PALAVRA_PODEROSACOPYWRITE: TStringField;
    fmtKeyWords: TFDMemTable;
    fmtKeyWordsID: TIntegerField;
    fmtKeyWordsKEYWORD: TStringField;
    fmtKeyWordsQT_CARAC: TIntegerField;
    fmtKeyWordsPREPOSICAO: TStringField;
    dtsKeyWords: TDataSource;
    fmtFrases: TFDMemTable;
    fmtFrasesID: TIntegerField;
    fmtFrasesKEYWORD: TStringField;
    fmtFrasesPREPOSICAO: TStringField;
    fmtFrasesQUANTIDADE: TIntegerField;
    fmtFrasesPOSICAO: TIntegerField;
    fmtFrasesPRIORIDADE: TIntegerField;
    fmtFrasesFOCO_KEYWORD: TStringField;
    fmtFrasesCARACTERISTICA: TStringField;
    fmtFrasesCONTADOR: TAggregateField;
    dtsFrases: TDataSource;
    FDQ_PREPOSICAO: TFDQuery;
    FDQ_PREPOSICAOPREPOSICAO: TStringField;
    CNX_DATABASE_SEL: TFDConnection;
    CNX_DBCOMSUPORTE: TFDConnection;

  procedure DataModuleCreate(Sender: TObject);
  private
    { Private declarations }
    oprv_id_locLog : INTEGER;

    oprv_ID_SYSTEM : INTEGER;



  public
    { Public declarations }


{$REGION ' ------------- GERAR METAS TAGS PAGINAS PRODUTOS --------------------'}


  Function  Get_TITLE_PRODUTO(        OP_NOME : STRING    ) : STRING;

  Function  Get_DESCRIPTION_PRODUTO(
                                         OP_NOME_PRODUTO   : STRING;
                                         OP_NOME_FAMILIA   : STRING;
                                         OP_NOME_GRUPO     : STRING;
                                         OP_NOME_SUBGRUPO  : STRING
                                         ) : STRING;








  Function  Get_KEYWORD_PRODUTO(      OP_NOME : STRING) : STRING;




{$ENDREGION}

{$REGION ' ------------- GERAR METAS TAGS PAGINAS CATEGORIA -------------------'}



  Function  Get_TITLE_CATEGORIA(
                                  OP_NOME_FAMILIA   : STRING;
                                  OP_NOME_GRUPO     : STRING;
                                  OP_NOME_SUBGRUPO  : STRING
                              ) : STRING;

   Function  Get_DESCRIPTION_CATEGORIA(
                                         OP_NOME_PRODUTO   : STRING;
                                         OP_NOME_FAMILIA   : STRING;
                                         OP_NOME_GRUPO     : STRING;
                                         OP_NOME_SUBGRUPO  : STRING

                                           ) : STRING;


  Function  Get_KEYWORD_CATEGORIA(
                                    OP_NOME_FAMILIA   : STRING;
                                    OP_NOME_GRUPO     : STRING;
                                    OP_NOME_SUBGRUPO  : STRING
                              ) : STRING;




{$ENDREGION}


 end;

var
  DtmFunctions: TDtmFunctions;

Const
    sEXTENSAO_INI = '.ini';


implementation

uses
  UntThreadEnviarEmailTemplateRest,   UntThreadEnviarEmailSimplesRest;


{%CLASSGROUP 'Vcl.Controls.TControl'}

{$R *.dfm}

{ TDtmFunctions }

function ExtraireCadastrarKeyWords(NOME: STRING): STRING;
const
  excecao: array[0..5] of string = (' da ', ' de ', ' do ', ' das ', ' dos ', ' e ');
var

  OL_NOME    : STRING;

  sPalavra   : STRING;

   OL_POS    : INTEGER;

   ol_nome_completo : string;

   ol_TERMO          : string;

   ol_EMPRESA        : string;

begin

  Result             := '';
   ol_nome_completo  := '';



  OL_NOME := LowerCase(   trim(NOME)   );


      while  TRIM(OL_NOME) <> '' DO
      Begin


            OL_POS  := Pos(' ', OL_NOME  ) ;

            If OL_POS > 0 then
            BEGIN

                sPalavra   :=   Copy(  OL_NOME  , 1,   OL_POS    )

            END
            ELSE
            BEGIN

                sPalavra   :=  OL_NOME;
            END;


            ol_TERMO := TRIM(sPalavra);


             if
                 ( (Length(ol_TERMO) > 2)   and
                   (ol_TERMO <> 'das')     and
                   (ol_TERMO <> 'dos') )   Then
             BEGIN

              ol_TERMO  := UpperCase(sPalavra[1]) + copy( sPalavra, 2, Length(sPalavra) );

             END;


            ol_EMPRESA      := LowerCase(TRIM(ol_TERMO));


             if ol_EMPRESA = 'ltda'  then
             BEGIN

                 ol_TERMO := 'LTDA';
             END;

             if ol_EMPRESA = 'me'  then
             BEGIN

                 ol_TERMO := 'ME';
             END;

             if ol_EMPRESA = 'sa'  then
             BEGIN

                 ol_TERMO := 'SA';
             END;




             ol_nome_completo   := ol_nome_completo + ' '  + TRIM(ol_TERMO);


             OL_NOME := stringReplace(OL_NOME, sPalavra, '', []);




      End;



        Result :=  TRIM(ol_nome_completo);



end;




 function GETkEYWORD(OP_PRODUTO_NAME  : string):String;
VAR
  OL_KEYWORD    : STRING;

  ol_tamanho   : integer;
begin
    RESULT := '';

    OL_KEYWORD := OP_PRODUTO_NAME;

    OL_KEYWORD := StringReplace(OL_KEYWORD, '-', ' ', [rfreplaceall]);

   OL_KEYWORD := StringReplace(OL_KEYWORD, ' - ', '', [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, ' -', '', [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, '- ', '', [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, '  ', ' ', [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, '  ', ' ', [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, ' ', ', ', [rfreplaceall]);

   OL_KEYWORD := trim(OL_KEYWORD ) ;



   OL_KEYWORD := StringReplace(OL_KEYWORD, ', da, ',  ' da ',  [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, ', de, ',  ' de ',  [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, ', do, ',  ' do ',  [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, ', das, ', ' das ', [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, ', dos, ', ' dos ', [rfreplaceall]);
   OL_KEYWORD := StringReplace(OL_KEYWORD, ', e, ',   ' e ',   [rfreplaceall]);


   OL_KEYWORD := ExtraireCadastrarKeyWords  (OL_KEYWORD  );

   ol_tamanho  :=   Length(OL_KEYWORD);


   if ol_tamanho > 0  then
   begin
       if OL_KEYWORD[ol_tamanho] = ',' then
       begin

            delete(OL_KEYWORD,ol_tamanho,1);
            //  showMessage('e');

       end;
   end;



   RESULT := OL_KEYWORD;;

end;



{$REGION ' ------------- METAS TAGS PAGINAS PRODUTOS --------------------------'}


function TDtmFunctions.Get_TITLE_PRODUTO(OP_NOME: STRING): STRING;
VAR
  ol_META_TITLE : STRING;
begin

   ol_META_TITLE      := '';
   RESULT             := '';


  ol_META_TITLE := stringReplace(OP_NOME, '/', ' e ', []);
  ol_META_TITLE := stringReplace(OP_NOME, '\', ' e ', []);

  RESULT    :=  ol_META_TITLE   + ' em Ribeirão Preto';


end;



function TDtmFunctions.Get_DESCRIPTION_PRODUTO(
                                                OP_NOME_PRODUTO   : STRING;
                                                OP_NOME_FAMILIA   : STRING;
                                                OP_NOME_GRUPO     : STRING;
                                                OP_NOME_SUBGRUPO  : STRING
                                                ): STRING;
VAR



    TERMO_INICIAL_01        : STRING;
    TERMO_INICIAL_02        : STRING;
    TERMO_INICIAL_03        : STRING;
    TERMO_INICIAL_04        : STRING;
    TERMO_INICIAL_05        : STRING;
    TERMO_INICIAL_06        : STRING;
    TERMO_INICIAL_07        : STRING;
    TERMO_INICIAL_08        : STRING;
    TERMO_INICIAL_09        : STRING;
    TERMO_INICIAL_10        : STRING;
    TERMO_INICIAL_ESCOLHIDO : STRING;


    TERMO_FINAL_01          : STRING;
    TERMO_FINAL_02          : STRING;
    TERMO_FINAL_03          : STRING;
    TERMO_FINAL_04          : STRING;
    TERMO_FINAL_05          : STRING;
    TERMO_FINAL_06          : STRING;
    TERMO_FINAL_07          : STRING;
    TERMO_FINAL_08          : STRING;
    TERMO_FINAL_09          : STRING;
    TERMO_FINAL_10          : STRING;
    TERMO_FINAL_ESCOLHIDO   : STRING;
    OL_RANDO                : INTEGER;
    ol_count                : INTEGER;



    ol_META_DESCRIPTION   : STRING;





begin



    TERMO_INICIAL_01          :=  'Confira ofertas de';
    TERMO_INICIAL_02          :=  'Confira as melhores ofertas de';
    TERMO_INICIAL_03          :=  'Aproveite a promoção de';
    TERMO_INICIAL_04          :=  'Aproveite e compre agora';
    TERMO_INICIAL_05          :=  'Economize comprando agora';
    TERMO_INICIAL_06          :=  'Encontre aqui';
    TERMO_INICIAL_07          :=  'Confira os menores preços em';
    TERMO_INICIAL_08          :=  'Confira ofertas e promoções de ';
    TERMO_INICIAL_09          :=  'Visite e veja nossas promoções para';
    TERMO_INICIAL_10          :=  'Venha conferir, temos as melhores ofertas em';
    TERMO_INICIAL_ESCOLHIDO   :=  ' ';


    TERMO_FINAL_01            :=  'confira as ofertas.';
    TERMO_FINAL_02            :=  'ótimos preços!';
    TERMO_FINAL_03            :=  'aproveite o menor preços.';
    TERMO_FINAL_04            :=  'menores preços.';
    TERMO_FINAL_05            :=  'aproveite e compre Agora o Seu!';
    TERMO_FINAL_06            :=  'entrega Garantida.';
    TERMO_FINAL_07            :=  'economize compare preços.';
    TERMO_FINAL_08            :=  'excelente oferta.';
    TERMO_FINAL_09            :=  'economize compre mais barato.';
    TERMO_FINAL_10            :=  'venha fazer ótimos negócios. Aproveite!';
    TERMO_FINAL_ESCOLHIDO     :=  '';



    OL_RANDO := 1 + Random(10);


  case OL_RANDO of
    1: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_01;
    2: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_02;
    3: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_03;
    4: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_04;
    5: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_05;
    6: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_06;
    7: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_07;
    8: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_08;
    9: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_09;
    10: TERMO_INICIAL_ESCOLHIDO  :=    TERMO_INICIAL_10;
  end;


   OL_RANDO := 1 + Random(10);

  case OL_RANDO of
    1: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_01;
    2: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_02;
    3: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_03;
    4: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_04;
    5: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_05;
    6: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_06;
    7: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_07;
    8: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_08;
    9: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_09;
    10: TERMO_FINAL_ESCOLHIDO  :=    TERMO_FINAL_10;
  end;



    ol_META_DESCRIPTION   :=  TERMO_INICIAL_ESCOLHIDO  +  ' ' + OP_NOME_FAMILIA + ' para '+ OP_NOME_PRODUTO + ' ' + OP_NOME_GRUPO + ' ' + TERMO_FINAL_ESCOLHIDO  + ' Somos a maior loja de Ribeirão Preto São Paulo';


    RESULT :=  ol_META_DESCRIPTION;









end;


function TDtmFunctions.Get_KEYWORD_CATEGORIA(
                                              OP_NOME_FAMILIA   : STRING;
                                              OP_NOME_GRUPO     : STRING;
                                              OP_NOME_SUBGRUPO  : STRING
                                       ): STRING;
var

    ol_kEYWORD            : String;


begin




     ol_kEYWORD      :=  OP_NOME_FAMILIA  + ' ' +  OP_NOME_GRUPO + ' '  + OP_NOME_SUBGRUPO;


     ol_kEYWORD  :=  GETkEYWORD( ol_kEYWORD  ) ;


     RESULT :=  TRIM(ol_kEYWORD );



end;



{$ENDREGION}

{$REGION ' ------------- METAS TAGS PAGINAS CATEGORIA -------------------------'}


function TDtmFunctions.Get_TITLE_CATEGORIA(
                                            OP_NOME_FAMILIA,
                                            OP_NOME_GRUPO,
                                            OP_NOME_SUBGRUPO: STRING
                                            ): STRING;
VAR
  ol_META_TITLE : STRING;
begin

   ol_META_TITLE      := '';
   RESULT             := '';






     if trim(OP_NOME_FAMILIA) <> '' then
     begin


          ol_META_TITLE    := trim(OP_NOME_FAMILIA);

     end;


     if trim(  OP_NOME_GRUPO  ) <> '' then
     begin


          ol_META_TITLE    :=  trim(OP_NOME_GRUPO )  + ' departamento de  '+  trim(OP_NOME_FAMILIA) ;

     end;


     if trim(  OP_NOME_SUBGRUPO  ) <> '' then
     begin



           ol_META_TITLE   :=  trim(  OP_NOME_SUBGRUPO  )  + ' departamento de '+  trim(  OP_NOME_SUBGRUPO  ) ;

     end;



  ol_META_TITLE := stringReplace(ol_META_TITLE, '/', ' e ', []);
  ol_META_TITLE := stringReplace(ol_META_TITLE, '\', ' e ', []);



  RESULT    :=  ol_META_TITLE   + ' em Ribeirão Preto';


end;







function TDtmFunctions.Get_DESCRIPTION_CATEGORIA(
                                                  OP_NOME_PRODUTO   : STRING;
                                                  OP_NOME_FAMILIA   : STRING;
                                                  OP_NOME_GRUPO     : STRING;
                                                  OP_NOME_SUBGRUPO  : STRING
                                                ): STRING;
VAR



    TERMO_INICIAL_01        : STRING;
    TERMO_INICIAL_02        : STRING;
    TERMO_INICIAL_03        : STRING;
    TERMO_INICIAL_04        : STRING;
    TERMO_INICIAL_05        : STRING;
    TERMO_INICIAL_06        : STRING;
    TERMO_INICIAL_07        : STRING;
    TERMO_INICIAL_08        : STRING;
    TERMO_INICIAL_09        : STRING;
    TERMO_INICIAL_10        : STRING;
    TERMO_INICIAL_ESCOLHIDO : STRING;


    TERMO_FINAL_01          : STRING;
    TERMO_FINAL_02          : STRING;
    TERMO_FINAL_03          : STRING;
    TERMO_FINAL_04          : STRING;
    TERMO_FINAL_05          : STRING;
    TERMO_FINAL_06          : STRING;
    TERMO_FINAL_07          : STRING;
    TERMO_FINAL_08          : STRING;
    TERMO_FINAL_09          : STRING;
    TERMO_FINAL_10          : STRING;
    TERMO_FINAL_ESCOLHIDO   : STRING;
    OL_RANDO                : INTEGER;
    ol_count                : INTEGER;



    ol_META_DESCRIPTION   : STRING;



    ol_META_TITLE    : STRING;

begin


    ol_META_DESCRIPTION  :=   '';
    ol_META_TITLE        :=  '';



    TERMO_INICIAL_01          :=  'Confira ofertas de';
    TERMO_INICIAL_02          :=  'Confira as melhores ofertas de';
    TERMO_INICIAL_03          :=  'Aproveite a promoção de';
    TERMO_INICIAL_04          :=  'Aproveite e compre agora';
    TERMO_INICIAL_05          :=  'Economize comprando agora';
    TERMO_INICIAL_06          :=  'Encontre aqui';
    TERMO_INICIAL_07          :=  'Confira os menores preços em';
    TERMO_INICIAL_08          :=  'Confira ofertas e promoções de ';
    TERMO_INICIAL_09          :=  'Visite e veja nossas promoções para';
    TERMO_INICIAL_10          :=  'Venha conferir, temos as melhores ofertas em';
    TERMO_INICIAL_ESCOLHIDO   :=  ' ';


    TERMO_FINAL_01            :=  'confira as ofertas.';
    TERMO_FINAL_02            :=  'ótimos preços!';
    TERMO_FINAL_03            :=  'aproveite o menor preços.';
    TERMO_FINAL_04            :=  'menores preços.';
    TERMO_FINAL_05            :=  'aproveite e compre Agora o Seu!';
    TERMO_FINAL_06            :=  'entrega Garantida.';
    TERMO_FINAL_07            :=  'economize compare preços.';
    TERMO_FINAL_08            :=  'excelente oferta.';
    TERMO_FINAL_09            :=  'economize compre mais barato.';
    TERMO_FINAL_10            :=  'venha fazer ótimos negócios. Aproveite!';
    TERMO_FINAL_ESCOLHIDO     :=  '';



    OL_RANDO := 1 + Random(10);


  case OL_RANDO of
    1: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_01;
    2: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_02;
    3: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_03;
    4: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_04;
    5: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_05;
    6: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_06;
    7: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_07;
    8: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_08;
    9: TERMO_INICIAL_ESCOLHIDO   :=    TERMO_INICIAL_09;
    10: TERMO_INICIAL_ESCOLHIDO  :=    TERMO_INICIAL_10;
  end;


   OL_RANDO := 1 + Random(10);

  case OL_RANDO of
    1: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_01;
    2: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_02;
    3: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_03;
    4: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_04;
    5: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_05;
    6: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_06;
    7: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_07;
    8: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_08;
    9: TERMO_FINAL_ESCOLHIDO   :=    TERMO_FINAL_09;
    10: TERMO_FINAL_ESCOLHIDO  :=    TERMO_FINAL_10;
  end;



     if trim(OP_NOME_FAMILIA) <> '' then
     begin

          ol_META_TITLE    := trim(OP_NOME_FAMILIA) + ' em Ribeirão Preto SP'

     end;


     if trim(OP_NOME_GRUPO) <> '' then
     begin

          ol_META_TITLE    :=  trim(OP_NOME_GRUPO)  + ' em '+  trim(OP_NOME_FAMILIA) ;

     end;


     if trim(OP_NOME_SUBGRUPO) <> '' then
     begin


             ol_META_TITLE   :=  trim(OP_NOME_SUBGRUPO)  + ' em '+  trim( OP_NOME_GRUPO) ;

     end;




    ol_META_TITLE := stringReplace(ol_META_TITLE, '/', ' e ', []);
     ol_META_TITLE := stringReplace(ol_META_TITLE, '\', ' e ', []);


    ol_META_DESCRIPTION   :=  TERMO_INICIAL_ESCOLHIDO  +  ' ' + ol_META_TITLE  + ' ' +   TERMO_FINAL_ESCOLHIDO  + ' Somos a maior loja de Ribeirão Preto São Paulo';

    RESULT :=  ol_META_DESCRIPTION;






end;







function TDtmFunctions.Get_KEYWORD_PRODUTO(OP_NOME: STRING): STRING;
var

    ol_kEYWORD : String;

begin

  RESULT := '';

  ol_kEYWORD  :=  GETkEYWORD( OP_NOME );

  RESULT :=  TRIM(ol_kEYWORD );


end;












{$ENDREGION}




end.