import { useEffect } from "react";
import { numberWithCommas } from "../../util/stringUtility";
import StakeDialog from "./dialog/StakeDialog";
import UnstakeDialog from "./dialog/UnstakeDialog";
import useGetWagBalanceHook from "./utils/useGetWagBalanceHook";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import { HiLockClosed, HiWallet } from "react-icons/hi2";

interface StakeSectionProps {
    fetch: boolean;
    triggerFetch: () => void;
    stakedBalance: string | null;
    claimableDuration: string | null;
}

export default function StakeSection({ fetch, triggerFetch, stakedBalance, claimableDuration }: StakeSectionProps) {
    const {connectedAddress: address} = useConnectedAddress();

    const { isLoading, data: balance, fetchData: getBalance } = useGetWagBalanceHook();

    useEffect(()=>{
        if(address) {
            getBalance(address)
        }
    }, [address])

    useEffect(()=>{
        if(address) {
            getBalance(address)
        }
    }, [fetch])
    
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                    <HiLockClosed className="w-5 h-5 text-blue-600" />
                </div>
                <h6 className="text-sm font-medium text-gray-700">
                    Staking WAG helps to secure and govern Wagon Network
                </h6>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 mb-4">
                <div className="flex items-center gap-2">
                    <HiWallet className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Available balance</span>
                </div>
                <span className="text-base font-medium text-gray-900">
                    {(isLoading || balance == null) ? "~" : numberWithCommas(parseFloat(balance) / 1e18)}
                    <span className="text-gray-500 ml-1">WAG</span>
                </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                <div>
                    <UnstakeDialog 
                        triggerFetch={triggerFetch} 
                        stakedBalance={stakedBalance || "0"}
                        claimableDuration={claimableDuration}
                    />
                </div>
                <div>
                    <StakeDialog 
                        triggerFetch={triggerFetch} 
                        balance={balance || "0"} 
                        claimableDuration={claimableDuration}
                    />
                </div>
            </div>
        </div>
    )
} 