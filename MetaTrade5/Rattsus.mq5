//+------------------------------------------------------------------+

//|                                                    RattsusV1.mq5 |

//|                                                     Victor Ratts |

//|                                https://github.com/victorratts13/ |

//+------------------------------------------------------------------+

#property copyright "Victor Ratts"

#property link      "https://github.com/victorratts13/Rattsus"

#property version   "1.05"

#property description "Bot para operações em Automaticas com Bandas de Bolinger (OBS: para maior acertividade, ultilise o tempo grafico de 5M a 15M)"


//input int SMA_val = 99; // valor SMA

//input int EMA_val = 100; // valor EMA

//input int RSI_val = 195; //valor RSI

input int BBp_val = 20; // Periodo das média

input int BBs_val = 0; // Deslocamento Horizontal

input double BBST_val = 2.5; // valor do dislocamento



input double VolumeOrder = 0.16; // Volume das ordens

input double stopOrder = 0.005; // valor do stop

input double tpOrder = 0.05;// valor Take Proffit



//input int upVal = 60; // Valor do RSI acima

//input int downVal = 50;// Valor do RSI abaixo

int valueDig =  Digits();

#include <Trade\Trade.mqh>

CTrade trade;

//+------------------------------------------------------------------+

//| Expert initialization function                                   |

//+------------------------------------------------------------------+

int OnInit()

  {

//---

   

//---

   return(INIT_SUCCEEDED);

  }

//+------------------------------------------------------------------+

//| Expert deinitialization function                                 |

//+------------------------------------------------------------------+

void OnDeinit(const int reason)

  {

//---

   

  }
int Crossing(double LP, double MD, double MU, double EMA){
   if(LP <= MD && LP > EMA){
      return 1;
   }
   
   if(LP >= MU && LP < EMA){
      return 2;
   }
   return 0;
}
//+------------------------------------------------------------------+

//| Expert tick function                                             |

//+------------------------------------------------------------------+

