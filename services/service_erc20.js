import ERC20_ABI from '../public/ABI/erc20.json';
import { ethers } from "ethers"

async function getTokenToUsdRate (priceUrl, chainId) {
    return new Promise( async (resolve, reject) => {
        try {
            const response = await fetch(priceUrl);
            const data = await response.json();
            let usdRate
            if(chainId == 11155111 || chainId == 1) {
                usdRate = data.ethereum.usd;
            } else {
                usdRate = data.binancecoin.usd;
            }
            resolve(usdRate);
        } catch (error) {
            console.error('Error fetching USD exchange rate:', error.message);
            reject(error);
        }
    })
}

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

    allowanceErc20Service : async (erc20Address, owner, spender, providerUrl, chainId) => {
        // Connect to the Ethereum network
        const provider = new ethers.providers.JsonRpcProvider(providerUrl, {chainId});

        const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, provider);

        return new Promise( async (resolve, reject) => {
            try {
                const allowance = await erc20Contract.allowance(owner, spender)

                // Get the decimals to adjust the balance
                const decimals = await erc20Contract.decimals();
                            
                // Adjust the balance based on the token decimals
                const adjustedAllowance = ethers.utils.formatUnits(allowance, decimals);

                resolve(parseFloat(adjustedAllowance));
            } catch (error) {
                reject(error)
            }
        })
    },

    getERC20NetworkBalanceService : async (tokenAddress, walletAddress, providerUrl, chainId) => {
        // Connect to the Ethereum network
        const provider = new ethers.providers.JsonRpcProvider(providerUrl, {chainId});
      
        // Instantiate the ERC-20 token contract
        const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
        return new Promise( async (resolve, reject) => {
            // Get the balance of the wallet address
            try {
                const balance = await erc20Contract.balanceOf(walletAddress);
                
                // Get the decimals to adjust the balance
                const decimals = await erc20Contract.decimals();
            
                // Adjust the balance based on the token decimals
                const adjustedBalance = ethers.utils.formatUnits(balance, decimals);
                
                resolve(parseFloat(adjustedBalance));
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },
      
    tokenToUsd : async (amount, priceUrl, chainId) => {
        return new Promise( async (resolve, reject) => {
            try {
                const tokenToUsdRate = await getTokenToUsdRate(priceUrl, chainId);
                const amountInUsd = amount * tokenToUsdRate;
                resolve(amountInUsd);
            } catch (error) {
                console.error('Error converting USD:', error.message);
                reject(error);
            }
        })
    }

}