const config = require('./config/config');
const request = require('request');
const fs = require('fs');
const clearModule = require('clear-module');
const SMA = require('technicalindicators').SMA;
const EMA = require('technicalindicators').EMA;
const RSI = require('technicalindicators').RSI;
const timeRequest = config.intervalRequest;
const port = config.requestPort;
const par = config.pair;
const interval = config.intervalTime;
const limit = config.requestLimit;
const api = config.apiKey;
const secret = config.apiSecret;
const resolution = config.resolution;
var requests = 0;
const binance = require('node-binance-api')().options({
    APIKEY: api,
    APISECRET: secret,
    useServerTime: true
});

setInterval(() => {
    clearModule('./var/lastOrder');
    const tempFile = require('./var/lastOrder');
    var consoles = '\033c\x1b[37m Bem Vindo ao Rattsus - Binance \n numero de requisições: '+ requests++ ;
    console.log(
        '\x1b[36m ############################################################################# \n'+
            consoles+'\n'+
        '\x1b[36m #############################################################################'    
    );
    let uTime = parseInt(new Date().getTime() / 1000);
    let from = uTime - 84000;
    let to = uTime;
    let link = `http://localhost:${port}/history?symbol=${par}&resolution=${resolution}&from=${from}&to=${to}`;
    
    request({
        url: link,
        json: true
    }, (err, resp, body) => {
        if(err){
            console.log('algum erro ocorreu na requisição: '+err)
        }else{
            binance.balance((error, balances) => {
                if(error){
                    console.log('erro ao requisitar balanços -> '+JSON.stringify(error))
                }else{
                    binance.exchangeInfo(function(error, data) {
                        let minimums = {};
                        for ( let obj of data.symbols ) {
                            let filters = {status: obj.status};
                            for ( let filter of obj.filters ) {
                                if ( filter.filterType == "MIN_NOTIONAL" ) {
                                    filters.minNotional = filter.minNotional;
                                } else if ( filter.filterType == "PRICE_FILTER" ) {
                                    filters.minPrice = filter.minPrice;
                                    filters.maxPrice = filter.maxPrice;
                                    filters.tickSize = filter.tickSize;
                                } else if ( filter.filterType == "LOT_SIZE" ) {
                                    filters.stepSize = filter.stepSize;
                                    filters.minQty = filter.minQty;
                                    filters.maxQty = filter.maxQty;
                                }
                            }
                            //filters.baseAssetPrecision = obj.baseAssetPrecision;
                            //filters.quoteAssetPrecision = obj.quoteAssetPrecision;
                            filters.orderTypes = obj.orderTypes;
                            filters.icebergAllowed = obj.icebergAllowed;
                            minimums[obj.symbol] = filters;
                        }
                        //console.log(minimums.BTCUSDT);
                        global.filters = minimums;

                        let minQty = minimums.BTCUSDT.minQty;
                        let minNotional = minimums.BTCUSDT.minNotional;
                        let stepSize = minimums.BTCUSDT.stepSize;
                        let priceOrder = body.c.slice(-1)[0];
                        let chartValue = body;
                        let walletBTC = balances.BTC.available / 1;
                        let walletUSDT = balances.USDT.available / 1;

                        walletBTC = walletBTC.toFixed(6);
                        walletUSDT = walletUSDT.toFixed(6);
                        let amountBuy = walletUSDT / priceOrder;
                        let amountSell = walletBTC / 1;
                        //buy
                        if(amountBuy < minQty){
                            amountBuy = minQty;
                        }

                        if(priceOrder * amountBuy < minNotional){
                            amountBuy = minNotional / priceOrder;
                        }
                        //sell
                        if(amountSell < minQty){
                            amountSell = minQty;
                        }

                        if(priceOrder * amountSell < minNotional){
                            amountSell = minNotional / priceOrder;
                        }

                        amountBuy = binance.roundStep(amountBuy, stepSize) - 0.000001
                        amountSell = binance.roundStep(amountSell, stepSize) - 0.000001
                        amountCalcBuy = priceOrder * amountBuy;
                        amountCalcSell = priceOrder * amountSell;
                        amountBuy = amountBuy.toFixed(6)
                        amountSell = amountSell.toFixed(6)

                        let inputRsi = {values: chartValue.c, period: config.RSI};
                            
                        let MA = SMA.calculate({period: config.SMA, values: chartValue.c});
                        let ME = EMA.calculate({period: config.EMA, values: chartValue.c});
                        let RI = RSI.calculate(inputRsi);

                        let MaVerse = MA.slice(-1)[0];
                        let MeVerse = ME.slice(-1)[0];
                        let RiVerse = RI.slice(-1)[0];


                        console.log('\x1b[37m MA  Value -> '+MaVerse+' - '+config.SMA);
                        console.log('\x1b[37m EMA Value -> '+MeVerse+' - '+config.EMA);
                        console.log('\x1b[37m RIS Value -> '+RiVerse+' - '+config.RSI);

                        function cross(MA, EMA, RSI){
                            if(MA > EMA && RSI < 40){
                                return 2; //sell
                            }
                            if(MA < EMA && RSI > 60){
                                return 1; //buy
                            }
                            return 0;
                        }

                        if(cross(MaVerse, MeVerse, RiVerse) == 1){
                            console.log('\x1b[32m Function Side -> Buy')
                        }
                        if(cross(MaVerse, MeVerse, RiVerse) == 2){
                            console.log('\x1b[31m Function Side -> Sell')
                        }
                        if(cross(MaVerse, MeVerse, RiVerse) == 0){
                            console.log('\x1b[36m Function Side -> StandBy')
                        }

                        function buy(pair, volume){
                            binance.marketBuy(pair, volume, (err, response) => {
                                if(err){
                                    console.log('erro ao comprar')
                                    console.log(JSON.stringify(err))
                                }else{
                                    console.log("Market Buy response", response);
                                    console.log("order id: " + response.orderId);
                                    var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                        if(err){
                                            console.log(err)
                                        }else{
                                            console.log('criado arquivo temporario -> Buy')
                                        }
                                    })                                
                                }
                            });
                        }

                        function sell(pair, volume){
                            binance.marketSell(pair, volume, (err, response) => {
                                if(err){
                                    console.log('erro ao vender')
                                    console.log(JSON.stringify(err))
                                }else{
                                    console.log("Market sell response", response);
                                    console.log("order id: " + response.orderId);
                                    var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                        if(err){
                                            console.log(err)
                                        }else{
                                            console.log('criado arquivo temporario -> Buy')
                                        }
                                    })       
                                }
                            });
                        }
                        console.log('### '+amountCalcBuy +' '+ amountCalcSell+' ### '+minNotional+' ### '+minQty)
                        console.log('|----------------configurações------------------------------------')
                        console.log('\n \x1b[33m preço atual de mercado: '+priceOrder+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Média Movel Simples: '+MaVerse+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Média Movel Exponencial: '+MeVerse+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Indice de Força Relativa: '+RiVerse+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Tamanho do RSI: '+config.RSI+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Tamanho do SMA: '+config.SMA+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Tamanho do EMA: '+config.EMA+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Par negociado: '+config.pair+'\n -------------------------------------------')
                        console.log('\n \x1b[33m intervalo de requisição: '+(config.intervalRequest / 1000)+' Segundos\n -------------------------------------------')
                        console.log('\n \x1b[33m Saldo BTC: '+walletBTC+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Saldo USDT '+walletUSDT+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Ultima Ordem: '+tempFile.type+'\n -------------------------------------------')
                        console.log('\n \x1b[33m amountBuy Valor '+amountBuy+'\n -------------------------------------------')
                        console.log('\n \x1b[33m amountSell Valor '+amountSell+'\n -------------------------------------------')
                        console.log('\n \x1b[33m Execução de funções: compra & venda \n -------------------------------------------')

                        if(cross(MaVerse, MeVerse, RiVerse) == 1){
                            if(tempFile.type == 'sell'){
                                console.log('executando compra...')
                                buy(par, amountBuy)
                            }else{
                                console.log('compra lançada, aguardando venda...')
                            }
                        }else{
                            console.log('aguardando cruzamentos...');
                        }

                        if(cross(MaVerse, MeVerse, RiVerse) == 2){
                            if(tempFile.type == 'buy'){
                                console.log('executando venda...')
                                sell(par, amountSell)
                            }else{
                                console.log('venda lançada, aguardando compra...')
                            }
                        }else{
                            console.log('aguardando cruzamentos...');
                        }
                    });
                }
            });
        }
    })
}, timeRequest)
