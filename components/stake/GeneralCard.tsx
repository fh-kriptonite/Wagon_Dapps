import { numberWithCommas, numberWithLetter } from "../../util/stringUtility";
import { useEffect } from "react";
import useGetTotalStakedHook from "./utils/useGetTotalStakedHook";
import useGetRewardRateHook from "./utils/useGetRewardRateHook";
import useGetTotalCirculationHook from "./utils/useGetTotalCirculationHook";
import { HiCurrencyDollar, HiChartBar, HiServer } from "react-icons/hi2";

interface GeneralCardProps {
    fetch: boolean;
}

export default function GeneralCard({ fetch }: GeneralCardProps) {
    const { isLoading: isLoadingGetTotalStaked, data: totalStaked, dataInUsd: totalStakedInUsd, fetchData: getTotalStaked } = useGetTotalStakedHook();
    const { isLoading: isLoadingRewardRate, data: rewardRate, dataFinishAt: finishAt, fetchData: getRewardRate } = useGetRewardRateHook();
    const { isLoading: isLoadingCirculation, data: totalCirculation, fetchData: getTotalCirculation } = useGetTotalCirculationHook();
    
    useEffect(()=>{
        getTotalStaked();
        getRewardRate();
        getTotalCirculation();
    }, [])

    useEffect(()=> {
        getTotalStaked();
        getRewardRate();
        getTotalCirculation();
    }, [fetch])

    function getAPY(): number {
        if(totalStaked === 0 || totalStaked == null) return 0;
        if(finishAt == null) return 0;
        if(new Date(finishAt) < new Date()) return 0;
        if(rewardRate == null) return 0;

        return rewardRate / totalStaked * 31536000 * 100 / 1e18;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Value Staked */}
                <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white p-2 rounded-lg">
                            <HiCurrencyDollar className="w-5 h-5 text-blue-600" />
                        </div>
                        <h6 className="text-sm font-medium text-gray-600">Total Value Staked</h6>
                    </div>
                    <h2 className="text-4xl font-semibold text-gray-900">
                        {isLoadingGetTotalStaked ? "~" : numberWithLetter(totalStakedInUsd, 2)}
                        <span className="text-gray-500 ml-1 text-xl">USD</span>
                    </h2>
                </div>

                {/* Staking APY */}
                <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white p-2 rounded-lg">
                            <HiChartBar className="w-5 h-5 text-green-600" />
                        </div>
                        <h6 className="text-sm font-medium text-gray-600">Staking APY</h6>
                    </div>
                    <h2 className="text-4xl font-semibold text-gray-900">
                        {isLoadingRewardRate || isLoadingGetTotalStaked ? "~" : numberWithCommas(getAPY())}
                        <span className="text-gray-500 ml-1 text-xl">%</span>
                    </h2>
                </div>

                {/* Statistics */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white p-2 rounded-lg">
                            <HiServer className="w-5 h-5 text-gray-600" />
                        </div>
                        <h6 className="text-sm font-medium text-gray-600">Statistics</h6>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Circulating Supply</span>
                            <span className="text-sm font-medium text-gray-900">
                                {isLoadingCirculation ? "~" : numberWithCommas(totalCirculation)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total WAG Staked</span>
                            <span className="text-sm font-medium text-gray-900">
                                {isLoadingGetTotalStaked ? "~" : numberWithCommas(totalStaked)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 