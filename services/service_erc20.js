import ERC20_ABI from '../public/ABI/erc20.json';

module.exports = {

    getErc20BalanceService : async (web3, account, erc20Address) => {
        const erc20Contract = new web3.eth.Contract(
            ERC20_ABI,
            erc20Address
        );

        return new Promise( async (resolve, reject) => {
            try {
                const balance = await erc20Contract.methods
                    .balanceOf(account)
                    .call();

                const decimals = await erc20Contract.methods
                    .decimals()
                    .call();

                resolve(balance / Math.pow(10, decimals));
            } catch (error) {
                reject(error)
            }
        })
    },

    getErc20DecimalsService : async (web3, erc20Address) => {
        const erc20Contract = new web3.eth.Contract(
            ERC20_ABI,
            erc20Address
        );

        return new Promise( async (resolve, reject) => {
            try {
                const decimals = await erc20Contract.methods
                    .decimals()
                    .call();

                resolve(decimals);
            } catch (error) {
                reject(error)
            }
        })
    },

    approveErc20Service : async (web3, erc20Amount, erc20Address, account) => {
        const erc20Contract = new web3.eth.Contract(
            ERC20_ABI,
            erc20Address
        );

        return new Promise( async (resolve, reject) => {
            try {
                await erc20Contract.methods
                    .approve(process.env.WAGON_EXCHANGER, erc20Amount)
                    .send({from:account});

                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },

}