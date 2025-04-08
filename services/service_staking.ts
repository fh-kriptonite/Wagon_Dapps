import { ethers } from "ethers";
import stakingAbi from "../public/ABI/staking.json";

if (!process.env.ALCHEMY_PROVIDER_HTTPS) {
  throw new Error('ALCHEMY_PROVIDER_HTTPS environment variable is not defined');
}

if (!process.env.WAGON_STAKING_PROXY) {
  throw new Error('WAGON_STAKING_PROXY environment variable is not defined');
}

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER_HTTPS);
const contract = new ethers.Contract(process.env.WAGON_STAKING_PROXY, stakingAbi, provider);

export const getStakingTotalStaked = async (): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalSupply = await contract.totalSupply();
            resolve(totalSupply);
        } catch (error) {
            reject(error);
        }
    });
};

export const getStakingRewardRate = async (): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        try {
            const rewardRate = await contract.rewardRate();
            resolve(rewardRate);
        } catch (error) {
            reject(error);
        }
    });
};

export const getStakingFinishAt = async (): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        try {
            const finishAt = await contract.finishAt();
            resolve(finishAt);
        } catch (error) {
            reject(error);
        }
    });
};

export const getStakingBalance = async (address: string): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        try {
            const balance = await contract.balanceOf(address);
            resolve(balance);
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
};

export const getRewardBalance = async (address: string): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        try {
            const balance = await contract.earned(address);
            resolve(balance);
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
};

export const getClaimableBalance = async (address: string): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        try {
            const balance = await contract.claimables(address);
            resolve(balance);
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
};

export const getAPYService = async (address: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalStaked = Number(await contract.totalSupply());
            const rewardRate = Number(await contract.rewardRate());
            const finishAt = Number(await contract.finishAt());
            
            if(totalStaked === 0) resolve(0);
            if(finishAt === null) resolve(0);
            if(finishAt < Date.now()/1000) resolve(0);

            resolve(rewardRate / totalStaked * 31536000 * 100);
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
};

export const getUserTotalRewardClaimedService = async (address: string): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        try {
            const balance = await contract.userTotalRewardClaimed(address);
            resolve(balance);
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
};

export const getClaimableDurationService = async (): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        try {
            const claimableDuration = await contract.claimableDuration();
            resolve(claimableDuration);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}; 