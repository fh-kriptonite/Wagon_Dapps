import { numberWithCommas } from "../../util/stringUtility";
import { useEffect } from "react";
import { Button } from "flowbite-react";
import useGetUserRewardHook from "./utils/useGetUserRewardHook";
import useGetUserClaimableHook from "./utils/useGetUserClaimableHook";
import useClaimWagHook from "./utils/useClaimWagHook";
import useClaimUnstakedWagHook from "./utils/useClaimUnstakedWagHook";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import useChainHook from "../../util/useChainHook";
import useSwitchNetworkHook from "./utils/useSwitchNetworkHook";
import { HiGift, HiArrowDownTray } from "react-icons/hi2";

interface WithdrawCardProps {
    fetch: boolean;
    triggerFetch: () => void;
}

export default function WithdrawCard({ fetch, triggerFetch }: WithdrawCardProps) {
    const {connectedAddress: address} = useConnectedAddress();

    const { data: reward, fetchData: getUserReward } = useGetUserRewardHook();
    const { data: claimable, fetchData: getUserClaimable } = useGetUserClaimableHook();

    useEffect(()=>{
        if(address) {
            getUserReward(address);
            getUserClaimable(address);
        }
    }, [address])

    useEffect(()=>{
        if(address) {
            getUserReward(address);
            getUserClaimable(address);
        }
    }, [fetch])
    
    const { isLoading: isLoadingClaimWag, fetchData: claimWag } = useClaimWagHook();
    const { fetchData: getChain } = useChainHook();
    const { fetchData: switchNetwork } = useSwitchNetworkHook();

    async function handleClaim(): Promise<void> {
        const chainId = (await getChain()).data;
        if (!chainId) return;
        if(chainId !== Number(process.env.ETH_CHAIN_ID)) {
            try {
                const resultSwitchNetwork = await switchNetwork(Number(process.env.ETH_CHAIN_ID));
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
            triggerFetch();
        } catch (error) {
            console.log(error)
        }
    }

    const { isLoading: isLoadingClaimUnstakedWag, fetchData: claimUnstakedWag } = useClaimUnstakedWagHook();

    async function handleWithdraw(): Promise<void> {
        const chainId = (await getChain()).data;
        if (!chainId) return;
        if(chainId !== Number(process.env.ETH_CHAIN_ID)) {
            try {
                const resultSwitchNetwork = await switchNetwork(Number(process.env.ETH_CHAIN_ID));
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
            triggerFetch();
        } catch (error) {
            console.log(error)
        }
    }

    function isClaimDisabled(): boolean {
        if(isLoadingClaimWag) return true;
        if(reward == null) return true;
        if(parseFloat(reward) === 0) return true;

        return false;
    }

    function isWithdrawDisabled(): boolean {
        if(isLoadingClaimUnstakedWag) return true;
        if(claimable == null) return true;
        if(Number(claimable[2]) === 0) return true;
        
        const currentDate = new Date();
        const claimableDate = new Date(Number(claimable[1]) * 1000);
        if(currentDate < claimableDate) return true;

        return false;
    }

    function getClaimableTime(): string {
        if(claimable == null) return "~";
        if(claimable[1] != null && claimable[1] != BigInt(0)) {
            return (new Date(Number(claimable[1]) * 1000)).toUTCString()
        }
        return "~"
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Withdraw & Claim</h3>
            
            {/* Reward Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 md:p-5 mb-4 md:mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg">
                            <HiGift className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h6 className="text-xs md:text-sm font-medium text-gray-600">My Reward</h6>
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                                {(reward != null) ? numberWithCommas(parseFloat(reward)/1e18, 2) : "~"}
                                <span className="text-gray-500 ml-1 text-sm md:text-base">WAG</span>
                            </h2>
                        </div>
                    </div>
                    <Button 
                        color="success"
                        size="sm"
                        disabled={isClaimDisabled()}
                        onClick={handleClaim}
                        className="w-full md:w-auto min-w-[100px]"
                    >
                        {isLoadingClaimWag ? "Claiming..." : "Claim"}
                    </Button>
                </div>
            </div>

            {/* Unstake Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg">
                            <HiArrowDownTray className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h6 className="text-xs md:text-sm font-medium text-gray-600">My Pending Unstake</h6>
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                                {claimable != null ? numberWithCommas(Number(claimable[2])/1e18, 2) : "~"}
                                <span className="text-gray-500 ml-1 text-sm md:text-base">WAG</span>
                            </h2>
                        </div>
                    </div>
                    <Button 
                        color="blue"
                        size="sm"
                        disabled={isWithdrawDisabled()}
                        onClick={handleWithdraw}
                        className="w-full md:w-auto min-w-[100px]"
                    >
                        {isLoadingClaimUnstakedWag ? "Withdrawing..." : "Withdraw"}
                    </Button>
                </div>

                {/* Withdrawable Time */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-xs md:text-sm text-gray-600">
                        Withdrawable after{" "}
                        <span className="font-medium text-gray-900">
                            {claimable != null ? getClaimableTime() : "~"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
} 