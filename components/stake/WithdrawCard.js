import { useAccount, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { numberWithCommas } from "../../util/stringUtility";
import stakingABI from "../../public/ABI/staking.json";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";

export default function WithdrawCard(props) {
    const [claimTime, setClaimTime] = useState(null);
    const [reward, setReward] = useState(null);
    const [readyToWithdraw, setReadyToWithdraw] = useState(null);
    
    const { address } = useAccount();
    const { chain } = useNetwork()

    const stakingContract = {
        address: (chain?.id == 1) ? process.env.WAGON_STAKING_PROXY : process.env.WAGON_STAKING_PROXY_BASE_GOERLI,
        abi: stakingABI,
    }

    const currentDate = new Date();

    const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'claimables',
                args: [address],
                watch: true
            },
            {
                ...stakingContract,
                functionName: 'earned',
                args: [address],
                watch: true
            },
        ],
        onSuccess:(data) => {
            if (data[0] != null) {
                setReadyToWithdraw(data[0].amount / 1e18);
                
                if(data[0].claimableTime > 0) 
                    setClaimTime(new Date(data[0].claimableTime * 1000))
            }
            if(data[1] != null) {
                setReward(data[1] / 1e18);
            }
        }
    })

    useEffect(()=>{
        refetch();
    }, [props.fetch])

    // get reward function
    let { config } = usePrepareContractWrite({
        ...stakingContract,
        functionName: 'getReward'
    })
    
    const {
        data : useContractWriteData, 
        error: errorWrite, 
        isError: isErrorWrite, 
        isLoading : useContractWriteLoading, 
        write 
    } = useContractWrite(config)

    const {
        data : useWaitForTransactionData, 
        isLoading : useWaitForTransactionLoading, 
        isSuccess : useWaitForTransactionSuccess} 
    = useWaitForTransaction({
        hash: useContractWriteData?.hash,
        onSuccess(data) {
            props.triggerFetch();
        }
    })

    // withdraw unstake coin function
    let { config : configWithdraw } = usePrepareContractWrite({
        ...stakingContract,
        functionName: 'withdraw'
    })
    
    const {
        data : useContractWriteDataWithdraw, 
        error: errorWriteWithdraw, 
        isError: isErrorWriteWithdraw, 
        isLoading : useContractWriteLoadingWithdraw, 
        write : writeWithdraw
    } = useContractWrite(configWithdraw)

    const {
        data : useWaitForTransactionDataWithdraw, 
        isLoading : useWaitForTransactionLoadingWithdraw, 
        isSuccess : useWaitForTransactionSuccessWithdraw} 
    = useWaitForTransaction({
        hash: useContractWriteDataWithdraw?.hash,
        onSuccess(data) {
            props.triggerFetch();
        }
    })

    return (
        <div className="card flex-1">
            <div className="flex items-center">
                    <div className="grow">
                        <h6 className="text-sm font-medium text-gray-500">My Reward</h6>
                        <h2 className="mt-1">
                            {
                                (reward != null )
                                ? numberWithCommas(reward)
                                : "~"
                            }
                            <span className="text-2xl font-medium"> WAG</span>
                        </h2>
                    </div>
                    <div className="flex-none w-36">
                    {
                        (useContractWriteLoading || useWaitForTransactionLoading)
                        ?   <div className="text-center">
                                <Spinner
                                    aria-label="Loading Claim"
                                    size="xl"
                                />
                            </div>
                        : <button
                            type="button"
                            onClick={()=>{
                                write?.()
                            }}
                            className= {
                                (   reward == null || 
                                    reward == 0 || 
                                    useContractWriteLoading || 
                                    useWaitForTransactionLoading ||
                                    !write
                                ) ? "button-dark-disable" : "button-light"
                            }
                            disabled= {
                                (   reward == null || 
                                    reward == 0 || 
                                    useContractWriteLoading || 
                                    useWaitForTransactionLoading ||
                                    !write
                                )  ? true : false}
                        >
                            Claim
                        </button>
                    }
                    </div>
            </div>
            <div className="flex items-center border-t-2 mt-3 pt-3">
                <div className="grow">
                    <h6 className="text-sm font-medium text-gray-500">My Pending Unstake</h6>
                    <h2 className="mt-1">
                        {
                            readyToWithdraw != null
                            ? numberWithCommas(readyToWithdraw)
                            : "~"
                        }
                        <span className="text-2xl font-medium"> WAG</span>
                    </h2>
                </div>
                <div className="flex-none w-36">
                    {
                        (useContractWriteLoadingWithdraw || useWaitForTransactionLoadingWithdraw)
                        ?   <div className="text-center">
                                <Spinner
                                    aria-label="Loading Withdraw"
                                    size="xl"
                                />
                            </div>
                        : <button
                            type="button"
                            onClick={()=>{
                                writeWithdraw?.()
                            }}
                            className= {
                                (
                                    readyToWithdraw == null || 
                                    readyToWithdraw == 0 || 
                                    currentDate < claimTime ||
                                    useContractWriteLoadingWithdraw || 
                                    useWaitForTransactionLoadingWithdraw ||
                                    !writeWithdraw
                                ) ? "button-dark-disable" : "button-light"}
                            disabled= {
                                (
                                    readyToWithdraw == null || 
                                    readyToWithdraw == 0 || 
                                    currentDate < claimTime ||
                                    useContractWriteLoadingWithdraw || 
                                    useWaitForTransactionLoadingWithdraw ||
                                    !writeWithdraw
                                ) ? true : false}
                        >
                            Withdraw
                        </button>
                    }
                    
                </div>
            </div>
            <div className="border-t-2 mt-2 pt-3">
                <p className="text-xs text-gray-500 font-light">Withdrawable at <span className="font-medium">
                    {
                        claimTime != null
                        ? claimTime.toUTCString()
                        : "~"
                    }
                </span></p>
            </div>
        </div>
    )
  }