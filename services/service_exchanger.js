import EXCHANGER_ABI from '../public/ABI/exchanger.json';
import ERC20_ABI from '../public/ABI/erc20.json';

module.exports = {

    getPriceService : async (web3) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        const wagonContract = new web3.eth.Contract(
            ERC20_ABI,
            process.env.WAG_ADDRESS
        );

        const usdContract = new web3.eth.Contract(
            ERC20_ABI,
            process.env.USDT_ADDRESS
        );

        return new Promise( async (resolve, reject) => {
            try {
                const price = await exchangerContract.methods
                    .usdPerWagon()
                    .call();

                const decimals = await usdContract.methods
                    .decimals()
                    .call();

                resolve(price / Math.pow(10, decimals));
            } catch (error) {
                reject(error)
            }
        })
    },

    getPresaleService : async (web3) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        const wagonContract = new web3.eth.Contract(
            ERC20_ABI,
            process.env.WAG_ADDRESS
        );

        return new Promise( async (resolve, reject) => {
            try {
                const presaleWagon = await exchangerContract.methods
                    .presaleWagon()
                    .call();
    
                const decimals = await wagonContract.methods
                    .decimals()
                    .call();

                resolve(presaleWagon / Math.pow(10, decimals));
            } catch (error) {
                reject(error)
            }
        })
    },

    getSoldService : async (web3) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        const wagonContract = new web3.eth.Contract(
            ERC20_ABI,
            process.env.WAG_ADDRESS
        );

        return new Promise( async (resolve, reject) => {
            try {
                const soldWagon = await exchangerContract.methods
                    .soldWagon()
                    .call();
                    
                const decimals = await wagonContract.methods
                    .decimals()
                    .call();

                resolve(soldWagon / Math.pow(10, decimals));
            } catch (error) {
                reject(error)
            }
        })
    },

    getStartTimeService : async (web3) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        return new Promise( async (resolve, reject) => {
            try {
                const startTime = await exchangerContract.methods
                    .startTime()
                    .call();
    
                resolve(startTime);
            } catch (error) {
                reject(error)
            }
        })
    },

    getClaimStartTimeService : async (web3) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        return new Promise( async (resolve, reject) => {
            try {
                const startTime = await exchangerContract.methods
                    .claimStartTime()
                    .call();
    
                resolve(startTime);
            } catch (error) {
                reject(error)
            }
        })
    },

    getAvailableService : async (web3) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        const wagonContract = new web3.eth.Contract(
            ERC20_ABI,
            process.env.WAG_ADDRESS
        );

        return new Promise( async (resolve, reject) => {
            try {
                const availableWagon = await exchangerContract.methods
                    .availableWagon()
                    .call();
    
                const decimals = await wagonContract.methods
                    .decimals()
                    .call();

                resolve(availableWagon / Math.pow(10, decimals));
            } catch (error) {
                reject(error)
            }
        })
    },

    getClaimableBalanceService : async (web3, account) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        const wagonContract = new web3.eth.Contract(
            ERC20_ABI,
            process.env.WAG_ADDRESS
        );

        return new Promise( async (resolve, reject) => {
            try {
                const balance = await exchangerContract.methods
                    .wagonBalance(account)
                    .call();

                const decimals = await wagonContract.methods
                    .decimals()
                    .call();

                resolve(balance / Math.pow(10, decimals));
            } catch (error) {
                reject(error)
            }
        })
    },

    exchangeService : async (web3, usd, account) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        return new Promise( async (resolve, reject) => {
            try {
                await exchangerContract.methods
                    .swapUsdForWag(usd)
                    .send({from:account});

                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },

    claimService : async (web3, account) => {
        const exchangerContract = new web3.eth.Contract(
            EXCHANGER_ABI,
            process.env.WAGON_EXCHANGER
        );

        return new Promise( async (resolve, reject) => {
            try {
                await exchangerContract.methods
                    .claimWagon()
                    .send({from:account});

                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },

}