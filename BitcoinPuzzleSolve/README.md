## Project
This project try to solve the bitcoint puzzle in [https://privatekeys.pw/puzzles/bitcoin-puzzle-tx](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx).
This project generate random BTC address then compare with address has balance >0 .It can call too is brute force in local :D<br/>

## Reference
[https://www.programmersought.com/article/52223672976](https://www.programmersought.com/article/52223672976)<br/>
[https://anees.in/compile-nodejs-code-using-bytenode](https://anees.in/compile-nodejs-code-using-bytenode)<br/>

## Compile
`npm run-script compile`                    #Compile code without obfuscation<br/>
`npm run-script compile-ob`                 #Compile code with obfuscation use `bytenode`<br/>

## Run by Node
`node dist/launcher.js`                     #Source in `dist` directory

## Run by PM2 
`pm2 start ecosystem.config.js --env=production`  #Source in folder `.pm2`