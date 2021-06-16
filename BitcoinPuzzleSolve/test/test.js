const Btc = require('bitcoinjs-lib');
const crypto = require("crypto");
const Bip39 = require("bip39");

const _ = require("lib-common-utils");
const BitcoinService = require('../app/services/BitcoinService');

const Constants = require("../app/config/Constants");

let testnet = Btc.networks.testnet;

const log = require("winston-log-lite")(module);

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


let entropy = genRanHexInRange(Constants.PRIVATE_KEY_BITS64_MIN, Constants.PRIVATE_KEY_BITS64_MAX, Constants.PRIVATE_KEY_RANGE64_HEX.length);
// let entropy = '0000000000000000000000000000000000000000000000000000000000000001';

console.log(entropy);