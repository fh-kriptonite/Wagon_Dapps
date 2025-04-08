import StakingStatsSummary from "./StakingStatsSummary"
import StakeSection from "./StakeSection";
import useGetClaimableDurationHook from "./utils/useGetClaimableDurationHook";
import useGetStakedWagBalanceHook from "./utils/useGetStakedWagBalanceHook";
import { useEffect } from "react";
import { useAccount } from "@particle-network/connectkit";

interface UserCardProps {
    fetch: boolean;
    triggerFetch: () => void;
}

export default function UserCard({ fetch, triggerFetch }: UserCardProps) {
    const address = useAccount();

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
        <>
            <div className="card">
                <div className="flex flex-col-reverse lg:flex-row gap-2">
                    <div className="flex-initial lg:w-1/3 lg:pr-4">
                        <StakeSection fetch={fetch} triggerFetch={triggerFetch} stakedBalance={stakedBalance} claimableDuration={claimableDuration?.toString() || null}/>
                    </div>

                    <div className="grow">
                        <div className="h-full">
                            <StakingStatsSummary fetch={fetch} triggerFetch={triggerFetch} stakedBalance={stakedBalance} claimableDuration={claimableDuration?.toString() || null}/>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
} 