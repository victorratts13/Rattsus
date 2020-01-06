const config = require('./config/config');
const Poloniex = require('poloniex-api-node');
const request = require('request');
const fs = require('fs');
const clearModule = require('clear-module');
const apiKey = config.apiKey;
const apiSecret = config.apiSecret;
const interval = config.intervalRequest;
const SMA = require('technicalindicators').SMA;
const EMA = require('technicalindicators').EMA;
const RSI = require('technicalindicators').RSI;
const par = config.pair;
const port = config.UDFport;
const poloniex = new Poloniex(apiKey, apiSecret, { nonce: () => new Date().getTime() * 212665 }, {socketTimeout: 60000});
let cont = 0;
setInterval(() => {
    const dataTime = new Date();
    const uTime = parseInt(new Date().getTime() / 1000);
    const sub = config.subStamp;
    const period = config.period;
    const start = uTime - sub;
    const end = uTime;

    console.log('\033c Bem vindo ao Rattsus v1.0 (GENESIS) request num -> '+ cont++)
    console.log('\n TimeStamp -> '+uTime);
    console.log(' Data -> '+dataTime+'\n');
    if(config.useVol == false){
        poloniex.returnTicker((err, ticker) => {
            if(err){
                console.log('erro de requisição do ticker #001 -> '+err)
            }else{
                let lowesk = ticker.USDT_BTC.lowestAsk;
                let highest = ticker.USDT_BTC.highestBid;

                clearModule('./var/lastOrder');
                const tempFile = require('./var/lastOrder');
                let local = config.localRequest;
                let link = local+':'+port;
                request({
                    url: link+`/history?symbol=${par}&resolution=${period}&from=${start}&to=${end}`,
                    json: true
                }, (err, resp, body) => {
                    if(err){
                        console.log('erro de requisição local #002 -> '+err)
                    }else{
                        poloniex.returnBalances((err, balance) => {
                            if(err){
                                console.log('erro de requisição do balanço #003 -> '+err)
                            }else{
                                let walletBTC = balance.BTC;
                                let walletUSDT = balance.USDT;
                                console.log('Preço de compra BTC -> '+lowesk);
                                console.log('preço de venda BTC -> '+highest);


                                let inputRsi = {values: body.c, period: config.RSI};
                
                                let MA = SMA.calculate({period: config.SMA, values: body.c});
                                let ME = EMA.calculate({period: config.EMA, values: body.c});
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
                                    console.log('\x1b[36m Function Side -> StandBy \n')
                                }

                                console.log('BTC saldo -> '+balance.BTC )
                                console.log('USDT saldo -> '+balance.USDT )

                                let buyValue = walletUSDT / lowesk;
                                let sellValue = highest * walletBTC;

                                console.log('Valor de compra BTC -> '+buyValue);
                                console.log('valor de venda USDT -> '+sellValue);

                                console.log('ultima ordem lançada -> '+tempFile.type)
                                poloniex.returnFeeInfo((err, fee) => {
                                    if(err){
                                        console.log('erro de requisição de taxas #004 -> '+err)
                                    }else{
                                        rateInfo = fee.takerFee;
                                        console.log('Taxa -> '+rateInfo)


                                        function buy(currenciePair, rateData, buyVolume){
                                            poloniex.buy(currenciePair, rateData, buyVolume, 1, 1, 1, (err, resp) => {
                                                if(err){
                                                    console.log('algum erro ocorreu na compra #005 -> '+err)
                                                    console.log('mudando parametros e reenviando compra...');
                                                    poloniex.buy(currenciePair, rateData, buyVolume, 1, 1, 0, (err, resp) => {
                                                        if(err){
                                                            console.log('mudando parametros e reenviando compra...');
                                                            poloniex.buy(currenciePair, rateData, buyVolume, 1, 0, 1, (err, resp) => {
                                                                if(err){
                                                                    console.log('mudando parametros e reenviando compra...');
                                                                    poloniex.buy(currenciePair, rateData, buyVolume, 0, 1, 1, (err, resp) => {
                                                                        if(err){
                                                                            console.log('mudando parametros e reenviando compra...');
                                                                            poloniex.buy(currenciePair, rateData, buyVolume, 0, 1, 0, (err, resp) => {
                                                                                if(err){
                                                                                    console.log('mudando parametros e reenviando compra...');
                                                                                    poloniex.buy(currenciePair, rateData, buyVolume, 0, 0, 1, (err, resp) => {
                                                                                        if(err){
                                                                                            console.log('mudando parametros e reenviando compra...');
                                                                                            poloniex.buy(currenciePair, rateData, buyVolume, 1, 0, 0, (err, resp) => {
                                                                                                if(err){
                                                                                                    console.log('mudando parametros e reenviando compra...');
                                                                                                    poloniex.buy(currenciePair, rateData, buyVolume, 0, 0, 0, (err, resp) => {
                                                                                                        if(err){
                                                                                                            console.log('impossivel de executar a compra :(')
                                                                                                        }else{
                                                                                                            console.log('executando compra: '+resp)
                                                                                                            var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                                                                                                fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                                                if(err){
                                                                                                                    console.log(err)
                                                                                                                }else{
                                                                                                                    console.log('criado arquivo temporario -> Buy')
                                                                                                                }
                                                                                                            })
                                                                                                        }
                                                                                                    })   
                                                                                                }else{
                                                                                                    console.log('executando compra: '+resp)
                                                                                                    var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                                                                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                                        if(err){
                                                                                                            console.log(err)
                                                                                                        }else{
                                                                                                            console.log('criado arquivo temporario -> Buy')
                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        }else{
                                                                                            console.log('executando compra: '+resp)
                                                                                            var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                                                                                fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                                if(err){
                                                                                                    console.log(err)
                                                                                                }else{
                                                                                                    console.log('criado arquivo temporario -> Buy')
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                }else{
                                                                                    console.log('executando compra: '+resp)
                                                                                        var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                                                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                        if(err){
                                                                                            console.log(err)
                                                                                        }else{
                                                                                            console.log('criado arquivo temporario -> Buy')
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }else{
                                                                            console.log('executando compra: '+resp)
                                                                            var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                                                                fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                if(err){
                                                                                    console.log(err)
                                                                                }else{
                                                                                    console.log('criado arquivo temporario -> Buy')
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }else{
                                                                    console.log('executando compra: '+resp)
                                                                    var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                        if(err){
                                                                            console.log(err)
                                                                        }else{
                                                                            console.log('criado arquivo temporario -> Buy')
                                                                        }
                                                                    })
                                                                }                                                          
                                                            })
                                                        }else{
                                                            console.log('executando compra: '+resp)
                                                            var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                                                fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                if(err){
                                                                    console.log(err)
                                                                }else{
                                                                    console.log('criado arquivo temporario -> Buy')
                                                                }
                                                            })
                                                        }                                                            
                                                    })
                                                }else{
                                                    console.log('executando compra: '+resp)
                                                    var createTemp = "var lastOrder = {type: 'buy'}; module.exports = lastOrder;"
                                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                        if(err){
                                                            console.log(err)
                                                        }else{
                                                            console.log('criado arquivo temporario -> Buy')
                                                        }
                                                    })
                                                }
                                            })
                                        }

                                        function sell(currenciePair, rateData, sellVolume){
                                            poloniex.sell(currenciePair, rateData, sellVolume, 1, 1, 1, (err, resp) => {
                                                if(err){
                                                    console.log('algum erro ocorreu na venda #005 -> '+err)
                                                    console.log('mudando parametros e reenviando venda...');
                                                    poloniex.sell(currenciePair, rateData, sellVolume, 1, 1, 0, (err, resp) => {
                                                        if(err){
                                                            console.log('mudando parametros e reenviando venda...');
                                                            poloniex.sell(currenciePair, rateData, sellVolume, 1, 0, 1, (err, resp) => {
                                                                if(err){
                                                                    console.log('mudando parametros e reenviando venda...');
                                                                    poloniex.sell(currenciePair, rateData, sellVolume, 0, 1, 1, (err, resp) => {
                                                                        if(err){
                                                                            console.log('mudando parametros e reenviando venda...');
                                                                            poloniex.sell(currenciePair, rateData, sellVolume, 0, 1, 0, (err, resp) => {
                                                                                if(err){
                                                                                    console.log('mudando parametros e reenviando venda...');
                                                                                    poloniex.sell(currenciePair, rateData, sellVolume, 0, 0, 1, (err, resp) => {
                                                                                        if(err){
                                                                                            console.log('mudando parametros e reenviando venda...');
                                                                                            poloniex.sell(currenciePair, rateData, sellVolume, 1, 0, 0, (err, resp) => {
                                                                                                if(err){
                                                                                                    console.log('mudando parametros e reenviando venda...');
                                                                                                    poloniex.sell(currenciePair, rateData, sellVolume, 0, 0, 0, (err, resp) => {
                                                                                                        if(err){
                                                                                                            console.log('impossivel de executar a venda :(')
                                                                                                        }else{
                                                                                                            console.log('executando venda: '+resp)
                                                                                                            var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                                                                                                fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                                                if(err){
                                                                                                                    console.log(err)
                                                                                                                }else{
                                                                                                                    console.log('criado arquivo temporario -> Sell')
                                                                                                                }
                                                                                                            })
                                                                                                        }
                                                                                                    })   
                                                                                                }else{
                                                                                                    console.log('executando venda: '+resp)
                                                                                                    var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                                                                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                                        if(err){
                                                                                                            console.log(err)
                                                                                                        }else{
                                                                                                            console.log('criado arquivo temporario -> Sell')
                                                                                                        }
                                                                                                    })            
                                                                                                }
                                                                                            })
                                                                                        }else{
                                                                                            console.log('executando venda: '+resp)
                                                                                            var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                                                                                fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                                if(err){
                                                                                                    console.log(err)
                                                                                                }else{
                                                                                                    console.log('criado arquivo temporario -> Sell')
                                                                                                }
                                                                                            })            
                                                                                        }
                                                                                    })
                                                                                }else{
                                                                                    console.log('executando venda: '+resp)
                                                                                    var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                                                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                        if(err){
                                                                                            console.log(err)
                                                                                        }else{
                                                                                            console.log('criado arquivo temporario -> Sell')
                                                                                        }
                                                                                    })            
                                                                                }
                                                                            })
                                                                        }else{
                                                                            console.log('executando venda: '+resp)
                                                                            var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                                                                fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                                if(err){
                                                                                    console.log(err)
                                                                                }else{
                                                                                    console.log('criado arquivo temporario -> Sell')
                                                                                }
                                                                            })            
                                                                        }
                                                                    })
                                                                }else{
                                                                    console.log('executando venda: '+resp)
                                                                    var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                        if(err){
                                                                            console.log(err)
                                                                        }else{
                                                                            console.log('criado arquivo temporario -> Sell')
                                                                        }
                                                                    })            
                                                                }                                                          
                                                            })
                                                        }else{
                                                            console.log('executando venda: '+resp)
                                                            var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                                                fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                                if(err){
                                                                    console.log(err)
                                                                }else{
                                                                    console.log('criado arquivo temporario -> Sell')
                                                                }
                                                            })            
                                                        }                                                            
                                                    })
                                                }else{
                                                    console.log('executando venda: '+resp)
                                                    var createTemp = "var lastOrder = {type: 'sell'}; module.exports = lastOrder;"
                                                        fs.writeFile('./var/lastOrder.js', createTemp, (err) => {
                                                        if(err){
                                                            console.log(err)
                                                        }else{
                                                            console.log('criado arquivo temporario -> Sell')
                                                        }
                                                    })            
                                                }
                                            })
                                        }
                                        if(cross(MaVerse, MeVerse, RiVerse) == 1){
                                            if(tempFile.type == 'sell'){
                                                console.log('executando compra ...')
                                                buy(par, rateInfo, buyValue);
                                            }
                                        }else{
                                            console.log('aguardando proxima ordem...')
                                        }
                                        if(cross(MaVerse, MeVerse, RiVerse) == 2){
                                            if(tempFile.type == 'buy'){
                                                console.log('executando venda ...')
                                                sell(par, rateInfo, sellValue);
                                            }
                                        }else{
                                            console.log('aguardando proxima ordem...')
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}, interval)