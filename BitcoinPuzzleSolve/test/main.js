require('bytenode')
const assert = require('assert')

const _ = require("lib-common-utils");

const Constants = require("../app/config/Constants");
const BitcoinService = require("../app/services/BitcoinService.js");

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

describe("Main function", function () {
    it("returns data btc", function () {
        let privateKey = genRanHexInRange(Constants.PRIVATE_KEY_BITS64_MIN, Constants.PRIVATE_KEY_BITS64_MAX, Constants.PRIVATE_KEY_RANGE64_HEX.length);
        let btcData = BitcoinService.getBtcFromPrivateKey(privateKey);

        if (btcData == undefined || btcData == null) {
            assert.fail('Generate btc is fail')
        } else {
            assert.ok('Generate btc successfully')
        }

    });
});