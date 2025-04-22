import { useState } from "react";
import GeneralCard from "./GeneralCard";
import UserCard from "./UserCard";
import WithdrawCard from "./WithdrawCard";
import { HiLockClosed } from "react-icons/hi2";

export default function StakeComponent() {
    const [fetch, setFetch] = useState(false);

    function triggerFetch(): void {
        setFetch(!fetch);
    }

    return (
        <div className="container mx-auto max-w-7xl space-y-4">  
            {/* Header Section */}
            <div className="max-w-7xl mx-auto">
                <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                    <HiLockClosed className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold">Stake</h2>
                                    <p className="text-blue-100 mt-2 text-sm md:text-base">
                                        Be part of our governance while gaining rewards
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <GeneralCard fetch={fetch}/>
            <UserCard fetch={fetch} triggerFetch={triggerFetch}/>

            <div className="flex flex-col-reverse lg:flex-row items-center gap-4 mb-4 mt-4">
                {/* Info Card */}
                <div className="flex-1 w-full">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white p-2 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-blue-900">What is stkWAG?</h4>
                        </div>
                        
                        <div className="space-y-4">
                            <p className="text-blue-800">
                                When you stake WAG on the platform you receive stkWAG in return. 
                            </p>
                            <p className="text-blue-800">    
                                The stkWAG tokens are tradable and transferable. 
                            </p>
                            <p className="text-blue-800">
                                You can use the stkWAG tokens to participate in Wagon&apos;s governance and approve or reject individual loan applications.
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-blue-200">
                            <p className="text-sm font-medium text-blue-800 mb-2">
                                StkWAG contract:
                            </p>
                            <p className="text-sm font-medium text-blue-600 hover:text-blue-700 w-full truncate">
                                <a 
                                    href={process.env.MAINNET_EXPLORER && process.env.WAGON_STAKING_PROXY 
                                        ? process.env.MAINNET_EXPLORER + process.env.WAGON_STAKING_PROXY 
                                        : "#"} 
                                    target="etherscan_wagon_staking"
                                    className="hover:underline"
                                >
                                    {process.env.WAGON_STAKING_PROXY || "Contract address not available"}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <WithdrawCard fetch={fetch} triggerFetch={triggerFetch}/>
                </div>
                
            </div>
        </div>
    )
} 