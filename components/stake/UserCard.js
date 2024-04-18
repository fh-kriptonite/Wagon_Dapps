import StakingStatsSummary from "./StakingStatsSummary"
import StakeSection from "./StakeSection";
import useGetClaimableDurationHook from "./utils/useGetClaimableDurationHook";
import useGetStakedWagBalanceHook from "./utils/useGetStakedWagBalanceHook";
import { useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function UserCard(props) {

    const { address } = useWeb3ModalAccount();

    const { data: claimableDuration, fetchData: getClaimableDuration } = useGetClaimableDurationHook();
    const { data: stakedBalance, fetchData: getStakedWagBalance } = useGetStakedWagBalanceHook();

    useEffect(()=>{
        getClaimableDuration();
        getStakedWagBalance(address);
    }, [])

    useEffect(()=>{
        getStakedWagBalance(address);
    }, [props.fetch])

    return (
        <>
            <div className="card">
                <div className="flex flex-col-reverse lg:flex-row gap-2">
                    <div className="flex-initial lg:w-1/3 lg:pr-4">
                        <StakeSection {...props} stakedBalance={stakedBalance} claimableDuration={claimableDuration}/>
                    </div>

                    <div className="grow">
                        <div className="h-full">
                            <StakingStatsSummary  {...props} stakedBalance={stakedBalance} claimableDuration={claimableDuration}/>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
  }