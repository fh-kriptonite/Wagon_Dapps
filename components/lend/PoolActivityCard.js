import { useEffect, useState } from "react";
import { getPoolActivitiesService } from "../../services/service_lending";
import { MdOpenInNew } from "react-icons/md";
import { numberWithCommas, shortenAddress } from "../../util/stringUtility";
import { Table } from "flowbite-react";

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
        <div className='space-y-6'>
            {/* <div className="flex justify-between">
                <h6 className="!font-semibold">Recent activity</h6>
                <div className="flex items-center gap-1 text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
                    onClick={()=>{window.open(process.env.BNB_EXPLORER + "address/" + process.env.LENDING_ADDRESS_BNB, '_blank');}}
                >
                    <p className="text-sm">{shortenAddress(process.env.LENDING_ADDRESS_BNB)}</p>
                    <MdOpenInNew size={16} className=""/>
                </div>
            </div> */}
            <div className='space-y-1'>
                <div className="overflow-x-auto">
                    <Table>
                        <Table.Head className="">
                            <Table.HeadCell>Block</Table.HeadCell>
                            <Table.HeadCell className='text-start'>Address</Table.HeadCell>
                            <Table.HeadCell className='text-right'>Event</Table.HeadCell>
                            <Table.HeadCell className='text-right'>Amount</Table.HeadCell>
                            <Table.HeadCell className='text-start'>Tx</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {
                                activities.length == 0 &&
                                <p className='text-xs text-center !mt-2'>No activities found</p>
                            }
                            {
                                activities.map((activity, index) => {
                                    return (
                                        <Table.Row className="text-sm" key={`activity_-${index}`}>
                                            <Table.Cell className='!py-2'>{activity.block}</Table.Cell>
                                            <Table.Cell className='!py-2'>{shortenAddress(activity.address)}</Table.Cell>
                                            <Table.Cell className='!py-2 text-right'>{activity.event}</Table.Cell>
                                            <Table.Cell className='!py-2 text-right'>{numberWithCommas(activity.amount / Math.pow(10, decimal))}</Table.Cell>
                                            <Table.Cell className='!py-2 text-right'>
                                                <a href={process.env.BNB_EXPLORER + "tx/" + activity.transaction_hash} 
                                                    target={"blank"}
                                                >
                                                    <MdOpenInNew size={16} className="text-blue-500 hover:text-blue-800"/>
                                                </a>
                                            </Table.Cell>

                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
  );
};