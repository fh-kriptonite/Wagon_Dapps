import { useEffect, useState } from "react";
import { services } from "../../services/service_lending";
import { MdOpenInNew } from "react-icons/md";
import { numberWithCommas, shortenAddress } from "../../util/stringUtility";
import { Table } from "flowbite-react";

interface Activity {
  block: string;
  address: string;
  event: string;
  amount: string;
  transaction_hash: string;
  [key: string]: any;
}

interface PoolActivityCardProps {
  poolId: string;
  decimal: number;
}

export default function PoolActivityCard({ poolId, decimal }: PoolActivityCardProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getPoolActivities() {
    try {
      const data = await services.getPoolActivities(poolId, "BNB");
      setActivities(data as Activity[]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (poolId !== undefined) getPoolActivities();
  }, [poolId]);
  
  return (
    <div className='space-y-6'>
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
              {activities.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center text-xs">
                    No activities found
                  </Table.Cell>
                </Table.Row>
              ) : (
                activities.map((activity, index) => (
                  <Table.Row className="text-sm" key={`activity_-${index}`}>
                    <Table.Cell className='!py-2'>{activity.block}</Table.Cell>
                    <Table.Cell className='!py-2'>{shortenAddress(activity.address)}</Table.Cell>
                    <Table.Cell className='!py-2 text-right'>{activity.event}</Table.Cell>
                    <Table.Cell className='!py-2 text-right'>{numberWithCommas(Number(activity.amount) / Math.pow(10, decimal), 2)}</Table.Cell>
                    <Table.Cell className='!py-2 text-right'>
                      <a 
                        href={`https://bscscan.com/tx/${activity.transaction_hash}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdOpenInNew size={16} className="text-blue-500 hover:text-blue-800"/>
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
} 