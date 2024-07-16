import { useAccount } from "@particle-network/connectkit";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { BiArrowBack } from "react-icons/bi";
import useGetActivityDetailHook from "./util/useGetActivityDetailHook";
import { formatDate, numberWithCommas } from "../../util/stringUtility";
import { FaArrowCircleRight } from "react-icons/fa"

export default function ActivityDetailCard(props) {
    const address = useAccount();
    const transactionId = props.transactionId;
    
    const [activity, setActivity] = useState(null);
    const [swaps, setSwaps] = useState([]);

    const { isLoading: isLoadingActivityDetail, fetchData: getActivityDetail } = useGetActivityDetailHook();

    async function getActivity() {
        const activity = await getActivityDetail(transactionId);
        
        if(activity.error) {
            return ;
        }

        console.log(activity.data[0])
        setActivity(activity.data[0]);
    }

    useEffect(() => {
        if(address) {
            getActivity();
        }
    }, [address])

    useEffect(()=>{
        if(activity != null) {
            setSwaps(JSON.parse(activity.swaps));
        }
    }, [activity])

    function getStatusColor(status) {
        if(status == "COMPLETED") return "text-green-500"
        if(status == "FAILED") return "text-red-500"
        return "text-yellow-400"
    }

    return (
        <div className="w-full">
            <div className="hover:cursor-pointer w-fit"
                onClick={props.back}
            >
                <BiArrowBack/>
            </div>

            <div className="w-full mt-4 h-96 overflow-auto">
                {
                    isLoadingActivityDetail
                    ? <div className="h-full w-full flex items-center justify-center">
                        <Spinner/>
                    </div>
                    :   activity &&
                        <div>
                            <div className="px-3 py-4 bg-gray-100 rounded-lg">
                                <div className="flex justify-between items-end">
                                    <p className="text-lg font-bold">Buy</p>
                                    <p className={`text-sm font-bold ${getStatusColor(activity.status)}`}>{activity.status}</p>
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-1">{formatDate(new Date(activity.created_at))}</p>

                                <div className="flex gap-4 mt-4">
                                    <p className="text-lg font-bold text-green-400">IDR {numberWithCommas(parseFloat(activity.value_fiat_amount))}</p>
                                </div>

                                <p className="text-xs text-gray-500 mt-2">ID: {activity.external_id}</p>

                                <div className="border-t border-gray-300 my-4"/>

                                {
                                    swaps.map((swap, index) => {
                                        return (
                                            <div className="flex justify-between my-2 items-center">
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-xs">From</p>
                                                    <p className="text-sm font-semibold">IDR {numberWithCommas(parseFloat(swap.amount))}</p>
                                                </div>
                                                <FaArrowCircleRight/>
                                                <div className="flex-1 space-y-1 text-end">
                                                    <p className="text-xs">to</p>
                                                    <p className="text-sm font-semibold">{swap.to}</p>
                                                </div>
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
