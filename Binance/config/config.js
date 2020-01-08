let par = 'BTCUSDT';
let configs = {
    apiKey: '2hdu6qNHsuUjvppdK40KhTmS9zdxoTiP2xzWbVy2Ufz5YNr8r2e6GcPBac77M9yn',
    apiSecret: 'W62BnuE1T5xJkExEGewyoCiJODup6xfMf3BAKarSk6Pyfrq8lkR6sqOhcUOpZJse',
    volume: 0,
    SMA: 99,
    EMA: 10,
    RSI: 14,
    pair: par,
    requestPort: 3001,
    intervalTime: '1m',
    resolution: 1,
    requestLimit: 10000,
    intervalRequest: 10000,
    UDFconfig: {
        supports_search: true,
        supports_group_request: false,
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        exchanges: {
            value: 'BINANCE',
            name: 'BINANCE',
            desc: 'BINANCE',
        },
        supported_resolutions: [
           '1','3', '5', '15', '30', '60', '120', '240','360','720', 'D', 'W', 'M'
        ]
    },
    UDFsymbolConfg: {
        name: par,
        description: par,
        type: "crypto",
        session: "24x7",
        timezone: "America/New_York",
        ticker: par,
        minmov: 1,
        pricescale: 100000000,
        has_intraday: true,
        intraday_multipliers: ["1", "60"],
        supported_resolutions: ['1','3', '5', '15', '30', '60', '120', '240','360','720', 'D', 'W', 'M'],
        volume_precision: 8,
        data_status: "streaming",
    }

}

module.exports = configs;