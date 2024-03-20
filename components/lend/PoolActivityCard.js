import { useEffect, useState } from "react";
import { getPoolActivitiesService } from "../../services/service_lending";
import { MdOpenInNew } from "react-icons/md";
import { numberWithCommas, shortenAddress } from "../../util/stringUtility";

export default function PoolActivityCard(props) {
    const poolId = props.poolId;
    const decimal = props.decimal;

    const [activities, setActivities] = useState([])

    async function getPoolActivities() {
        try {
          const data = await getPoolActivitiesService(poolId, process.env.BNB_CHAIN_NAME)
          setActivities(data.data)
        } catch (error) {
          console.log(error)
        }
    }

    useEffect(()=>{
        if(poolId != undefined) getPoolActivities()
    }, [poolId])
    
  
    return (
        <div className='card space-y-6'>
            <div className="flex justify-between">
                <h6 className="!font-semibold">Recent activity</h6>
                <div className="flex items-center gap-1 text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
                    onClick={()=>{window.open(process.env.BNB_EXPLORER + "address/" + process.env.LENDING_ADDRESS_BNB, '_blank');}}
                >
                    <p className="text-sm">{shortenAddress(process.env.LENDING_ADDRESS_BNB)}</p>
                    <MdOpenInNew size={16} className=""/>
                </div>
            </div>
            <div className='space-y-1'>
                <div className='flex bg-blue-100 justify-between px-4 py-2 gap-4 w-full'>
                    <p className='text-xs font-bold w-16 overflow-hidden text-ellipsis'>Block</p>
                    <p className='text-xs font-bold flex-1 text-start overflow-hidden text-ellipsis'>Address</p>
                    <p className='text-xs font-bold w-16 text-start'>Event</p>
                    <p className='text-xs font-bold flex-1 text-end'>Amount</p>
                    <p className='text-xs font-bold text-start w-4 overflow-hidden text-ellipsis'>Tx</p>
                </div>
                {
                    activities.length == 0 &&
                    <p className='text-xs text-center !mt-2'>No activities found</p>
                }
                {
                    activities.map((activity, index) => {
                        return (
                            <div className='flex bg-blue-100 justify-between px-4 py-2 gap-4 w-full' key={`activity_${index}`}>
                                <p className='text-xs font-light w-16 overflow-hidden text-ellipsis'>{activity.block}</p>
                                <p className='text-xs font-light flex-1 text-start overflow-hidden text-ellipsis'>{shortenAddress(activity.address)}</p>
                                <p className='text-xs font-light w-16 text-start'>{activity.event}</p>
                                <p className='text-xs font-light flex-1 text-end'>{numberWithCommas(activity.amount / Math.pow(10, decimal))}</p>
                                <a href={process.env.BNB_EXPLORER + "tx/" + activity.transaction_hash} 
                                    target={"blank"}
                                >
                                    <MdOpenInNew size={16} className="text-blue-500 hover:text-blue-800"/>
                                </a>
                            </div>
                        )
                    })
                }
            </div>
        </div>
  );
};