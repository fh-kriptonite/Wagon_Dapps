import { useNetwork, useContractReads } from "wagmi"
import stakingABI from "../../public/ABI/staking.json";
import erc20ABI from "../../public/ABI/erc20.json";
import uniswapPairABI from "../../public/ABI/uniswapPair.json"
import { numberWithCommas, numberWithLetter } from "../../util/stringUtility";
import { useState, useEffect } from "react";

import { getCoinPriceService } from "../../services/service_erc20"

export default function GeneralCard(props) {
    const [totalStaked, setTotalStaked] = useState(0);
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

    const { refetch: refetchStats } = useContractReads({
        contracts: [
            {
                ...wagonContract,
                functionName: 'totalSupply',
            },
            {
                ...wagonContract,
                functionName: 'balanceOf',
                args: [process.env.WAGON_TEAM_FINANCE_LOCK],
            },
            {
                ...wagonContract,
                functionName: 'balanceOf',
                args: [process.env.WAGON_STAKING_PROXY],
            }

        ],
        watch: true,
        onSuccess: (data)=>{
            if(data != null) {
                if(data[0] != null) {
                    setTotalSupply(data[0])
                }
                
                if(data[0] != null && data[1] != null && data[2] != null) {
                    setTotalCirculation(data[0] - data[1] - data[2])
                }
            }
        }
    })

    const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'totalSupply',
            },
            {
                ...stakingContract,
                functionName: 'rewardRate',
            },
            {
                ...stakingContract,
                functionName: 'finishAt',
            },
        ],
        watch: true,
        onSuccess: (data)=>{
            if(data != null) {
                if(data[0] != null) {
                    setTotalStaked(data[0]);
                }
    
                if(data[1] != null) {
                    setRewarRate(data[1]);
                }

                if(data[2] != null) {
                    setFinishAt(new Date(data[2] * 1000));
                }

            }
        }
    })

    async function getPrice(priceWAG_ETH) {
        try {
            const wagPriceData = await getCoinPriceService("WAG");
            setPrice(wagPriceData.data[0].usd_price);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getPrice();
    }, [])

    useEffect(()=> {
        refetch();
        refetchStats();
    }, [props.fetch])

    function getAPY() {
        if(totalStaked == 0) return 0;
        if(finishAt == null) return 0;
        if(finishAt < new Date()) return 0;

        return rewardRate / totalStaked * 31536000 * 100;
    }

    return (
        <>
            <div className="card mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-2">
                <div className="">
                    <h6 className="text-sm font-medium text-gray-500">Total Value Stacked</h6>
                    <h2 className="mt-1">
                        {
                            isSuccess
                            ? numberWithLetter(totalStaked / 1e18 * price, 2)
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
                            ? numberWithCommas(totalStaked / 1e18)
                            : "~"
                        }
                    </span></h6>
                    <h6 className="text-sm font-light text-gray-500">% of WAG Staked: <span className="font-medium">
                        {
                            isSuccess
                            ? totalCirculation == 0 
                                ? "0"
                                : numberWithCommas(totalStaked / totalCirculation * 100, 1)
                            : "~"
                        }%
                    </span></h6>
                </div>
            </div>
        </>
    )
  }