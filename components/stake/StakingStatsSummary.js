import { convertTime, numberWithCommas } from "../../util/stringUtility";
import { useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import useGetTotalEarnHook from "./utils/useGetTotalEarnHook";

export default function StakingStatsSummary(props) {
    const { address } = useWeb3ModalAccount();

    const claimableDuration = props.claimableDuration;
    const stakedBalance = props.stakedBalance;

    const { data: totalEarn, fetchData: getTotalEarn } = useGetTotalEarnHook();

    useEffect(()=>{
        getTotalEarn(address);
    }, [])

    useEffect(()=>{
        getTotalEarn(address);
    }, [props.fetch])

    return (
        <div className="flex flex-col h-full">
            <div className="grow">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-2">
                    <div className="flex-1">
                        <h6 className="text-sm font-medium text-gray-500">My Total Stake</h6>
                        <h2 className="">
                            {
                                stakedBalance != null
                                ? numberWithCommas(parseFloat(stakedBalance) / 1e18, 0)
                                : "0"
                            }
                        <span className="text-2xl font-medium"> WAG</span></h2>
                    </div>
                    <div className="flex-1">
                        <h6 className="text-sm font-medium text-gray-500">My Total Earn</h6>
                        <h2 className="">
                            {
                                totalEarn != null
                                ? numberWithCommas(parseFloat(totalEarn) / 1e18, 0)
                                : "0"
                            }
                        <span className="text-2xl font-medium"> WAG</span></h2>
                    </div>
                </div>
            </div>
            <div className="pb-3 lg:pb-0 pt-3 border-b-2 lg:border-b-0 border-t-2 flex-none mt-2">
                <p className="text-xs font-light text-gray-500">
                    Unstake period:
                    {
                        claimableDuration != null
                        ? " " + convertTime(parseFloat(claimableDuration)) + " "
                        : " ~ "
                    }
                </p>
            </div>
        </div>
    )
  }