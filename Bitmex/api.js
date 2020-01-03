
const config = require('./configs/configs');
const request = require('request');
const express = require('express');
const app = express();
let port = config.port;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let url = config.remoteRequest + config.remoteUDF;
let cnf = '/config';
let info = '/symbol_info';
let symb = '/symbols?symbol='+config.symbol;
let hstr = '/history';
let tms = new Date().getTime() / 1000;
let unx = parseInt(tms);

request({
    url: url + cnf,
    json: true
}, (err, res, body) => {
    app.get('/config', (req, res) => {
        res.json(body)
    })
})

request({
    url: url + info,
    json: true
}, (err, res, body) => {
    app.get('/symbol_info', (req, res) => {
        res.json(body)
    })
})

request({
    url: url + symb,
    json: true
}, (err, res, body) => {
    app.get('/symbols', (req, res) => {
        res.json(body)
    })
})

request({
    url: url + tms,
    json: true
}, (err, res, body) => {
    app.get('/time', (req, res) => {
        res.json(unx)
    })
})

app.get('/history', (req, res) => {
    const {symbol, from, to, resolution} = req.query;
    let query = `?symbol=${symbol}&from=${from}&to=${to}&resolution=${resolution}`;
    request({
        url: url+hstr+query,
        json: true
    }, (err, resp, body) => {
        res.json(body);
    })
})

app.get('/', (req, res) => {
    res.send('put your Chart on http://localhost:'+port);
});

app.listen(port, () => {
    console.log('UDF Server on port -> '+port);
});
