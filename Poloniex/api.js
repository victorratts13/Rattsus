const config = require('./config/config');
const express = require('express');
const request = require('request');
const app = express();
const port = config.UDFport;
const par = config.pair;
const uTime = parseInt(new Date().getTime() / 1000);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('UDF protocol on port -> 8001 /config /symbols /time /history')
})

app.get('/config', (req, res) => {
    res.json(config.UDFdataConfig);
})

app.get('/symbols', (req, res) => {
    res.json(config.UDFsymbolConfig);
})

app.get('/time', (req, res) => {
    res.json(uTime);
})

app.get('/history', (req, res) => {
    const {symbol, from, to, resolution} = req.query;
        let link = config.remotePubRequest+`?command=returnChartData&currencyPair=${symbol}&start=${from}&end=${to}&period=${config.period}`;
        //console.log(link);
        request({
            url: link,
            json: true
        }, (err, response, body) => {
            //var body = body.substring(1, (body.length - 1));
            if(err){
                console.log(err);
            }else{
                
                var x, o='', c="", v="", h="", l="", t='', chartData, teste = "";
                //t = parseInt(t);
                for(x = 0; x < body.length; x++){
                    
                    o += (body[x].open)+', ';
                    c += (body[x].close)+', ';
                    v += (body[x].volume)+', ';
                    h += (body[x].high)+', ';
                    l += (body[x].low)+', ';
                    t += (body[x].date)+', ';

                }

                var dashData = {
                        o: [o],
                        c: [c],
                        v: [v],
                        h: [h],
                        l: [l],
                        t: [t],
                        s: 'ok'
                    }
                body = dashData;    
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
                }
        res.send(candleData);
    });  
});

app.listen(port, () => {
    console.log('UDF protocol on port -> '+port);
})