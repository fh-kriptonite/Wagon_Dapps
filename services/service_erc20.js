import ERC20_ABI from '../public/ABI/erc20.json';
import { ethers } from "ethers"

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER_HTTPS);
const providerBnb = new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BNB);
const contractAddress = process.env.WAG_ADDRESS;
const wagContract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

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

    getErc20BalanceService : async (chainId, account, erc20Address) => {

        let providerUrl = process.env.ALCHEMY_PROVIDER_HTTPS;
        if(chainId == process.env.BNB_CHAIN_ID) {
            providerUrl = process.env.PROVIDER_HTTPS_BNB;
        }
    
        const provider = new ethers.JsonRpcProvider(providerUrl);
        const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, provider);
        
        return new Promise( async (resolve, reject) => {
            try {
                const balance = await erc20Contract.balanceOf(account);
                resolve(balance);
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

    allowanceErc20Service : async (erc20Address, owner, spender, providerUrl) => {
        // Connect to the Ethereum network
        const provider = new ethers.JsonRpcProvider(providerUrl);

        const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, provider);

        return new Promise( async (resolve, reject) => {
            try {
                const allowance = await erc20Contract.allowance(owner, spender)

                // Get the decimals to adjust the balance
                const decimals = await erc20Contract.decimals();
                            
                // Adjust the balance based on the token decimals
                const adjustedAllowance = ethers.formatUnits(allowance, decimals);

                resolve(parseFloat(adjustedAllowance));
            } catch (error) {
                reject(error)
            }
        })
    },

    getERC20NetworkBalanceService : async (tokenAddress, walletAddress, providerUrl) => {
        // Connect to the Ethereum network
        const provider = new ethers.JsonRpcProvider(providerUrl);
      
        // Instantiate the ERC-20 token contract
        const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
        return new Promise( async (resolve, reject) => {
            // Get the balance of the wallet address
            try {
                const balance = await erc20Contract.balanceOf(walletAddress);
                
                // Get the decimals to adjust the balance
                const decimals = await erc20Contract.decimals();
            
                // Adjust the balance based on the token decimals
                const adjustedBalance = ethers.formatUnits(balance, decimals);
                
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
    },

    getCoinPriceService : async (name) => {
        return new Promise( async (resolve, reject) => {
            try {
                const response = await fetch('../../api/cache/getCoinPrice/?name=' + name);
                if (!response.ok) {
                    reject('Failed to fetch data');
                }
                const jsonData = await response.json();
                resolve(jsonData);
            } catch (error) {
                console.error('Error fetching JSON:', error);
                reject(error);
            }
        })
    },

    getWagTotalSupply : async () => {
        return new Promise( async (resolve, reject) => {
            try {
                let totalSupply = await wagContract.totalSupply();
                resolve(totalSupply);
            } catch (error) {
                reject(error)
            }
        })
    },

    getWagBalanceOf : async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let balanceOf = await wagContract.balanceOf(address);
                resolve(balanceOf);
            } catch (error) {
                reject(error)
            }
        })
    },

    getWagAllowance : async (address, spender) => {
        return new Promise( async (resolve, reject) => {
            try {
                let allowance = await wagContract.allowance(address, spender);
                resolve(allowance);
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    },

    getErc20Allowance : async (address, spender, erc20Address) => {
        return new Promise( async (resolve, reject) => {
            try {
                const contract = new ethers.Contract(erc20Address, ERC20_ABI, providerBnb);
                let allowance = await contract.allowance(address, spender);
                resolve(allowance);
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
}