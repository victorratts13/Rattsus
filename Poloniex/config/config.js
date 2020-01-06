const par = 'USDT_BTC';
let configs = {
    remotePubRequest: 'https://poloniex.com/public',
    remotePrivRequest: 'https://poloniex.com/tradingApi',
    localRequest: 'http://localhost',
    UDFport: 8001,
    apiKey: 'NZCVQ3B9-H2LW2XYF-Z3ZLR1RV-WNM159IJ',
    apiSecret: 'd3c598287039d11ad1e34a1823e57b689f1123d548a029d8c0ef858516c62ba66741d3486b4591e677d2c09b101f935b5d5c2c9dde5419f8aebdee2d32c06138',
    useVol: false,
    volume: 0,
    SMA: 99,
    EMA: 10,
    RSI: 14,
    pair: par,
    intervalRequest: 30000,
    period: '300',
    subStamp: 225550,
    UDFdataConfig: {
        supports_search: true,
        supports_group_request: false,
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        exchanges: {
            value: 'POLONIEX',
            name: 'POLONIEX',
            desc: 'POLONIEX',
        },
        supported_resolutions: [
          '1', '3', '5', '15', '30', '60', '120', '240', 'D'
        ]
    },
    UDFsymbolConfig: {
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
        supported_resolutions: ['5', '15', '30', '120', '240', 'D'],
        volume_precision: 8,
        data_status: "streaming",
    }
}

module.exports = configs;