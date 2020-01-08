
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
    clearModule('./var/lastOrderStop.js');
    var stopOrderlast = require('./var/lastOrderStop');
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
                console.log('\033c Bem-Vindo ao Rattsus v1.0.2 \n \x1b[47m \x1b[30m dados obtidos com sucesso, trabalhando com informações... \x1b[0m');
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

                function buyFunction(){
                    setTimeout(() => {
                        if(lastOrderSend.side == 'Sell'){
                            request(requestOptionsBuy, (err, resp, body) => {
                                if(err){console.log('erro ao comprar -> '+err)}else{
                                    console.log('\x1b[32m executando compra:'+body);
                                    var lastOrder = `var lastOrderSend = ${body}; module.exports = lastOrderSend;`;
                                    fs.writeFile('./var/lastOrder.js', lastOrder, (err) => {
                                        if(err){
                                            console.log(err)
                                        }else{
                                            console.log('create temporary lastOrder File on ./var/lastOrder.js \n');
                                        }
                                    }); 
                                }
                            })
                        }else{
                            console.log('Compra executada... Aguardando Venda')
                        }
                    }, 1500)    
                }

                function sellFunction(){
                    setTimeout(() => {
                        if(lastOrderSend.side == 'Buy'){
                            request(requestOptionsSell, (err, resp, body) => {
                                if(err){console.log('erro ao Vender -> '+err)}else{
                                    console.log('\x1b[32m executando Venda:'+body);
                                    var lastOrder = `var lastOrderSend = ${body}; module.exports = lastOrderSend;`;
                                    fs.writeFile('./var/lastOrder.js', lastOrder, (err) => {
                                        if(err){
                                            console.log(err)
                                        }else{
                                            console.log('create temporary lastOrder File on ./var/lastOrder.js \n');
                                        }
                                    }); 
                                }
                            })
                        }else{
                            console.log('Venda executada... Aguardando compra')
                        }                      
                    }, 1500)    
                }

                function stopSellFunction(){
                    setTimeout(() => {
                        if(stopOrderlast.side == 'Buy'){
                            if(lastOrderSend.ordType == config.lm_mk){
                                console.log(' \x1b[32m executando Stop Sell:');
                                request(requestOptionsStopSell, function(error, response, body) {
                                    if (error) { console.log(error); }else{
                                        console.log(body);
                                        var lastOrderStop = `var lastOrderStop = {type: 'stop', side: 'Sell'}; module.exports = lastOrderStop;`;
                                        fs.writeFile('./var/lastOrderStop.js', lastOrderStop, (err) => {
                                            if(err){
                                                console.log(err)
                                            }else{
                                                console.log('create temporary lastOrderStop File on ./var/lastOrderStop.js \n');
                                            }
                                        }); 
                                    }
                                });
                            }
                        }else{
                            console.log('SellStop Lançado')
                        }
                    }, 2000)    
                }

                function stopBuyFunction(){
                    setTimeout(() => {
                        if(stopOrderlast.side == 'Sell'){
                            if(lastOrderSend.ordType == config.lm_mk){
                                console.log(' \x1b[32m executando Stop Buy:');
                                request(requestOptionsStopBuy, function(error, response, body) {
                                    if (error) { console.log(error); }else{
                                        console.log(body);
                                        var lastOrderStop = `var lastOrderStop = {type: 'stop', side: 'Buy'}; module.exports = lastOrderStop;`;
                                        fs.writeFile('./var/lastOrderStop.js', lastOrderStop, (err) => {
                                            if(err){
                                                console.log(err)
                                            }else{
                                                console.log('create temporary lastOrderStop File on ./var/lastOrderStop.js \n');
                                            }
                                        }); 
                                    }
                                });
                            }
                        }else{
                            console.log('BuyStop Lançado')
                        }
                    }, 2000)    
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



                if(cross(MaVerse, MeVerse, RiVerse) == 1){
                    if(lastOrderSend.side == 'Sell'){
                        request(requestOptionsClose, function(error, response, body) {
                            if (error) { console.log(error); }else{
                                console.log(' \x1b[32m Executando Close -> '+body);
                            }
                        });
                        buyFunction()
                        if(stopOrderlast.side == 'Sell'){
                            console.log(' \x1b[32m executando Delet Stop: Sell');
                            request(requestOptionsDellSell, function(error, response, body) {
                                if (error) { console.log(error); }else{
                                    console.log(body);
                                    stopBuyFunction()
                                }
                            });
                        }
                    }
                    if(lastOrderSend.side == 'Buy'){
                        console.log('Compra Lançada...')
                    }else{
                        console.log('aguardando Cruzamento... Compra')
                    }
                }

                if(cross(MaVerse, MeVerse, RiVerse) == 2){
                    if(lastOrderSend.side == 'Buy'){
                        request(requestOptionsClose, function(error, response, body) {
                            if (error) { console.log(error); }else{
                                console.log(' \x1b[32m Executando Close -> '+body);
                            }
                        });
                        sellFunction()
                        if(stopOrderlast.side == 'Buy'){
                        console.log(' \x1b[32m executando Delet Stop: Buy');
                            request(requestOptionsDellBuy, function(error, response, body) {
                                if (error) { console.log(error); }else{
                                    stopSellFunction()
                                    console.log(body);
                                }
                            });
                        }
                    }
                    if(lastOrderSend.side == 'Sell'){
                        console.log('Venda Lançada...')
                    }else{
                        console.log('aguardando Cruzamento... Venda')
                    }
                }

                if(cross(MaVerse, MeVerse, RiVerse) == 0){
                    console.log('\n \x1b[46m \x1b[37m Aguardando entradas / Cruzamentos... \x1b[0m')
                }

            }
        })
    })    
}, interval);
