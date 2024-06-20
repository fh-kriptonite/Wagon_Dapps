import { useEffect } from "react";

import { numberWithCommas } from "../../util/stringUtility";
import StakeDialog from "./dialog/StakeDialog";
import UnstakeDialog from "./dialog/UnstakeDialog";
import useGetWagBalanceHook from "./utils/useGetWagBalanceHook";
import { useWeb3WalletState } from "../general/web3WalletContext";

export default function StakeSection(props) {
    const { address } = useWeb3WalletState();

    const { isLoading, data: balance, fetchData: getBalance } = useGetWagBalanceHook();

    useEffect(()=>{
        if(address != null) {
            getBalance(address)
        }
    }, [address])

    useEffect(()=>{
        getBalance(address)
    }, [props.fetch])
    
    return (
        <div className="lg:mr-4">
            <div className="justify-center lg:justify-start">
                <h6 className="text-sm font-medium">Staking WAG helps to secure and govern Wagon Network </h6>
            </div>

            <div className="flex mt-6 gap-2 justify-between">
                <p className="text-sm font-light text-gray-500">Available balance:</p>
                <p className="text-sm font-medium text-gray-500">{ isLoading ? "~" : numberWithCommas(parseFloat(balance) / 1e18) } WAG</p>
            </div>
            
            <div className="flex gap-2 mt-3">
                <div className="flex-1">
                    <UnstakeDialog {...props}/>
                </div>
                <div className="flex-1">
                    <StakeDialog {...props} balance={balance}/>
                </div>
            </div>
            
        </div>
    )
  }