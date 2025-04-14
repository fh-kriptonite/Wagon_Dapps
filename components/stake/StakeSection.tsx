import { useEffect } from "react";
import { numberWithCommas } from "../../util/stringUtility";
import StakeDialog from "./dialog/StakeDialog";
import UnstakeDialog from "./dialog/UnstakeDialog";
import useGetWagBalanceHook from "./utils/useGetWagBalanceHook";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";

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
        <div className="lg:mr-4">
            <div className="justify-center lg:justify-start">
                <h6 className="text-sm font-medium">Staking WAG helps to secure and govern Wagon Network </h6>
            </div>

            <div className="flex mt-6 gap-2 justify-between">
                <p className="text-sm font-light text-gray-500">Available balance:</p>
                <p className="text-sm font-medium text-gray-500">{ (isLoading || balance == null) ? "~" : numberWithCommas(parseFloat(balance) / 1e18) } WAG</p>
            </div>
            
            <div className="flex gap-2 mt-3">
                <div className="flex-1">
                    <UnstakeDialog fetch={fetch} triggerFetch={triggerFetch} stakedBalance={stakedBalance || "0"}/>
                </div>
                <div className="flex-1">
                    <StakeDialog triggerFetch={triggerFetch} balance={balance || "0"} claimableDuration={claimableDuration}/>
                </div>
            </div>
            
        </div>
    )
} 