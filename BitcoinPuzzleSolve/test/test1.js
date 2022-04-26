require('dotenv').config();

const log = require("winston-log-lite")(module);
const _ = require("lib-common-utils");
const config = require('../app/config/Config');


var STEP_COUNT = 100000000000000000000;
var STEP_COUNT1 = 1000000000000000000000;

var count = 0;
var surplusRandom = -1;

async function start() {
    do {
        count++;

        if (count % STEP_COUNT == surplusRandom) {
            log.info(`Print count: ${count}, surplusRandom: ${surplusRandom}`);
        }

        if (count % STEP_COUNT == 0) {
            surplusRandom = _.NumberUtils.getRndInteger(1, STEP_COUNT);
        }

        // await _.TimeUtils.sleep(10);
    } while (true);
}

// start();
console.log(_.NumberUtils.getRndInteger(STEP_COUNT, STEP_COUNT1));