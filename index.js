const fs = require('fs');
const os = require("os");
const csv = require('csv-parser');
const { ethers } = require('ethers');
const abi = require('./abi.json')

// The private key below has nothing on it. Just used to interact with the read functions of the smart contract.

const private_key = 'f3fc0a0a21a56e5f86375456a0a6046e81f37afb8b6103df6bd7acc9dd2dec2b';
const farm_addr = '0x1c500aAbba02002C3718899DE0D5Db949aE7763F';
const provider = new ethers.providers.JsonRpcProvider('https://rpc.energyweb.org/');
const wallet = new ethers.Wallet(private_key, provider);
const farm = new ethers.Contract(farm_addr, abi, wallet);

const POOL_TO_CHECK = process.argv.slice(2)[0]
const POOLS_TO_CHECK = [
    "ewt",
    "susu",
    "wbct",
    "wnct",
    "wusdc"
]

const checkAndCreate = async (addy, token) => {
    let pool
    switch (token) {
        case "ewt":
            pool = 0;
            break;
        case "susu":
            pool = 1;
            break;
        case "wbct":
            pool = 2;
            break;
        case "wnct":
            pool = 3;
            break;
        case "wusdc":
            pool = 4;
            break;
    }

    if (!isNaN(pool)) {
        const userInfo = await farm.userInfo(pool, addy)
        const rewards = await farm.pending(pool, addy)

        if (userInfo.amount.toString() !== "0") {

            const data = addy + "," + (parseFloat(userInfo.amount.toString()) / 10 ** 18).toFixed(2) + "," + (parseFloat(ethers.BigNumber.from(rewards._hex).toString()) / 10 ** 18).toFixed(2)

            fs.appendFile(`./output/${POOL_TO_CHECK}.csv`, data + os.EOL, function (err) {
                if (err) throw err;
            });

        }
    }

}

const createfile = () => {
    fs.writeFile(`./output/${POOL_TO_CHECK}.csv`, "WALLET ADDRESS,CLP DEPOSITED,UNCLAIMED EWD" + os.EOL, { flag: 'wx' }, function (err) {
        if (err) throw err;
    });
}

const mainFunction = () => {

    if (fs.existsSync(`./output/${POOL_TO_CHECK}.csv`)) {
        fs.unlinkSync(`./output/${POOL_TO_CHECK}.csv`)
        createfile()
    } else {
        createfile()
    }

    fs.createReadStream('input/addys.csv')
        .pipe(csv())
        .on('data', (row) => {
            checkAndCreate(row.addy, POOL_TO_CHECK)
        })
        .on('end', () => {
            console.log(POOL_TO_CHECK + " CSV created!");
        });

}

POOLS_TO_CHECK.join().includes(POOL_TO_CHECK) ? mainFunction() : console.log("Token not recognized!")


