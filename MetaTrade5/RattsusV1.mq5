//+------------------------------------------------------------------+
//|                                                    RattsusV1.mq5 |
//|                                                     Victor Ratts |
//|                                https://github.com/victorratts13/ |
//+------------------------------------------------------------------+
#property copyright "Victor Ratts"
#property link      "https://github.com/victorratts13/"
#property version   "1.01"

input int SMA_val = 99; // valor SMA
input int EMA_val = 10; // valor EMA
input int RSI_val = 195; //valor RSI

input double VolumeOrder = 1; // Volume das ordens
input double stopOrder = 1; // valor do stop
input double tpOrder = 1;// valor Take Proffit

input int upVal = 60; // Valor do RSI acima
input int downVal = 50;// Valor do RSI abaixo
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
//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
  {
//---
   double ask, bid, lastPrice;
   double smaArray[], emaArray[], rsiArray[];
   int smaHandle, emaHandle, rsiHandle;
   
   smaHandle = iMA(_Symbol, _Period, SMA_val, 0, MODE_SMA, PRICE_CLOSE);
   emaHandle = iMA(_Symbol, _Period, EMA_val, 0, MODE_EMA, PRICE_CLOSE);
   rsiHandle = iRSI(_Symbol, _Period, RSI_val, PRICE_CLOSE);
   ask  = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   lastPrice = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   CopyBuffer(smaHandle, 0, 0, 3, smaArray);
   CopyBuffer(emaHandle, 0, 0, 3, emaArray);
   CopyBuffer(rsiHandle, 0, 0, 3, rsiArray);
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
  }
//+------------------------------------------------------------------+
