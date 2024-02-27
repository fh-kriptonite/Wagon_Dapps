import { useAccount, useContractReads, useNetwork } from "wagmi"
import { numberWithCommas } from "../../util/stringUtility";
import stakingABI from "../../public/ABI/staking.json";
import { useEffect } from "react";

export default function StakingStatsSummary(props) {

    const { address } = useAccount();

    const { chain } = useNetwork()

    const stakingContract = {
        address: (chain?.id == 1) ? process.env.WAGON_STAKING_PROXY : process.env.WAGON_STAKING_PROXY_BASE_GOERLI,
        abi: stakingABI,
    }

    const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'balanceOf',
                args: [address],
                watch: true
            },
            {
                ...stakingContract,
                functionName: 'claimableDuration',
                watch: true
            },
            {
                ...stakingContract,
                functionName: 'userTotalRewardClaimed',
                args: [address],
                watch: true
            },
        ],
    })

    useEffect(()=> {
        refetch();
    }, [props.fetch])

    return (
        <div className="flex flex-col h-full">
            <div className="grow">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-2">
                    <div className="flex-1">
                        <h6 className="text-sm font-medium text-gray-500">My Total Stake</h6>
                        <h2 className="">
                            {
                                isSuccess
                                ? numberWithCommas(data[0] / 1e18)
                                : "~"
                            }
                        <span className="text-2xl font-medium"> WAG</span></h2>
                    </div>
                    <div className="flex-1">
                        <h6 className="text-sm font-medium text-gray-500">My Total Earn</h6>
                        <h2 className="">
                            {
                                isSuccess
                                ? numberWithCommas(data[2] / 1e18)
                                : "~"
                            }
                        <span className="text-2xl font-medium"> WAG</span></h2>
                    </div>
                </div>
            </div>
            <div className="pb-3 lg:pb-0 pt-3 border-b-2 lg:border-b-0 border-t-2 flex-none mt-2">
                <p className="text-xs font-light text-gray-500">
                    Unstake period:
                    <span className="ml-1 font-medium">
                        {
                            isSuccess
                            ? data[1] / 86400
                            : "~"
                        } days</span>
                </p>
            </div>
        </div>
    )
  }