import StakingStatsSummary from "./StakingStatsSummary"
import StakeSection from "./StakeSection";
import useGetClaimableDurationHook from "./utils/useGetClaimableDurationHook";
import useGetStakedWagBalanceHook from "./utils/useGetStakedWagBalanceHook";
import { useEffect } from "react";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";

interface UserCardProps {
    fetch: boolean;
    triggerFetch: () => void;
}

export default function UserCard({ fetch, triggerFetch }: UserCardProps) {
    const {connectedAddress: address} = useConnectedAddress();

    const { data: claimableDuration, fetchData: getClaimableDuration } = useGetClaimableDurationHook();
    const { data: stakedBalance, fetchData: getStakedWagBalance } = useGetStakedWagBalanceHook();

    useEffect(()=>{
        getClaimableDuration();
    }, [])

    useEffect(()=>{
        if(address) {
            getStakedWagBalance(address);
        }
    }, [address])

    useEffect(()=>{
        if(address) {
            getStakedWagBalance(address);
        }
    }, [fetch])

    return (
        <div className="bg-white rounded-2xl shadow-sm">
            
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* Stake Section */}
                    <div className="col-span-1 h-full">
                        <StakeSection 
                            fetch={fetch} 
                            triggerFetch={triggerFetch} 
                            stakedBalance={stakedBalance} 
                            claimableDuration={claimableDuration?.toString() || null}
                        />
                    </div>

                    {/* Stats Summary */}
                    <div className="col-span-2 h-full">
                        <StakingStatsSummary 
                            fetch={fetch} 
                            triggerFetch={triggerFetch} 
                            stakedBalance={stakedBalance} 
                            claimableDuration={claimableDuration?.toString() || null}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} 