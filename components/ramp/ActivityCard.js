import { useAccount } from "@particle-network/connectkit";
import { useEffect, useState } from "react";
import useGetActivitiesHook from "./util/useGetActivitiesHook";
import { Spinner } from "flowbite-react";
import { IoMdDownload } from "react-icons/io";
import { formatDate, numberWithCommas } from "../../util/stringUtility";

export default function ActivityCard(props) {
    const address = useAccount();
    
    const showDetail = props.showDetail;

    const [activities, setActivities] = useState([]);

    const { isLoading: isLoadingActivities, fetchData: getActivities } = useGetActivitiesHook();

    async function getActivity() {
        const activities = await getActivities(address);
        console.log(activities)
        setActivities(activities.data);
    }

    useEffect(() => {
        if(address) {
            getActivity();
        }
    }, [address])

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
        if(status == "DISBURSEMENT_IDRT_RECEIVED_2") return "ON RAMPING"
        if(status == "DISBURSEMENT_IDRT_FAILED") return "FAILED"
        if(status == "ONRAMP_IDRT_PENDING") return "ON RAMPING"
        if(status == "ONRAMP_IDRT_SUCCESS") return "ON RAMPING"
        if(status == "ONRAMP_IDRT_FAILED") return "FAILED"
        if(status == "TRANSFER_0_SUCCESS") return "ON RAMPING"
        if(status == "TRANSFER_1_SUCCESS") return "ON RAMPING"
        if(status == "TRANSFER_2_SUCCESS") return "ON RAMPING"
        if(status == "SWAP_0_SUCCESS") return "ON RAMPING"
        if(status == "SWAP_1_SUCCESS") return "ON RAMPING"
        if(status == "SWAP_2_SUCCESS") return "ON RAMPING"
        if(status == "COMPLETED") return "COMPLETED"
        return "Call for admin"
    }

    return (
        <div className="w-full">
            <div className="w-full mt-4 h-96 overflow-auto">
                {
                    isLoadingActivities
                    ? <div className="h-full w-full flex items-center justify-center">
                        <Spinner/>
                    </div>
                    : <div className="space-y-2 h-full">
                        {
                            !activities
                            ? <div className="w-full h-full flex items-center justify-center pb-12">
                                <p className="text-sm font-bold">No activity found</p>
                            </div>
                            : activities.map((activity, index) => {
                                return (
                                    <div key={`activity-${index}`} className="bg-gray-100 px-3 py-4 rounded-lg flex gap-8 items-center hover:cursor-pointer hover:bg-gray-200"
                                        onClick={()=>{
                                            showDetail(activity.external_id);
                                        }}
                                    >
                                        <div className="flex-initial flex-1 flex gap-4 items-center">
                                            <div className="flex-initial w-10">
                                                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
                                                    <IoMdDownload className="text-blue-700"/>
                                                </div>
                                            </div>

                                            <div className="space-y-1 grow">
                                                <p className="text-xs font-bold">
                                                    Buy
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    { formatDate(new Date(activity.created_at)) }
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex-1 space-y-1 flex flex-col items-end">
                                            <p className="text-xs">
                                                { numberWithCommas(parseFloat(activity.amount), 2) } IDR
                                            </p>
                                            <p className={`text-xs font-bold ${getStatusColor(activity.status)}`}>
                                                { getStatus(activity.status) }
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>

        </div>
    )
  }
