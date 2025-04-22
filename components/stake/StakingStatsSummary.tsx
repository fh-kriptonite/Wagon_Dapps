import { convertTime, numberWithCommas } from "../../util/stringUtility";
import { useEffect } from "react";
import useGetTotalEarnHook from "./utils/useGetTotalEarnHook";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import { HiChartBar, HiCurrencyDollar } from "react-icons/hi2";

interface StakingStatsSummaryProps {
    fetch: boolean;
    triggerFetch: () => void;
    claimableDuration: string | null;
    stakedBalance: string | null;
}

export default function StakingStatsSummary({ fetch, triggerFetch, claimableDuration, stakedBalance }: StakingStatsSummaryProps) {
    const {connectedAddress: address} = useConnectedAddress();

    const { data: totalEarn, fetchData: getTotalEarn } = useGetTotalEarnHook();
    useEffect(()=>{
        if (address) {
            getTotalEarn(address);
        }
    }, [address])

    useEffect(()=>{
        if (address) {
            getTotalEarn(address);
        }
    }, [fetch])

    return (
        <div className="h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total Stake */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <HiChartBar className="w-5 h-5 text-blue-600" />
                        </div>
                        <h6 className="text-sm font-medium text-gray-600">My Total Stake</h6>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {stakedBalance != null ? numberWithCommas(parseFloat(stakedBalance) / 1e18, 0) : "0"}
                        <span className="text-gray-500 ml-1">WAG</span>
                    </h2>
                </div>

                {/* Total Earn */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-50 p-2 rounded-lg">
                            <HiCurrencyDollar className="w-5 h-5 text-green-600" />
                        </div>
                        <h6 className="text-sm font-medium text-gray-600">My Total Earn</h6>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {totalEarn != null ? numberWithCommas(parseFloat(totalEarn) / 1e18, 0) : "0"}
                        <span className="text-gray-500 ml-1">WAG</span>
                    </h2>
                </div>
            </div>

            <div className="mt-2 md:mt-auto">
                <p className="text-sm text-gray-600">
                    Unstake period:{" "}
                    <span className="font-medium text-gray-900">
                        {claimableDuration != null ? convertTime(parseFloat(claimableDuration)) : "~"}
                    </span>
                </p>
            </div>
        </div>
    )
} 