const { ethers } = require("ethers");
const stakingAbi = require("../public/ABI/staking.json");

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER_HTTPS);
const contractAddress = process.env.WAGON_STAKING_PROXY;
const contract = new ethers.Contract(contractAddress, stakingAbi, provider);

module.exports = {

    getStakingTotalStaked : async () => {
        return new Promise( async (resolve, reject) => {
            try {
                let totalSupply = await contract.totalSupply();
                resolve(totalSupply);
            } catch (error) {
                reject(error)
            }
        })
    },

    getStakingRewardRate : async () => {
        return new Promise( async (resolve, reject) => {
            try {
                let rewardRate = await contract.rewardRate();
                resolve(rewardRate);
            } catch (error) {
                reject(error)
            }
        })
    },

    getStakingFinishAt : async () => {
        return new Promise( async (resolve, reject) => {
            try {
                let finishAt = await contract.finishAt();
                resolve(finishAt);
            } catch (error) {
                reject(error)
            }
        })
    },

    getStakingBalance: async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let balance = await contract.balanceOf(address);
                resolve(balance);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getRewardBalance: async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let balance = await contract.earned(address);
                resolve(balance);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getClaimableBalance: async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let balance = await contract.claimables(address);
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
                resolve(balance);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getClaimableDurationService : async () => {
        return new Promise( async (resolve, reject) => {
            try {
                let claimableDuration = await contract.claimableDuration();
                resolve(claimableDuration);
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    },
}