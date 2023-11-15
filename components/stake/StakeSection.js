import { useEffect, useState } from "react";
import { useAccount, useNetwork } from 'wagmi'
import { useContractReads } from 'wagmi'

import erc20ABI from "../../public/ABI/erc20.json";

import { numberWithCommas } from "../../util/stringUtility";
import StakeDialog from "./dialog/StakeDialog";
import UnstakeDialog from "./dialog/UnstakeDialog";

export default function StakeSection(props) {
    const { address } = useAccount();

    const [totalBalance, setTotalBalance] = useState(0)
    
    const { chain } = useNetwork()

    const wagonContract = {
        address: (chain?.id == 1) ? process.env.WAG_ADDRESS : process.env.WAG_ADDRESS_BASE_GOERLI,
        abi: erc20ABI,
    }
    
    var command = [{
        ...wagonContract,
        functionName: 'balanceOf',
        args: [address],
        watch: true,
    }]

    const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
        contracts: command,
        onSuccess: (data) => {
            setTotalBalance(data[0]/1e18);
        }
    })

    useEffect(()=>{
        refetch()
    }, [props.fetch])
    
    return (
        <div className="lg:mr-4">
            <div className="justify-center lg:justify-start">
                <h6 className="text-sm font-medium">Staking WAG helps to secure and govern Wagon Network </h6>
            </div>

            <div className="flex mt-6 gap-2 justify-between">
                <p className="text-sm font-light text-gray-500">Available balance:</p>
                <p className="text-sm font-medium text-gray-500">{ numberWithCommas(totalBalance) } WAG</p>
            </div>
            
            <div className="flex gap-2 mt-3">
                <div className="flex-1">
                    <UnstakeDialog {...props}/>
                </div>
                <div className="flex-1">
                    <StakeDialog {...props}/>
                </div>
            </div>
            
        </div>
    )
  }