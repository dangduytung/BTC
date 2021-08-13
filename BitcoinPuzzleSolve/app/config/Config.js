var Config = {};

/* LIVE */
var live = {};
live.IS_SAVE_DATA_BTC = false;
live.FILE_DATA_LIMIT= 10000;
live.TIME_INTERVAL_GENERATE_MILISECONDS = 100;

/* DEV */
var dev = {};
dev.IS_SAVE_DATA_BTC = true;
dev.FILE_DATA_LIMIT= 10;
dev.TIME_INTERVAL_GENERATE_MILISECONDS = 100;

Config = process.env.NODE_ENV == 'production' ? live : dev;

module.exports = Config;