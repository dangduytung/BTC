const Btc = require("bitcoinjs-lib");
const Bip39 = require("bip39");
const Crypto = require("crypto");

const MAIN_NET = true;

const BTC_NETWORK = MAIN_NET ? Btc.networks.bitcoin : Btc.networks.testnet;

/**
 * 
 * @param {*} privateKey this is private key of wallet
 * @returns information of bitcoin like address...
 */
function getBtcFromPrivateKey(privateKey) {
    let mnemonic = Bip39.entropyToMnemonic(privateKey);
    let buffer = Buffer.from(privateKey, "hex");

    /* Compressed */
    let keyPairC = Btc.ECPair.fromPrivateKey(buffer, {network: BTC_NETWORK});
    let wifC = keyPairC.toWIF();
    let publicKeyC = keyPairC.publicKey.toString("hex");
    let addressC = Btc.payments.p2pkh({
        pubkey: keyPairC.publicKey,
        network: BTC_NETWORK
    }).address;

    /* Uncompressed */
    let keyPairU = Btc.ECPair.fromPrivateKey(buffer, {
        compressed: false,
        network: BTC_NETWORK,
    });
    let wifU = keyPairU.toWIF();
    let publicKeyU = keyPairU.publicKey.toString("hex");
    let addressU = Btc.payments.p2pkh({
        pubkey: keyPairU.publicKey,
        network: BTC_NETWORK
    }).address;

    return {
        mnemonic,
        privateKey,
        wifC,
        publicKeyC,
        addressC,
        wifU,
        publicKeyU,
        addressU,
    };
}

/**
 * 
 * @param {*} compressed 
 * @returns Generate btc random
 */
function generateBtcRandom(compressed) {
    compressed = compressed == undefined ? true : compressed;
    let keyPair = Btc.ECPair.makeRandom({compressed: compressed, network: BTC_NETWORK});
    let wif = keyPair.toWIF();
    let privateKey = keyPair.privateKey.toString('hex');
    let mnemonic = Bip39.entropyToMnemonic(privateKey);
    let publicKey = keyPair.publicKey.toString("hex");
    let address = Btc.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: BTC_NETWORK
    }).address;

    return {
        mnemonic,
        privateKey,
        wif,
        publicKey,
        address
    };
}

/**
 * 
 * @param {*} passphrase 
 * @returns 
 */
function generateBtcFromSHA256Hash() {
    let hash = Btc.crypto.sha256(Buffer.from(passphrase));
    return getBtcFromPrivateKey(hash.toString('hex'));
}

/**
 * 
 * @returns 
 */
function generateBtcRandomBytes() {
    let hash = Crypto.randomBytes(32);
    return getBtcFromPrivateKey(hash.toString('hex'));
}

/**
 * 
 * @param {*} node 
 * @param {*} network 
 * @returns wallet address
 */
function getAddress(node, network) {
    return Btc.payments.p2pkh({
        pubkey: node.publicKey,
        network: network,
    }).address;
}

/**
 *
 * @param {*} pubKey 03745AAAF364030720B2D14DE50A3310EEF521C91E36353DCA20813713535C005A
 * @returns wallet address 1GNXpcYzasmmXvM4rNgkvZ5SzXgL4L9Ch6
 */
function getAddressFromPubKey(pubKey) {
    const {
        address
    } = Btc.payments.p2pkh({
        pubkey: Buffer.from(pubKey, "hex"),
    });
    return address;
}


module.exports.getBtcFromPrivateKey = getBtcFromPrivateKey;
module.exports.generateBtcRandom = generateBtcRandom;
module.exports.generateBtcFromSHA256Hash = generateBtcFromSHA256Hash;
module.exports.generateBtcRandomBytes = generateBtcRandomBytes;
module.exports.getAddress = getAddress;
module.exports.getAddressFromPubKey = getAddressFromPubKey;