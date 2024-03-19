require('dotenv').config();
process.env.NODE_PATH = module.path;

const log = require("winston-log-lite")(module);
const _ = require("lib-common-utils");

const Config = require("./config/Config");
const Constants = require("./config/Constants");
const BitcoinService = require("./services/BitcoinService");

const FOLDER_DATA_BITCOIN = './data/bitcoin/';
const FOLDER_DATA_DRAFT = './data/draft/';

var count = 0;
var surplusRandom = -1;     // Random number print log have count generate random address BTC
var arrData = [];

function initialize() {

    log.info(`initialize(), NODE_PATH: ${process.env.NODE_PATH}`);
    log.info(`initialize(), NODE_ENV: ${process.env.NODE_ENV}`);
    log.info(`initialize(), PRIVATE_KEY_BITS64_MIN: ${Constants.PRIVATE_KEY_BITS64_MIN}`);
    log.info(`initialize(), PRIVATE_KEY_BITS64_MAX: ${Constants.PRIVATE_KEY_BITS64_MAX}`);
    log.info(`initialize(), TARGET_ADDRESS_COMPRESSED_BITS64: ${Constants.TARGET_ADDRESS_COMPRESSED_BITS64}`);

    // Check folder save result data
    _.FileUtils.validateDir(FOLDER_DATA_BITCOIN);

    // Print important info
    let privateKeyMin = Constants.PRIVATE_KEY_BITS64_MIN.padStart(Constants.PRIVATE_KEY_RANGE64_HEX.length, '0');
    let privateKeyMax = Constants.PRIVATE_KEY_BITS64_MAX.padStart(Constants.PRIVATE_KEY_RANGE64_HEX.length, '0');
    log.info(`initialize(), generate random:\nFrom ${privateKeyMin}\nTo   ${privateKeyMax}`);

    // Time interval in do/while
    log.info(`initialize(), TIME_INTERVAL_GENERATE_MILISECONDS: ${Config.TIME_INTERVAL_GENERATE_MILISECONDS}(ms)`);

    // Save generated address BTC (on DEV environment)
    log.info(`initialize(), IS_SAVE_DATA_BTC: ${Config.IS_SAVE_DATA_BTC}`);
    if (Config.IS_SAVE_DATA_BTC) {
        log.info(`initialize(), FILE_DATA_LIMIT: ${Config.FILE_DATA_LIMIT}`);
        _.FileUtils.validateDir(FOLDER_DATA_DRAFT);
        arrData = [];
    }

    count = 0;
    surplusRandom = _.NumberUtils.getRndInteger(1, Config.COUNT_STEP);
}

function dateToString(date) {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0');
    let yyyy = date.getFullYear();

    let hh = String(date.getHours()).padStart(2, '0');
    let mi = String(date.getMinutes()).padStart(2, '0');
    let ss = String(date.getSeconds()).padStart(2, '0');

    return yyyy + mm + dd + '-' + hh + mi + ss;
}

function genRanHexInRange(min, max, size) {
    let length = Math.max(min.length, max.length);
    let hex = '';

    if (min.length < length) {
        min = min.padStart(length, '0');
    }

    if (max.length < length) {
        max = max.padStart(length, '0');
    }

    for (let i = 0; i < length; i++) {
        let tmp = _.NumberUtils.getRndInteger(parseInt(min.charAt(i), 16), parseInt(max.charAt(i), 16));
        hex += tmp.toString(16);
    }
    hex = hex.padStart(size, '0');
    return hex;
}

async function exitHandler(options, exitCode) {
    log.info(`exitHandler count: ${count}, options: ${JSON.stringify(options)}, exitCode: ${exitCode}`);

    if (options.cleanup) {
        log.info(`exitHandler cleanup`);
        console.log(`exitHandler cleanup`);
    }

    // if (exitCode || exitCode === 0) { 
    //     log.info(exitCode);
    // }

    if (options.exit) {
        log.info(`exitHandler exit`);
        console.log(`exitHandler exit`);
        process.exit();
    }
}

process.stdin.resume();//so the program will not close instantly

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
//process.on('SIGINT', exitHandler.bind(null, {exit:true}));   //bug loop in linux

async function start() {

    initialize();

    /** Wait some time to write log */
    await _.TimeUtils.sleep(1000);

    /** Loop generate random BTC */
    do {
        count++;
        let privateKey = genRanHexInRange(Constants.PRIVATE_KEY_BITS64_MIN, Constants.PRIVATE_KEY_BITS64_MAX, Constants.PRIVATE_KEY_RANGE64_HEX.length);
        let btcData = BitcoinService.getBtcFromPrivateKey(privateKey);

        /** log.info(`Completed at ${count} ${btcData.privateKey}, ${btcData.addressC}`); */

        /** Save brute-force success */
        if (Constants.TARGET_ADDRESS_COMPRESSED_BITS64.toLowerCase() == btcData.addressC.toLowerCase()) {
            log.info(`<===> Completed at ${count}, data: ${JSON.stringify(btcData)}`);

            /** Save important bitcoin successfully */
            _.FileUtils.writeFileSync(FOLDER_DATA_BITCOIN + "success.txt", JSON.stringify(btcData));

            break;
        }

        /** Write data to file */
        if (Config.IS_SAVE_DATA_BTC) {

            arrData.push(btcData);

            if (count % Config.FILE_DATA_LIMIT == 0) {
                log.info(`start(), write file ${Config.FILE_DATA_LIMIT} objects start, count: ${count}`);

                _.FileUtils.writeFileSync(`${FOLDER_DATA_DRAFT}btc-data_${Config.FILE_DATA_LIMIT}-${dateToString(new Date())}_${btcData.addressU.substring(0, 10)}.txt`, JSON.stringify(arrData));

                // Clear after save file
                arrData = [];

                log.info(`start(), write file ${Config.FILE_DATA_LIMIT} objects end`);

                /** Wait some time to write log */
                await _.TimeUtils.sleep(1000);
            }
        }

        /** Write number current count random */
        if (count % Config.COUNT_STEP == surplusRandom) {
            log.info(`start(), count=${count}, surplusRandom=${surplusRandom}`);
        }
        if (count % Config.COUNT_STEP == 0) {
            surplusRandom = _.NumberUtils.getRndInteger(1, Config.COUNT_STEP);
        }

        /** Wait some time for offload cpu */
        await _.TimeUtils.sleep(Config.TIME_INTERVAL_GENERATE_MILISECONDS);
    }
    while (true);
}

start();