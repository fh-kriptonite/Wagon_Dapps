import { useState } from "react";
import GeneralCard from "./GeneralCard";
import UserCard from "./UserCard";
import WithdrawCard from "./WithdrawCard";
import { useNetwork } from "wagmi";

export default function StakeComponent(props) {
    const [fetch, setFetch] = useState(false);
    
    const { chain } = useNetwork()

    function triggerFetch() {
        setFetch(!fetch);
    }

    return (
        <div className="max-w-5xl mx-auto">  
            <div className="p-4 mb-4 rounded-lg bg-blue-50 text-blue-900">
                <h4 className="font-semibold">Calling all WAG staker!</h4>
                <p className="mt-2 text-sm">Be part of our governance while gaining rewards</p>
            </div>

            <GeneralCard fetch={fetch}/>
            <UserCard fetch={fetch} triggerFetch={triggerFetch}/>

            <div className="flex flex-col-reverse lg:flex-row items-center gap-4 mb-4 mt-4">
                <div className="p-4 rounded-lg bg-blue-50 text-blue-900 flex-1">
                    <h4 className="font-semibold">What is stkWAG ?</h4>
                    <p className="text-sm mt-2">
                        When you stake WAG on the platform you receive stkWAG in return. 
                    </p>
                    <p className="text-sm mt-2">    
                        The stkWAG tokens are tradable and transferable. 
                    </p>
                    <p className="text-sm mt-2">
                        You can use the stkWAG tokens to participate in Wagon's governance and approve or reject individual loan applications.
                    </p>
                    <p className="text-sm mt-4">
                        StkWAG contract:
                    </p>
                    <p className="text-sm font-bold hover:underline">
                        <a href={
                            chain?.id == 1
                            ? process.env.MAINNET_EXPLORER + process.env.WAGON_STAKING_PROXY
                            : process.env.GOERLI_EXPLORER + process.env.WAGON_STAKING_PROXY_BASE_GOERLI
                        } target="blank">
                            {
                                chain?.id == 1
                                ? process.env.WAGON_STAKING_PROXY
                                : process.env.WAGON_STAKING_PROXY_BASE_GOERLI
                            }
                        </a>
                    </p>
                </div>

                <div className="flex-1 w-full">
                    <WithdrawCard fetch={fetch} triggerFetch={triggerFetch}/>
                </div>
                
            </div>
        </div>
    )
  }