void OnTick()

  {

//---

   double ask, bid, lastPrice;
   
   double MidleBandArr[], upBandArr[], LowerBandArr[], emaArray[];
   
   ArraySetAsSeries(MidleBandArr, true);
   ArraySetAsSeries(upBandArr, true);
   ArraySetAsSeries(LowerBandArr, true);
   
   int emaHandle = iMA(_Symbol, _Period, 100, 0, MODE_EMA, PRICE_CLOSE);
   CopyBuffer(emaHandle, 0, 0, 3, emaArray);
   
   int BollingerBandsDefinitions = iBands(_Symbol, _Period, BBp_val, BBs_val, BBST_val, PRICE_CLOSE);
   
   CopyBuffer(BollingerBandsDefinitions, 0,0,3, MidleBandArr);
   CopyBuffer(BollingerBandsDefinitions, 1,0,3, upBandArr);
   CopyBuffer(BollingerBandsDefinitions, 2,0,3, LowerBandArr);
   
   double MyMidle = MidleBandArr[0];
   double MyUp = upBandArr[0];
   double MyDown = LowerBandArr[0];
   
   double stopLoss = stopOrder * 1000;
   double takeProft = tpOrder * 1000;

   double poen;

   if(Digits() == 3 || Digits() == 5){
    poen = 10*Point(); 
   }else{ 
    poen = Point();
   }
   
   ask  = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   lastPrice = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   
   double SL = NormalizeDouble(stopLoss*poen, Digits());
   double TP = NormalizeDouble(takeProft*poen, Digits());

   double typeStop = SymbolInfoDouble(_Symbol, SYMBOL_ASK) + stopOrder;
   double typeBid = SymbolInfoDouble(_Symbol, SYMBOL_BID) - tpOrder;
   
   float actualParice = PRICE_CLOSE;
   Comment("Order Values: ", VolumeOrder);
   Print("Volume: ", VolumeOrder);
//====================================================================================

//====================================================================================
   if(Crossing(lastPrice, MyDown, MyUp, emaArray[0]) == 1){
      if(PositionSelect(_Symbol) == 1){
         if(PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_SELL){
            trade.PositionClose(_Symbol);
            Print("Fechando Posicao Aberta: Sell");
         }
      }else{
         if(!trade.Buy(VolumeOrder, _Symbol, ask, typeBid ,  typeStop , "Compra"))
           {
            //--- failure message
            Print("Buy() method failed. Return code=",trade.ResultRetcode(),
                  ". Code description: ",trade.ResultRetcodeDescription());
           }
         else
           {
            Print("Buy() method executed successfully. Return code=",trade.ResultRetcode(),
                  " (",trade.ResultRetcodeDescription(),")");
           }
        // Comment("Lançando compra");
        // trade.Buy(VolumeOrder, _Symbol, ask, typeBid ,  typeStop , "Compra");
        // Print("COMPRA LANÇADA");
      }
   }

   if(Crossing(lastPrice, MyDown, MyUp, emaArray[0]) == 2){
      if(PositionSelect(_Symbol) == 1){
         if(PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY){
              trade.PositionClose(_Symbol);
              Print("Fechando Posicao Aberta: Buy");
         }
      }else{
         if(!trade.Sell(VolumeOrder, _Symbol, bid, typeStop, typeBid, "Venda"))
           {
            //--- failure message
            Print("Sell() method failed. Return code=",trade.ResultRetcode(),
                  ". Code description: ",trade.ResultRetcodeDescription());
           }
         else
           {
            Print("Sell() method executed successfully. Return code=",trade.ResultRetcode(),
                  " (",trade.ResultRetcodeDescription(),")");
           }
        // Comment("Lançando Venda");
        // trade.Sell(VolumeOrder, _Symbol, bid, typeStop, typeBid, "Venda");
        // Print("VENDA LANÇADA");
      }
   }
   
   if(Crossing(lastPrice, MyDown, MyUp, emaArray[0]) == 0){
      Comment("Aguardando Posicao");
   }
   
   
   
/*
   double smaArray[], emaArray[], rsiArray[], bbArray[];

   int smaHandle, emaHandle, rsiHandle, bbHandle;

   

   smaHandle = iMA(_Symbol, _Period, SMA_val, 0, MODE_SMA, PRICE_CLOSE);

   emaHandle = iMA(_Symbol, _Period, EMA_val, 0, MODE_EMA, PRICE_CLOSE);

   rsiHandle = iRSI(_Symbol, _Period, RSI_val, PRICE_CLOSE);
   
   bbHandle = iBands(_Symbol, _Period, BBp_val, BBs_val, BBST_val, PRICE_CLOSE);
   
   

   ask  = SymbolInfoDouble(_Symbol, SYMBOL_ASK);

   bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   lastPrice = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   CopyBuffer(smaHandle, 0, 0, 3, smaArray);

   CopyBuffer(emaHandle, 0, 0, 3, emaArray);

   CopyBuffer(rsiHandle, 0, 0, 3, rsiArray);
   
   CopyBuffer(bbHandle, 0, 0, 3, bbArray);

   double stopLoss = stopOrder * 1000;

   double takeProft = tpOrder * 1000;

   

   double poen;

   

   if(Digits() == 3 || Digits() == 5){

    poen = 10*Point(); 

   }else{ 

    poen = Point();

   

   }



   double SL = NormalizeDouble(stopLoss*poen, Digits());

   double TP = NormalizeDouble(takeProft*poen, Digits());

   

   double typeStop = SymbolInfoDouble(_Symbol, SYMBOL_ASK) + stopOrder;

   double typeBid = SymbolInfoDouble(_Symbol, SYMBOL_BID) - tpOrder;

   

   

   ArraySetAsSeries(smaArray, true);

   

   if(smaArray[0] < emaArray[0] && rsiArray[0] > upVal ){

      if(PositionSelect(_Symbol) == 1){

         if(PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_SELL){

            trade.PositionClose(_Symbol);

         }

      }else{

         Comment("Lançando compra");

         trade.Buy(VolumeOrder, _Symbol, ask, typeBid ,  typeStop , "Compra");

      

      }

   }



   if(smaArray[0] > emaArray[0] && rsiArray[0] < downVal ){

      if(PositionSelect(_Symbol) == 1){

         if(PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY){

              trade.PositionClose(_Symbol);

         }

      }else{

         Comment("Lançando Venda");

         trade.Sell(VolumeOrder, _Symbol, bid, typeStop, typeBid, "Venda");

      }

   }

   //Comment("Preço Ask: ", ask, " Preço Bid ", bid);
   
   Print(bbArray[0]);
*/
  }

//+------------------------------------------------------------------+

