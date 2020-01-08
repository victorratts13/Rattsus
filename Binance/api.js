const config = require('./config/config');
const express = require('express');
const app = express();
const port = config.requestPort;
const par = config.pair;
const interval = config.intervalTime;
const limit = config.requestLimit;
const api = config.apiKey;
const secret = config.apiSecret;
const uTime = parseInt(new Date().getTime() / 1000);
const Binance = require('binance-api-node').default;
const client = Binance({apiKey: api, apiSecret: secret, getTime: Date.now()});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('<body style="background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);color: white;"> UDF protocol on port -> <b>'+port+'</b> Binance Bot by Rattsus. <br> /config<br> /symbols<br> /time<br> /hystory</body>')
})

app.get('/config', (req, res) => {
    res.json(config.UDFconfig)
})

app.get('/symbols', (req, res) => {
    res.json(config.UDFsymbolConfg)
})

app.get('/time', (req, res) => {
    res.json(uTime);
})

client.ping().then(ping => {
    if(ping == true){
        console.log('conectado a binance')
        app.get('/history', (req, res) => {
            const {symbol} = req.query;
            client.candles({symbol: symbol, interval: interval, limit: limit}).then(candles => {
                var x, o='', c="", v="", h="", l="", t='', chartData, teste = "";
                for(x = 0; x < candles.length; x++){
                                
                    o += (candles[x].open)+', ';
                    c += (candles[x].close)+', ';
                    v += (candles[x].volume)+', ';
                    h += (candles[x].high)+', ';
                    l += (candles[x].low)+', ';
                    t += (candles[x].openTime)+', ';
        
                }
                var candleShort = {
                    o: [o],
                    c: [c],
                    v: [v],
                    h: [h],
                    l: [l],
                    t: [t],
                    s: 'ok'            
                }
                let body = candleShort;
                time = JSON.stringify(body.t[0])
                time = time.substring(1, (time.length - 3))
                time = time.split(',').map(Number)

                open = JSON.stringify(body.o[0])
                open = open.substring(1, (open.length - 3))
                open = open.split(',').map(Number)

                close = JSON.stringify(body.c[0])
                close = close.substring(1, (close.length - 3))
                close = close.split(',').map(Number)

                high = JSON.stringify(body.h[0])
                high = high.substring(1, (high.length - 3))
                high = high.split(',').map(Number)

                low = JSON.stringify(body.l[0])
                low = low.substring(1, (low.length - 3))
                low = low.split(',').map(Number)

                volume = JSON.stringify(body.v[0])
                volume = volume.substring(1, (volume.length - 3))
                volume = volume.split(',').map(Number)

                var candleData = {
                    "o": open,
                    "c": close,
                    "v": volume,
                    "h": high,
                    "l": low,
                    "t": time,
                    "s": "ok"
                    }
                res.json(candleData)
            })
        })

    }
    if(ping == false){
        console.log('desconectado da binance...')
    }
})

app.listen(port, () => {
    console.log('Udf protocol on -> http://localhost:'+port);
})