import { useNetwork, useContractReads } from "wagmi"
import stakingABI from "../../public/ABI/staking.json";
import erc20ABI from "../../public/ABI/erc20.json";
import uniswapPairABI from "../../public/ABI/uniswapPair.json"
import { numberWithCommas, numberWithLetter } from "../../util/stringUtility";
import { useState, useEffect } from "react";

export default function GeneralCard(props) {
    const [totalSupply, setTotalSupply] = useState(0);
    const [rewardRate, setRewarRate] = useState(0);
    const [finishAt, setFinishAt] = useState(null);
    const [totalCirculation, setTotalCirculation] = useState(0);
    const [price, setPrice] = useState(0);

    const { chain } = useNetwork()

    const stakingContract = {
        address: (chain?.id == 1) ? process.env.WAGON_STAKING_PROXY : process.env.WAGON_STAKING_PROXY_BASE_GOERLI,
        abi: stakingABI,
    }

    const wagonContract = {
        address: (chain?.id == 1) ? process.env.WAG_ADDRESS : process.env.WAG_ADDRESS_BASE_GOERLI,
        abi: erc20ABI,
    }

    const uniswapPairContract = {
        address: process.env.WAGON_UNISWAP_PAIR,
        abi: uniswapPairABI,
    }

    const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'totalSupply',
                watch: true
            },
            {
                ...stakingContract,
                functionName: 'rewardRate',
                watch: true
            },
            {
                ...stakingContract,
                functionName: 'finishAt',
                watch: true
            },
            {
                ...wagonContract,
                functionName: 'totalSupply',
                watch: true,
            },
            {
                ...wagonContract,
                functionName: 'balanceOf',
                args: [process.env.WAGON_TEAM_FINANCE_LOCK],
                watch: true,
            },
            {
                ...wagonContract,
                functionName: 'balanceOf',
                args: [process.env.WAGON_STAKING_PROXY],
                watch: true,
            },
            {
                ...uniswapPairContract,
                functionName: 'getReserves',
                watch: true,
            },

        ],
        onSuccess: (data)=>{
            if(data != null) {
                if(data[0] != null) {
                    setTotalSupply(data[0]);
                }
    
                if(data[1] != null) {
                    setRewarRate(data[1]);
                }

                if(data[2] != null) {
                    setFinishAt(new Date(data[2] * 1000));
                }

                if(data[3] != null && data[4] != null && data[5] != null) {
                    setTotalCirculation(data[3] - data[4] - data[5])
                }

                if(data[6] != null) {
                    getPrice(data[6][0] / data[6][1])
                }

            }
        }
    })

    async function getPrice(priceWAG_ETH) {
        try {
            const ethereumApiEndpoint = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

            const response = await fetch(ethereumApiEndpoint, {
                method: 'get'
            });
            const data = await response.json();
            
            if(response.status == 200){
                const ethereumPriceUSD = data.ethereum.usd;
                setPrice(ethereumPriceUSD * priceWAG_ETH)
            } else {
                console.log("error")
            }   
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=> {
        refetch();
    }, [props.fetch])

    function getAPY() {
        if(totalSupply == 0) return 0;
        if(finishAt == null) return 0;
        if(finishAt < new Date()) return 0;

        return rewardRate / totalSupply * 31536000 * 100;
    }

    return (
        <>
            <div className="card mb-4 grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-2">
                <div className="">
                    <h6 className="text-sm font-medium text-gray-500">Total Value Stacked</h6>
                    <h2 className="mt-1">
                        {
                            isSuccess
                            ? numberWithLetter(totalSupply * price, 2)
                            : "~"
                        }
                        <span className="text-2xl font-medium"> USD</span>
                    </h2>
                </div>
                <div className="">
                    <h6 className="text-sm font-medium text-gray-500">Staking APY</h6>
                    <h2 className="mt-1">
                        {
                            isSuccess
                            ? numberWithCommas(getAPY())
                            : "~"
                        }
                        <span className="text-2xl font-medium"> %</span>
                    </h2>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                    <h6 className="text-sm font-light text-gray-500">Circulating Supply: <span className="font-medium">
                        {
                            isSuccess
                            ? numberWithCommas(totalCirculation / 1e18)
                            : "~"
                        }
                    </span></h6>
                    <h6 className="text-sm font-light text-gray-500">Total WAG Staked: <span className="font-medium">
                        {
                            isSuccess
                            ? numberWithLetter(totalSupply / 1e18)
                            : "~"
                        }
                    </span></h6>
                    <h6 className="text-sm font-light text-gray-500">% of WAG Supply Staked: <span className="font-medium">
                        {
                            isSuccess
                            ? numberWithCommas(totalSupply / data[3] * 100, 1)
                            : "~"
                        }%
                    </span></h6>
                </div>
            </div>
        </>
    )
  }