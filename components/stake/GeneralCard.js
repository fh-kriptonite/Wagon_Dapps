import { numberWithCommas, numberWithLetter } from "../../util/stringUtility";
import { useState, useEffect } from "react";

import useGetTotalStakedHook from "./utils/useGetTotalStakedHook";
import useGetRewardRateHook from "./utils/useGetRewardRateHook";
import useGetTotalCirculationHook from "./utils/useGetTotalCirculationHook";

export default function GeneralCard(props) {
    const { isLoading: isLoadingGetTotalStaked, data: totalStaked, dataInUsd: totalStakedInUsd, fetchData: getTotalStaked } = useGetTotalStakedHook();
    const { isLoading: isLoadingRewardRate, data: rewardRate, dataFinishAt: finishAt, fetchData: getRewardRate } = useGetRewardRateHook();
    const { isLoading: isLoadingCirculation, data: totalCirculation, fetchData: getTotalCirculation } = useGetTotalCirculationHook();
    
    const [apy, setApy] = useState(0);

    useEffect(()=>{
        getTotalStaked();
        getRewardRate();
        getTotalCirculation();
    }, [])

    useEffect(()=> {
        getTotalStaked();
        getRewardRate();
        getTotalCirculation();
    }, [props.fetch])

    function getAPY() {
        if(totalStaked == 0 || totalStaked == null) return 0;
        if(finishAt == null) return 0;
        if(finishAt < new Date()) return 0;

        return rewardRate / totalStaked * 31536000 * 100 / 1e18;
    }

    useEffect(()=>{
        const response = getAPY();
        setApy(response);
    }, [totalStaked, finishAt, rewardRate])

    return (
        <>
            <div className="card mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-2">
                <div className="">
                    <h6 className="text-sm font-medium text-gray-500">Total Value Stacked</h6>
                    <h2 className="mt-1">
                        {
                            isLoadingGetTotalStaked
                            ? "~"
                            : numberWithLetter(totalStakedInUsd, 2)
                        }
                        <span className="text-2xl font-medium"> USD</span>
                    </h2>
                </div>
                <div className="">
                    <h6 className="text-sm font-medium text-gray-500">Staking APY</h6>
                    <h2 className="mt-1">
                        {
                            isLoadingRewardRate || isLoadingGetTotalStaked
                            ? "~"
                            : numberWithCommas(apy)
                        }
                        <span className="text-2xl font-medium"> %</span>
                    </h2>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                    <h6 className="text-sm font-light text-gray-500">Circulating Supply: <span className="font-medium">
                        {
                            isLoadingCirculation
                            ? "~"
                            : numberWithCommas(totalCirculation)
                        }
                    </span></h6>
                    <h6 className="text-sm font-light text-gray-500">Total WAG Staked: <span className="font-medium">
                        {
                            isLoadingGetTotalStaked
                            ? "~"
                            : numberWithCommas(totalStaked)
                        }
                    </span></h6>
                    <h6 className="text-sm font-light text-gray-500">% of WAG Staked: <span className="font-medium">
                        {
                            isLoadingCirculation || isLoadingGetTotalStaked
                            ? "~"
                            : totalCirculation == 0 
                                ? "0"
                                : numberWithCommas(totalStaked / totalCirculation * 100, 1)
                        }%
                    </span></h6>
                </div>
            </div>
        </>
    )
  }