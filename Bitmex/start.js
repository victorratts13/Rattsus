
const config = require('./configs/configs');
const fs = require('fs');
const request = require('request');
const SMA = require('technicalindicators').SMA;
const EMA = require('technicalindicators').EMA;
const RSI = require('technicalindicators').RSI;
const crypto = require('crypto');
const clearModule = require('clear-module');
let interval = config.requestTime;

setInterval(() => {
    clearModule('./var/lastOrder.js');
    var lastOrderSend = require('./var/lastOrder');
    let port = config.port;
    let uri = config.localRequest;
    let url = uri+':'+port;
    let smb = config.symbol;
    let uriPost = config.remoteRequest;
    //#### request 01 ####
    request({
        url: config.remoteRequest+config.remoteBook+'symbol='+config.symbol+'&depth=1',
        json: true
    } , (err, resp, body) => {
        if(err){
            console.log('error on request 01. See -> '+err)
        }

        book = body;
        var bookBuy = book[1].price;
        var bookSell = book[0].price;
        var buy_percect, sell_percect;
        buy_percect = bookBuy * 3 / 100;
        sell_percect = bookSell * 3 / 100;

       buy_percect = parseInt(buy_percect);
       sell_percect = parseInt(sell_percect);

        const apiKey = config.api;
        const apiSecret = config.secret;
        let link = url + '/history';
        let unix = new Date().getTime() / 1000;
        let timeUnix = parseInt(unix);
        let outUnix = timeUnix - 86400;
        let query = `?symbol=${smb}&from=${outUnix}&to=${timeUnix}&resolution=1`;

        //#### request 02 ####
        request({
            url: link + query,
            json: true
        }, (err, resp, body) => {
            if(err){
                console.log('error on request 02. See -> '+err)
            }else{
                let chartValue = body;
                console.log('\033c Bem-Vindo ao BotRage v2.6.2 \n \x1b[33m dados obtidos com sucesso, trabalhando com informações do \n Usuario');
                var actualValue = body.c.slice(-1)[0];
                let
                POST = 'POST',
                Del = 'DELETE',
                path = '/api/v1/order',
                pathDell = '/api/v1/order/all',
                pathClose = '/api/v1/order/closePosition',
                expire = new Date().getTime() / 1000, // 1 min in the future
                expires = parseInt(expire) + 26280000;
                if(config.lm_mk == 'Limit'){
                    //objeto de compra
                var buy = {
                    symbol: smb,//par
                    orderQty: config.volume,//quantidade de contratos
                    price: bookBuy,//preço limit
                    ordType: config.lm_mk,//tipo
                    //stopPx: actualValue - 70, // (5*actualValue/100), //% do Stop
                    side: "Buy",
                    text: "Send From Rattsus 1.0 -> Buy"
                    };
                    //Objeto de venda 
                var sell = {
                    symbol: smb,//par
                    orderQty: config.volume,//quantidade de contratos
                    price: bookSell,//preço limit
                    ordType: config.lm_mk,//tipo
                    //stopPx: actualValue + 70, // (5*actualValue/100),//% do stop
                    side: "Sell",
                    text: "Send From Rattsus 1.0 -> Sell"
                    };
                    //Objeto de fechamento
                var close = {
                        symbol: smb
                    },
                    //Delets
                    DellBuy = {
                        symbol: smb,
                        filter: {
                            side: 'Buy'
                        },
                        text: 'Send From Rattsus 1.0: Delet for Buy'
                    },
                    DellSell = {
                        symbol: smb,
                        filter: {
                            side: 'Sell'
                        },
                        text: 'Send From Rattsus 1.0: Delet for Sell'
                    },

                    DellLimit = {
                        symbol: smb,
                        filter: {
                            ordType: 'Limit'
                        },
                        text: 'Send From Rattsus 1.0: Delet for Limit Orders'
                    },
                    //Objeto de stop - Compra
                    stopBuy = {
                        symbol: smb,//par
                        orderQty: config.stopLoss,//quantidade de contratos
                        price: bookBuy,//preço limit
                        ordType:"StopLimit",//tipo
                        stopPx: bookBuy - buy_percect, //% do Stop
                        side: "Sell",
                        text: "Send From Rattsus 1.0 -> StopBuy"
                        },
                    //Objeto de stop - Venda    
                    stopSell = {
                        symbol: smb,//par
                        orderQty: config.stopLoss,//quantidade de contratos
                        price: bookSell,//preço limit
                        ordType:"StopLimit",//tipo
                        stopPx: bookSell + sell_percect, //% do Stop
                        side: "Buy",
                        text: "Send From Rattsus 1.0 -> StopSell"
                    }    
                    
                }
            
            if(config.lm_mk == 'Market'){
                //objeto de compra
                var buy = {
                    symbol: smb,//par
                    orderQty: config.volume,//quantidade de contratos
                    //price: actualValue,//preço limit
                    ordType: config.lm_mk,//tipo
                    //stopPx: actualValue - 70, // (5*actualValue/100), //% do Stop
                    side: "Buy",
                    text: "Send From Rattsus 1.0 -> Buy"
                    };
                    //Objeto de venda 
                var sell = {
                    symbol: smb,//par
                    orderQty: config.volume,//quantidade de contratos
                    //price: actualValue,//preço limit
                    ordType: config.lm_mk,//tipo
                    //stopPx: actualValue + 70, // (5*actualValue/100),//% do stop
                    side: "Sell",
                    text: "Send From Rattsus 1.0 -> Sell"
                    };
                    //Objeto de fechamento
                var close = {
                        symbol: smb
                    },
                    //Delets
                    DellBuy = {
                        symbol: smb,
                        filter: {
                            side: 'Buy'
                        },
                        text: 'Send From Rattsus 1.0 '
                    },
                    DellSell = {
                        symbol: smb,
                        filter: {
                            side: 'Sell'
                        },
                        text: 'Send From Rattsus 1.0 '
                    },
                    //Objeto de stop - Compra
                    stopBuy = {
                        symbol: smb,//par
                        orderQty: config.stopLoss,//quantidade de contratos
                        //price: actualValue - 1,//preço limit
                        ordType:"Stop",//tipo
                        stopPx: actualValue - 170, //% do Stop
                        side: "Sell",
                        text: "Send From Rattsus 1.0 -> StopBuy"
                        },
                    //Objeto de stop - Venda    
                    stopSell = {
                        symbol: smb,//par
                        orderQty: config.stopLoss,//quantidade de contratos
                        //price: actualValue + 1,//preço limit
                        ordType:"Stop",//tipo
                        stopPx: actualValue + 170, //% do Stop
                        side: "Buy",
                        text: "Send From Rattsus 1.0 -> StopSell"
                    }
                }
                
                var postBody = JSON.stringify(buy);
        
                var signatureBuy = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Buy -> '+signatureBuy);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureBuy
                };
                const requestOptionsBuy = {
                headers: headers,
                url: uriPost + path,
                method: POST,
                body: postBody 
                }

                var postBody = JSON.stringify(sell);
        
                var signatureSell = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Sell -> '+signatureSell);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureSell
                };
                const requestOptionsSell = {
                headers: headers,
                url: uriPost + path,
                method: POST,
                body: postBody 
                }
                var postBody = JSON.stringify(close);
        
                var signatureClose = crypto.createHmac('sha256', apiSecret).update(POST + pathClose + expires + postBody).digest('hex');
                console.log('Assinatura Close -> '+signatureClose);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureClose
                };
                const requestOptionsClose = {
                headers: headers,
                url: uriPost + pathClose,
                method: POST,
                body: postBody 
                }
                var postBody = JSON.stringify(stopBuy);
        
                var signatureStopBuy = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Stop/buy -> '+signatureStopBuy);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureStopBuy
                };
                const requestOptionsStopBuy = {
                headers: headers,
                url: uriPost + path,
                method: POST,
                body: postBody 
                }
                var postBody = JSON.stringify(stopSell);
        
                var signatureStopSell = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Stop/Sell -> '+signatureStopSell);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureStopSell
                };
                const requestOptionsStopSell = {
                headers: headers,
                url: uriPost + path,
                method: POST,
                body: postBody 
                }
                var postBody = JSON.stringify(DellBuy);
        
                var signatureDellBuy = crypto.createHmac('sha256', apiSecret).update(Del + pathDell + expires + postBody).digest('hex');
                console.log('Assinatura Dellet - Buy -> '+signatureDellBuy);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureDellBuy
                };
                const requestOptionsDellBuy = {
                headers: headers,
                url: uriPost + pathDell,
                method: Del,
                body: postBody 
                }
                
                var postBody = JSON.stringify(DellSell);
        
                var signatureDellSell = crypto.createHmac('sha256', apiSecret).update(Del + pathDell + expires + postBody).digest('hex');
                console.log('Assinatura Dellet - Sell -> '+signatureDellSell);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureDellSell
                };
                const requestOptionsDellSell = {
                headers: headers,
                url: uriPost + pathDell,
                method: Del,
                body: postBody 
                }
                
                var postBody = JSON.stringify(DellLimit);
        
                var signatureDellLimit = crypto.createHmac('sha256', apiSecret).update(Del + pathDell + expires + postBody).digest('hex');
                console.log('Assinatura Dellet - Limit -> '+signatureDellLimit);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureDellLimit
                };
                const requestOptionsDellLimit = {
                headers: headers,
                url: uriPost + pathDell,
                method: Del,
                body: postBody 
                }

                let inputRsi = {values: chartValue.c, period: config.RSI};
                
                let MA = SMA.calculate({period: config.SMA, values: chartValue.c});
                let ME = EMA.calculate({period: config.EMA, values: chartValue.c});
                let RI = RSI.calculate(inputRsi);

                let MaVerse = MA.slice(-1)[0];
                let MeVerse = ME.slice(-1)[0];
                let RiVerse = RI.slice(-1)[0];


                console.log('MA -> ' +MaVerse);
                console.log('EMA -> '+MeVerse);
                console.log('RIS -> '+RiVerse);

                function cross(MA, EMA, RSI){
                    if(MA > EMA && RSI < 40){
                        return 1; //sell
                    }
                    if(MA < EMA && RSI > 60){
                        return 2; //buy
                    }
                    return 0;
                }

                function buyFunction(){
                    if(lastOrderSend == 'Sell'){
                        console.log(' \x1b[32m executando compra:');
                        request(requestOptionsBuy, (error, resp, body) => {
                            if(error){console.log('Buy Error Request ->'+ error)}
                            var lastOrder = `var lastOrderSend = ${body}; module.exports = lastOrderSend;`;
                            fs.writeFile('./var/lastOrder.js', lastOrder, (err) => {
                                if(err){
                                    console.log(err)
                                }else{
                                    console.log('create temporary lastOrder File on ./var/lastOrder.js \n');
                                }
                            });                            
                        })
                    }
                }

                function sellFunction(){
                    if(lastOrderSend == 'Buy'){
                        console.log(' \x1b[32m executando Venda:');
                        request(requestOptionsSell, (error, resp, body) => {
                            if(error){console.log('Sell Error Request ->'+ error)}
                            var lastOrder = `var lastOrderSend = ${body}; module.exports = lastOrderSend;`;
                            fs.writeFile('./var/lastOrder.js', lastOrder, (err) => {
                                if(err){
                                    console.log(err)
                                }else{
                                    console.log('create temporary lastOrder File on ./var/lastOrder.js \n');
                                }
                            });                            
                        })
                    }
                }

                function stopSellFunction(){
                    if(lastOrderSend.ordType == config.lm_mk){
                        console.log(' \x1b[32m executando Stop Sell:');
                        request(requestOptionsStopSell, function(error, response, body) {
                            if (error) { console.log(error); }
                        console.log(body);
                        });
                    }
                }

                function stopBuyFunction(){
                    if(lastOrderSend.ordType == config.lm_mk){
                        console.log(' \x1b[32m executando Stop Buy:');
                        request(requestOptionsStopBuy, function(error, response, body) {
                            if (error) { console.log(error); }
                        console.log(body);
                        });
                    }
                }

                function DeletLimit(){
                    if(config.lm_mk == 'Limit'){
                        if(body.ordStatus == 'Filled'){
                            console.log(' \x1b[32m Executando Delete Limit');
                            request(requestOptionsDellLimit, function(error, response, body) {
                                if (error) { console.log(error); }
                            console.log(body);
                            });
                        }
                    }
                }
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
                if(cross(MaVerse, MeVerse, RiVerse) == 2){
                    if(lastOrderSend.ordType == 'Sell'){
                        console.log(' \x1b[32m Executando Close');
                        request(requestOptionsClose, function(error, response, body) {
                            if (error) { console.log(error); }
                            console.log(body);
                            });
                        }
                        if(lastOrderSend.side == 'Buy'){
                            if(lastOrderSend.ordType == config.lm_mk){
                                console.log('Compra executada... Aguardando Venda');
                            }
                            if(lastOrderSend.ordType == 'StopLimit'){
                                console.log(' \x1b[32m Executando Close');
                                request(requestOptionsClose, function(error, response, body) {
                                    if (error) { console.log(error); }
                                    console.log(body);
                                });
                                console.log(' \x1b[32m executando Deletando Stop: Sell');
                                request(requestOptionsDellBuy, function(error, response, body) {
                                    if (error) { console.log(error); }
                                console.log(body);
                                });
                                stopBuyFunction();
                                buyFunction();
                            }
                        }else{
                            console.log(' \x1b[32m executando Deletando Stop: Sell');
                            request(requestOptionsDellBuy, function(error, response, body) {
                                if (error) { console.log(error); }
                            console.log(body);
                            });
                            stopBuyFunction();
                            buyFunction();
                        }
                }else{
                    console.log('Aguardando proximo Cruzamento...')    
                }

                if(cross(MaVerse, MeVerse, RiVerse) == 1){
                    if(lastOrderSend.ordType == ' Buy'){
                        console.log(' \x1b[32m Executando Close');
                        request(requestOptionsClose, function(error, response, body) {
                            if (error) { console.log(error); }
                            console.log(body);
                            });
                        }
                        if(lastOrderSend.side == 'Sell'){
                            if(lastOrderSend.ordType == config.lm_mk){
                                console.log('Venda executada... Aguardando Venda');
                            }
                            if(lastOrderSend.ordType == 'StopLimit'){
                                console.log(' \x1b[32m Executando Close');
                                request(requestOptionsClose, function(error, response, body) {
                                    if (error) { console.log(error); }
                                    console.log(body);
                                });
                                console.log(' \x1b[32m executando Deletando Stop: Buy');
                                request(requestOptionsDellSell, function(error, response, body) {
                                    if (error) { console.log(error); }
                                console.log(body);
                                });
                                stopSellFunction();
                                SellFunction();
                            }
                        }else{
                            console.log(' \x1b[32m executando Deletando Stop: Buy');
                            request(requestOptionsDellSell, function(error, response, body) {
                                if (error) { console.log(error); }
                            console.log(body);
                            });
                            stopSellFunction();
                            sellFunction();
                        }
                }else{
                    console.log('Aguardando proximo Cruzamento...')    
                }
            }
        })
    })    
}, interval);