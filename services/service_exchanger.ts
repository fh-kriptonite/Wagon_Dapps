import EXCHANGER_ABI from '../public/ABI/exchanger.json';
import ERC20_ABI from '../public/ABI/erc20.json';
import Web3 from 'web3';

if (!process.env.WAGON_EXCHANGER) {
  throw new Error('WAGON_EXCHANGER environment variable is not defined');
}

if (!process.env.WAG_ADDRESS) {
  throw new Error('WAG_ADDRESS environment variable is not defined');
}

if (!process.env.USDT_ADDRESS) {
  throw new Error('USDT_ADDRESS environment variable is not defined');
}

export const getPriceService = async (web3: Web3): Promise<number> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    const wagonContract = new web3.eth.Contract(
        ERC20_ABI as any,
        process.env.WAG_ADDRESS
    );

    const usdContract = new web3.eth.Contract(
        ERC20_ABI as any,
        process.env.USDT_ADDRESS
    );

    return new Promise(async (resolve, reject) => {
        try {
            const price = await exchangerContract.methods
                .usdPerWagon()
                .call();

            const decimals = await usdContract.methods
                .decimals()
                .call();

            resolve(Number(price) / Math.pow(10, Number(decimals)));
        } catch (error) {
            reject(error);
        }
    });
};

export const getPresaleService = async (web3: Web3): Promise<number> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    const wagonContract = new web3.eth.Contract(
        ERC20_ABI as any,
        process.env.WAG_ADDRESS
    );

    return new Promise(async (resolve, reject) => {
        try {
            const presaleWagon = await exchangerContract.methods
                .presaleWagon()
                .call();
    
            const decimals = await wagonContract.methods
                .decimals()
                .call();

            resolve(Number(presaleWagon) / Math.pow(10, Number(decimals)));
        } catch (error) {
            reject(error);
        }
    });
};

export const getSoldService = async (web3: Web3): Promise<number> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    const wagonContract = new web3.eth.Contract(
        ERC20_ABI as any,
        process.env.WAG_ADDRESS
    );

    return new Promise(async (resolve, reject) => {
        try {
            const soldWagon = await exchangerContract.methods
                .soldWagon()
                .call();
                    
            const decimals = await wagonContract.methods
                .decimals()
                .call();

            resolve(Number(soldWagon) / Math.pow(10, Number(decimals)));
        } catch (error) {
            reject(error);
        }
    });
};

export const getStartTimeService = async (web3: Web3): Promise<string> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    return new Promise(async (resolve, reject) => {
        try {
            const startTime = await exchangerContract.methods
                .startTime()
                .call();
    
            resolve(startTime);
        } catch (error) {
            reject(error);
        }
    });
};

export const getClaimStartTimeService = async (web3: Web3): Promise<string> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    return new Promise(async (resolve, reject) => {
        try {
            const startTime = await exchangerContract.methods
                .claimStartTime()
                .call();
    
            resolve(startTime);
        } catch (error) {
            reject(error);
        }
    });
};

export const getAvailableService = async (web3: Web3): Promise<number> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    const wagonContract = new web3.eth.Contract(
        ERC20_ABI as any,
        process.env.WAG_ADDRESS
    );

    return new Promise(async (resolve, reject) => {
        try {
            const availableWagon = await exchangerContract.methods
                .availableWagon()
                .call();
    
            const decimals = await wagonContract.methods
                .decimals()
                .call();

            resolve(Number(availableWagon) / Math.pow(10, Number(decimals)));
        } catch (error) {
            reject(error);
        }
    });
};

export const getClaimableBalanceService = async (web3: Web3, account: string): Promise<number> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    const wagonContract = new web3.eth.Contract(
        ERC20_ABI as any,
        process.env.WAG_ADDRESS
    );

    return new Promise(async (resolve, reject) => {
        try {
            const balance = await exchangerContract.methods
                .wagonBalance(account)
                .call();

            const decimals = await wagonContract.methods
                .decimals()
                .call();

            resolve(Number(balance) / Math.pow(10, Number(decimals)));
        } catch (error) {
            reject(error);
        }
    });
};

export const exchangeService = async (web3: Web3, usd: string, account: string): Promise<void> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    return new Promise(async (resolve, reject) => {
        try {
            await exchangerContract.methods
                .swapUsdForWag(usd)
                .send({from: account});

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const claimService = async (web3: Web3, account: string): Promise<void> => {
    const exchangerContract = new web3.eth.Contract(
        EXCHANGER_ABI as any,
        process.env.WAGON_EXCHANGER
    );

    return new Promise(async (resolve, reject) => {
        try {
            await exchangerContract.methods
                .claimWagon()
                .send({from: account});

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}; 