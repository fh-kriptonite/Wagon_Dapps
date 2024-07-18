import { useAccount } from "@particle-network/connectkit";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { BiArrowBack } from "react-icons/bi";
import useGetActivityDetailHook from "./util/useGetActivityDetailHook";
import { formatDate, numberWithCommas, shortenAddress } from "../../util/stringUtility";
import { FaArrowCircleRight } from "react-icons/fa"
import useGetOnrampDisburseHook from "./util/useGetOnrampDisburseHook";
import useGetPancakeswapSwap from "./util/useGetPancakeswapSwapHook";
import { MdOpenInNew } from "react-icons/md";

export default function ActivityDetailCard(props) {
    const address = useAccount();
    const transactionId = props.transactionId;
    
    const [activity, setActivity] = useState(null);
    const [swaps, setSwaps] = useState([]);
    const [onrampDisburse, setOnrampDisburse] = useState([]);
    const [pancakeswapSwap, setPancakeswapSwap] = useState([]);

    const { isLoading: isLoadingActivityDetail, fetchData: getActivityDetail } = useGetActivityDetailHook();
    const { fetchData: getOnrampDsiburses } = useGetOnrampDisburseHook();
    const { fetchData: getPancakeswapSwap } = useGetPancakeswapSwap();

    async function getActivity() {
        const response = await getActivityDetail(transactionId);
        if(response.error) {
            return ;
        }
        setActivity(response.data[0]);
    }

    async function getOnramp() {
        const response = await getOnrampDsiburses(transactionId);
        if(response.error) {
            return ;
        }
        if(response.data.length > 0) {
            setOnrampDisburse(response.data);
        }
    }

    async function getPancakeswaps() {
        const response = await getPancakeswapSwap(transactionId);
        if(response.error) {
            return ;
        }
        if(response.data.length > 0) {
            setPancakeswapSwap(response.data);
        }
    }

    useEffect(() => {
        if(address) {
            getActivity();
            getOnramp();
            getPancakeswaps();
        }
    }, [address])

    useEffect(()=>{
        if(activity != null) {
            const _swaps = JSON.parse(activity.swaps);
            setSwaps(_swaps);
        }
    }, [activity])

    function getGasFee() {
        if(!activity) return 0;
        if(pancakeswapSwap.length == 0 && onrampDisburse.length == 0) {
            return parseFloat(activity.gas_fee_amount)
        } else {
            return parseFloat(activity.value_fiat_amount) - parseFloat(activity.platform_fee_amount) - getValueToBeOnramp()
        }
    }

    function getValueToBeOnramp() {
        if(!activity) return 0
        if(pancakeswapSwap.length == 0 && onrampDisburse.length == 0) {
            const _amountTotal = parseFloat(activity.amount);
            const _platformFee = parseFloat(activity.platform_fee_amount);
            const _gasFee = parseFloat(activity.gas_fee_amount);
            return _amountTotal - _platformFee - _gasFee;
        }
        
        let amount = 0;

        for(let i=0; i<swaps.length; i++) {
            amount += getOnrampAmountIn(swaps[i].to);
        }

        return amount;
    }

    function getOnrampAmountIn(tokenName) {
        if(pancakeswapSwap.length == 0 && onrampDisburse.length == 0) {
            for (let i=0; i<swaps.length; i++) {
                if(swaps[i].to == tokenName) {
                    const amount = parseFloat(swaps[i].amount);
                    return amount;
                }
            }
            return 0;
        }
        else {
            if(tokenName == "IDRT") return getOnrampAmountOut("IDRT");
            for (let i=0; i<pancakeswapSwap.length; i++) {
                if(pancakeswapSwap[i].swap_to == tokenName) {
                    const amount = parseFloat(pancakeswapSwap[i].amount_in);
                    return amount;
                }
            }
            return 0;
        }
    }

    function getOnrampAmountOut(tokenName) {
        if(onrampDisburse.length == 0) return 0;

        for (let i=0; i<onrampDisburse.length; i++) {
            if(onrampDisburse[i].token_name == tokenName) {
                const amount = parseFloat(onrampDisburse[i].amount);
                return amount;
            }
        }
        return 0;
    }

    function getStatusColor(status) {
        if(status == "COMPLETED") return "text-green-500"
        if(status == "FAILED") return "text-red-500"
        return "text-yellow-400"
    }

    function getStatus(status) {
        if(status == "PENDING") return "PAYMENT"
        if(status == "ACTIVE") return "PAYMENT"
        if(status == "PAYMENT_PAID") return "ON RAMPING"
        if(status == "DISBURSEMENT_IDRT_PENDING") return "ON RAMPING"
        if(status == "DISBURSEMENT_IDRT_RECEIVED") return "ON RAMPING"
        if(status == "DISBURSEMENT_IDRT_FAILED") return "FAILED"
        if(status == "ONRAMP_IDRT_PENDING") return "ON RAMPING"
        if(status == "ONRAMP_IDRT_SUCCESS") return "ON RAMPING"
        if(status == "ONRAMP_IDRT_FAILED") return "FAILED"
        if(status == "TRANSFER_1_SUCCESS") return "ON RAMPING"
        if(status == "TRANSFER_2_SUCCESS") return "ON RAMPING"
        if(status == "TRANSFER_3_SUCCESS") return "ON RAMPING"
        if(status == "SWAP_1_SUCCESS") return "ON RAMPING"
        if(status == "SWAP_2_SUCCESS") return "ON RAMPING"
        if(status == "SWAP_3_SUCCESS") return "ON RAMPING"
        if(status == "COMPLETED") return "COMPLETED"
        return "Call for admin"
    }

    return (
        <div className="w-full">
            <div className="hover:cursor-pointer w-fit"
                onClick={props.back}
            >
                <BiArrowBack/>
            </div>

            <div className="w-full mt-4">
                {
                    isLoadingActivityDetail
                    ? <div className="h-96 w-full flex items-center justify-center">
                        <Spinner/>
                    </div>
                    :   activity &&
                        <div className="space-y-4">
                            <div className="px-4 py-3 bg-gray-100 rounded-lg">
                                <div className="flex justify-between items-end">
                                    <p className="text-lg font-bold">Buy</p>
                                    <p className={`text-sm font-bold ${getStatusColor(activity.status)}`}>{getStatus(activity.status)}</p>
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-2">{formatDate(new Date(activity.created_at))}</p>

                                <p className="text-xs text-gray-500 mt-2 text-ellipsis overflow-hidden">ID: {activity.external_id}</p>
                            </div>

                            <div className="px-4 py-4 bg-gray-100 rounded-lg">
                                <div className="flex gap-4 items-end justify-between">
                                    <p className="flex-1 text-sm">Payment</p>
                                    <p className="flex-1 text-sm text-end">IDR {numberWithCommas(parseFloat(activity.value_fiat_amount))}</p>
                                </div>

                                <div className="flex gap-4 justify-between mt-1">
                                    <p className="flex-1 text-xs text-red-400">Platform Fee</p>
                                    <p className="flex-1 text-xs text-red-400 text-end">- IDR {numberWithCommas(parseFloat(activity.platform_fee_amount))}</p>
                                </div>

                                <div className="flex gap-4 justify-between mt-1">
                                    <p className="flex-1 text-xs text-red-400">{ (pancakeswapSwap.length == 0 && onrampDisburse == 0) ? "Gas Fee Estimation" : "Gas Fee"}</p>
                                    <p className="flex-1 text-end text-xs text-red-400">- IDR {numberWithCommas(getGasFee())}</p>
                                </div>

                                <div className="flex gap-4 justify-between mt-2">
                                    <p className="flex-1 text-sm font-semibold text-green-400">Value to be onramp</p>
                                    <p className="flex-1  text-end text-sm font-semibold text-green-400">IDR {numberWithCommas(getValueToBeOnramp())}</p>
                                </div>

                                <div className="border-t border-gray-300 my-4"/>

                                {
                                    swaps.map((swap, index) => {
                                        return (
                                            <div key={`detail-${index}`} className="my-2">
                                                <div className="flex justify-between gap-2 items-stretch">
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-xs">From</p>
                                                        <p className="text-sm font-semibold">IDR {numberWithCommas(getOnrampAmountIn(swap.to), 2)}</p>
                                                    </div>
                                                    <div className="flex-none flex items-center">
                                                        <FaArrowCircleRight/>
                                                    </div>
                                                    <div className="flex-1 space-y-1 text-end">
                                                        <p className="text-xs">to</p>
                                                        <p className="text-sm font-semibold">{numberWithCommas(getOnrampAmountOut(swap.to), (swap.to == "IDRT") ? 2 : 4)} {swap.to}</p>
                                                    </div>
                                                </div>
                                                {
                                                    onrampDisburse[index] &&
                                                    <div className="flex items-center ml-auto gap-1 text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
                                                        onClick={()=>{window.open("https://bscscan.com/tx/" + onrampDisburse[index]?.tx_hash, '_blank');}}
                                                    >
                                                        <div className="overflow-hidden mt-1">
                                                            <p className="text-xs">{shortenAddress(onrampDisburse[index]?.tx_hash, 6)}</p>
                                                        </div>
                                                        
                                                        <MdOpenInNew size={12} className=""/>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                }
            </div>

        </div>
    )
  }
