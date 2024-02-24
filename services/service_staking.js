const { ethers } = require("ethers");
const stakingAbi = require("../public/ABI/staking.json");

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER_HTTPS);
const contractAddress = process.env.WAGON_STAKING_PROXY;
const contract = new ethers.Contract(contractAddress, stakingAbi, provider);

module.exports = {

    getStakingBalance: async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let balance = await contract.balanceOf(address);
                const decimals = await contract.decimals();

                balance = parseFloat(balance / Math.pow(10, decimals))
                resolve(balance);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getRewardalance: async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let balance = await contract.earned(address);
                const decimals = await contract.decimals();

                balance = parseFloat(balance / Math.pow(10, decimals))
                resolve(balance);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getAPYService: async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let totalStaked = parseFloat(await contract.totalSupply());
                let rewardRate = parseFloat(await contract.rewardRate());
                let finishAt = parseFloat(await contract.finishAt());
                
                if(totalStaked == 0) resolve(0);
                if(finishAt == null) resolve(0);
                if(finishAt < Date.now()/1000) resolve(0);

                resolve(rewardRate / totalStaked * 31536000 * 100);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getUserTotalRewardClaimedService: async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let balance = await contract.userTotalRewardClaimed(address);
                const decimals = await contract.decimals();

                balance = parseFloat(balance / Math.pow(10, decimals))
                resolve(balance);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    }
}