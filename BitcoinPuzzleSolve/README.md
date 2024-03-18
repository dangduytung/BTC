# Genereate Random Bitcoin Address
This project aims to solve the bitcoin puzzle at [https://privatekeys.pw/puzzles/bitcoin-puzzle-tx](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx).
It generates a random BTC address and then compares it with addresses that have a balance greater than 0. It can also be brute-forced locally.

## Reference
* [https://www.programmersought.com/article/52223672976](https://www.programmersought.com/article/52223672976)<br/>
* [https://anees.in/compile-nodejs-code-using-bytenode](https://anees.in/compile-nodejs-code-using-bytenode)<br/>

## Prerequisites
```bash
yarn      # or yarn install
```

## Run Locally
```bash
yarn start
```

## Compile
```bash
npm run-script compile                    # Compile code without obfuscation<br/>
npm run-script compile-ob                 # Compile code with obfuscation use `bytenode`
```

### Run by Node
```bash
node dist/launcher.js                     # Source in `dist` directory
```

### Run by PM2
```bash
pm2 init simple                           # Generate `ecosystem.config.js` file (e.g., reference in `script` folder)
pm2 start ecosystem.config.js --env=production
```