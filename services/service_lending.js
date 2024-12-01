const { ethers } = require("ethers");
const lendingAbi = require("../public/ABI/lending.json");
const erc1155Abi = require("../public/ABI/lendingErc1155.json");
const erc20Abi = require("../public/ABI/erc20.json");

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BNB);
const contractAddress = process.env.LENDING_ADDRESS_BNB;
const contract = new ethers.Contract(contractAddress, lendingAbi, provider);

const contract1155Address = process.env.ERC1155_ADDRESS_BNB;
const contract1155 = new ethers.Contract(contract1155Address, erc1155Abi, provider);

// ERC1155 CONTRACT FUNCTIONS

async function get1155Balance(address, poolId) {
    let balance = await contract1155.balanceOf(address, poolId);
    return balance;
}

// LENDING CONTRACT FUNCTIONS

async function getWagLocked(address, poolId) {
    let balance = await contract.wagLocked(poolId, address);
    return balance;
}

async function getPoolDetail(poolId) {
    let poolDetail = await contract.pools(poolId);
    return poolDetail;
}

async function getPoolFees(poolId) {
    let response = await contract.fees(poolId);
    return response;
}

async function getUserInterest(address, poolId) {
    let paymentFrequency = (await contract.pools(poolId)).paymentFrequency;
    let balance = await contract.getInterestAmountShare(poolId, address);
    return balance * paymentFrequency;
}

async function getTotalValueLocked(address) {
    let tvl = await contract.totalValueLocked(address);
    return tvl;
}

async function getTotalLoanOrigination(address) {
    let response = await contract.totalLoanOrigination(address);
    return response;
}

async function getCurrentLoansOutstanding(address) {
    let response = await contract.currentLoansOutstanding(address);
    return response;
}

async function getLatestInterestClaimed(address, poolId) {
    let response = await contract.latestInterestClaimed(poolId, address);
    return response;
}

async function getInterestAmountShare(address, poolId) {
    let response = await contract.getInterestAmountShare(poolId, address);
    return response;
}

async function getClaimableInterestAmount(address, poolId) {
    let response = await contract.getClaimableInterestAmount(poolId, address);
    return response;
}

// STABLECOIN FUNCTIONS

async function getStableDecimals(currencyAddress) {
    const currencyContract = new ethers.Contract(currencyAddress, erc20Abi, provider);
    let decimal = await currencyContract.decimals();
    return decimal;
}

async function getStableSymbol(currencyAddress) {
    const currencyContract = new ethers.Contract(currencyAddress, erc20Abi, provider);
    let decimal = await currencyContract.symbol();
    return decimal;
}

// CONTROLLER SERVICES

module.exports = {
    getPoolService : async (poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract.pools(poolId);
                resolve(response);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getActivePoolService : async (poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract.activePools(poolId);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        })
    },

    getPoolFeeService : async (poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract.fees(poolId);
                resolve(response);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },
    
    getPoolMaxSupplyService : async (poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract1155.tokenMaxSupply(poolId);
                resolve(response);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getPoolSupplyService : async (poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract1155.tokenSupply(poolId);
                resolve(response);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getUserStableBalanceService : async (address, poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract1155.balanceOf(address, poolId);
                resolve(response);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getWagLockedService : async (address, poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract.wagLocked(poolId, address);
                resolve(response);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getInterestAmountShareService : async (address, poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract.getInterestAmountShare(poolId, address);
                resolve(response);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },
    
    getLatestInterestClaimedService : async (address, poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                let response = await contract.latestInterestClaimed(poolId, address);
                resolve(response);
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
    },

    getPoolsService : async (status) => {
        return new Promise( async (resolve, reject) => {
            try {
                const response = await fetch('../api/lending/?id=' + status);
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

    getPoolActivitiesService : async (poolId, network) => {
        return new Promise( async (resolve, reject) => {
            try {
                const response = await fetch('../../api/lending/getActivities/?id=' + poolId + '&network=' + network);
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

    getUserPoolsService : async (address) => {
        return new Promise( async (resolve, reject) => {
            try {
                const response = await fetch('../../api/lending/getUsersPools/?address=' + address);
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

    getUserBalancesService : async (pools, address) => {
        return new Promise( async (resolve, reject) => {
            try {
                let tvlWag = 0;
                let tvlIdrt = 0;
                let interestIdrt = 0;
                let interestIdrtInYear = 0;

                const wagDecimal = 18;
                
                const poolCount = pools.length;
                for(let i = 0; i < poolCount; i++) {
                    const poolDetail = await getPoolDetail(pools[i].pool_id);

                    const stableDecimal = parseFloat(await getStableDecimals(pools[i].currency));

                    const dataIdrt = parseFloat(await get1155Balance(address, pools[i].pool_id));
                    tvlIdrt += dataIdrt / Math.pow(10,stableDecimal)
                    
                    const dataWag = parseFloat(await getWagLocked(address, pools[i].pool_id));
                    tvlWag += dataWag / Math.pow(10,wagDecimal)

                    const dataInterest = parseFloat(await getUserInterest(address, pools[i].pool_id));
                    interestIdrt += dataInterest / Math.pow(10,stableDecimal)

                    interestIdrtInYear += dataInterest * 31536000 / parseFloat(poolDetail.loanTerm);
                }
                resolve([tvlIdrt, tvlWag, interestIdrt, interestIdrtInYear]);
            } catch (error) {
                console.error('Error fetching JSON:', error);
                reject(error);
            }
        })
    },

    getLendingOverviewService: async (poolId) =>{
        return new Promise( async (resolve, reject) => {
            try {
                let overview = {};
                // get TVL of IDRT
                const tvlIdrt = await getTotalValueLocked(process.env.BNB_STABLE_COIN_ADDRESS_1);

                // get total loan originations of IDRT
                const totalLoanOriginationIdrt = await getTotalLoanOrigination(process.env.BNB_STABLE_COIN_ADDRESS_1);

                // get current Loans Outstanding of IDRT
                const currentLoansOutstandingIdrt = await getCurrentLoansOutstanding(process.env.BNB_STABLE_COIN_ADDRESS_1);
                
                const response = {
                    tvl: tvlIdrt,
                    totalLoanOrigination: totalLoanOriginationIdrt,
                    currentLoansOutstanding: currentLoansOutstandingIdrt
                }

                resolve(response);
            } catch (error) {
                reject(error);
            }
        })
    },

    getUserBalanceService: async (address, poolId) =>{
        return new Promise( async (resolve, reject) => {
            try {
                const fees = await getPoolFees(poolId)

                const response = {
                    fees: fees
                }

                resolve(response);
            } catch (error) {
                reject(error);
            }
        })
    },

    getOnGoingPoolUserBalanceService: async (address, poolId) =>{
        return new Promise( async (resolve, reject) => {
            try {
                const latestInterestClaimed = await getLatestInterestClaimed(address, poolId)

                const interestAmountShare = await getInterestAmountShare(address, poolId)

                const claimableInterestAmount = await getClaimableInterestAmount(address, poolId)

                const response = {
                    latestInterestClaimed: latestInterestClaimed,
                    interestAmountShare: interestAmountShare,
                    claimableInterestAmount: claimableInterestAmount,
                }

                resolve(response);
            } catch (error) {
                reject(error);
            }
        })
    },

    getAssetsPoolService : async (poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                const response = await fetch('../../api/lending/getAssetsPool/?pool_id=' + poolId);
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

    getShipmentsPoolService : async (poolId) => {
        return new Promise( async (resolve, reject) => {
            try {
                const response = await fetch('../../api/lending/getShipmentsPool/?pool_id=' + poolId);
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
}