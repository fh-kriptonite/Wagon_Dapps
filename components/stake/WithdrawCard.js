import { numberWithCommas } from "../../util/stringUtility";
import { useEffect } from "react";
import { Button } from "flowbite-react";
import useGetUserRewardHook from "./utils/useGetUserRewardHook";
import useGetUserClaimableHook from "./utils/useGetUserClaimableHook";
import useClaimWagHook from "./utils/useClaimWagHook";
import useClaimUnstakedWagHook from "./utils/useClaimUnstakedWagHook";
import { useAccount } from "@particle-network/connectkit";
import useChainHook from "../../util/useChainHook";
import useSwitchNetworkHook from "./utils/useSwitchNetworkHook";

export default function WithdrawCard(props) {
    const address = useAccount();

    const { data: reward, fetchData: getUserReward } = useGetUserRewardHook();
    const { data: claimable, fetchData: getUserClaimable } = useGetUserClaimableHook();

    useEffect(()=>{
        getUserReward(address);
        getUserClaimable(address);
    }, [])

    useEffect(()=>{
        getUserReward(address);
        getUserClaimable(address);
    }, [props.fetch])

    const { isLoading: isLoadingClaimWag, fetchData: claimWag } = useClaimWagHook();
    const { fetchData: getChain } = useChainHook();
    const { fetchData: switchNetwork } = useSwitchNetworkHook();

    async function handleClaim() {
        const chainId = (await getChain()).data;
        if(chainId != process.env.ETH_CHAIN_ID) {
            try {
                const resultSwitchNetwork = await switchNetwork(process.env.ETH_CHAIN_ID);
                if (resultSwitchNetwork.error) {
                    throw resultSwitchNetwork.error
                }
            } catch (error) {
                console.log(error)
                return
            }
        }

        try {
            const resultClaim = await claimWag()
            if (resultClaim.error) {
                throw resultClaim.error;
            }
            props.triggerFetch();
        } catch (error) {
            console.log(error)
        }
    }

    const { isLoading: isLoadingClaimUnstakedWag, fetchData: claimUnstakedWag } = useClaimUnstakedWagHook();

    async function handleWithdraw() {
        const chainId = await getChain();
        if(chainId != process.env.ETH_CHAIN_ID) {
            try {
                const resultSwitchNetwork = await switchNetwork(process.env.ETH_CHAIN_ID);
                if (resultSwitchNetwork.error) {
                    throw resultSwitchNetwork.error
                }
            } catch (error) {
                console.log(error)
                return
            }
        }

        try {
            const resultClaim = await claimUnstakedWag()
            if (resultClaim.error) {
                throw resultClaim.error;
            }
            props.triggerFetch();
        } catch (error) {
            console.log(error)
        }
    }

    function isClaimDisabled() {
        if(isLoadingClaimWag) return true;
        if(reward == null) return true;
        if(parseFloat(reward) == 0) return true;

        return false;
    }

    function isWithdrawDisabled() {
        if(isLoadingClaimUnstakedWag) return true;
        if(claimable == null) return true;
        if(parseFloat(claimable[2]) == 0) return true;
        
        const currentDate = new Date();
        const claimableDate = new Date(parseFloat(claimable[1]) * 1000);
        if(currentDate < claimableDate) return true;

        return false;
    }

    function getClaimableTime() {
        if(claimable == null) return "~";

        if(claimable[1] != null) {
            return (new Date(parseFloat(claimable[1]) * 1000)).toUTCString()
        }
        
        return "~"
    }

    return (
        <div className="card flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="grow">
                        <h6 className="text-sm font-medium text-gray-500">My Reward</h6>
                        <h2 className="mt-1">
                            {
                                (reward != null )
                                ? numberWithCommas(parseFloat(reward)/1e18, 2)
                                : "~"
                            }
                            <span className="text-2xl font-medium"> WAG</span>
                        </h2>
                    </div>
                    <div className="flex-none w-full sm:w-36">
                        <Button color={"dark"} style={{width:"100%"}} size={"sm"}
                            disabled={isClaimDisabled()}
                            onClick={()=>{
                                handleClaim()
                            }}
                        >
                            {
                                isLoadingClaimWag
                                ? "Loading"
                                : "Claim"
                            }
                        </Button>
                    </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-t-2 mt-3 pt-3">
                <div className="grow">
                    <h6 className="text-sm font-medium text-gray-500">My Pending Unstake</h6>
                    <h2 className="mt-1">
                        {
                            claimable != null
                            ? numberWithCommas(parseFloat(claimable[2])/1e18, 2)
                            : "~"
                        }
                        <span className="text-2xl font-medium"> WAG</span>
                    </h2>
                </div>
                <div className="flex-none w-full sm:w-36">
                    <Button color={"dark"} style={{width:"100%"}} size={"sm"}
                        disabled={isWithdrawDisabled()}
                        onClick={()=>{
                            handleWithdraw()
                        }}
                    >
                        {
                            isLoadingClaimUnstakedWag
                            ? "Loading"
                            : "Withdraw"
                        }
                    </Button>
                </div>
            </div>
            <div className="border-t-2 mt-2 pt-3">
                <p className="text-xs text-gray-500 font-light">Withdrawable at <span className="font-medium">
                    {
                        claimable != null
                        ? getClaimableTime()
                        : "~"
                    }
                </span></p>
            </div>
        </div>
    )
  }