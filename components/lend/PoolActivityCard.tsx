import { useEffect, useState } from "react";
import { services } from "../../services/service_lending";
import { MdOpenInNew } from "react-icons/md";
import { numberWithCommas, shortenAddress } from "../../util/stringUtility";
import { Table, Spinner } from "flowbite-react";
import { Pool } from "./types";
import { base, bsc } from "@particle-network/connectkit/chains";
interface Activity {
  block: string;
  address: string;
  event: string;
  amount: string;
  transaction_hash: string;
  [key: string]: any;
}

interface PoolActivityCardProps {
  pool: Pool;
}

export default function PoolActivityCard({ pool }: PoolActivityCardProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getPoolActivities() {
    try {
      setIsLoading(true);
      const data = await services.getPoolActivities(pool.id);
      setActivities(data as Activity[]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (pool) {
      getPoolActivities();
    }
  }, [pool]);

  function getScanExplorer(): string {
    if(pool.lending_contract.network_id == Number(process.env.BNB_CHAIN_ID)) {
      return process.env.BNB_EXPLORER || '';
    } else if(pool.lending_contract.network_id == Number(process.env.BASE_CHAIN_ID)) {
      return process.env.BASE_EXPLORER || '';
    }
    return '';
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head className="bg-gray-50">
              <Table.HeadCell className="text-sm font-medium text-gray-600">Block</Table.HeadCell>
              <Table.HeadCell className="text-sm font-medium text-gray-600">Address</Table.HeadCell>
              <Table.HeadCell className="text-sm font-medium text-gray-600 text-right">Event</Table.HeadCell>
              <Table.HeadCell className="text-sm font-medium text-gray-600 text-right">Amount</Table.HeadCell>
              <Table.HeadCell className="text-sm font-medium text-gray-600">Transaction</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-8">
                    <Spinner />
                  </Table.Cell>
                </Table.Row>
              ) :
                activities.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-8">
                    <p className="text-sm text-gray-500">No activities found</p>
                  </Table.Cell>
                </Table.Row>
              ) : (
                activities.map((activity, index) => (
                  <Table.Row 
                    key={`activity_-${index}`}
                    className="bg-white hover:bg-gray-50"
                  >
                    <Table.Cell className="text-sm text-gray-900 py-4">
                      {activity.block}
                    </Table.Cell>
                    <Table.Cell className="text-sm text-gray-900 py-4">
                      {shortenAddress(activity.address)}
                    </Table.Cell>
                    <Table.Cell className="text-sm text-gray-900 py-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.event === "Lend" 
                          ? "bg-blue-100 text-blue-800" 
                          : activity.event === "Claim" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                      }`}>
                        {activity.event}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-sm text-gray-900 py-4 text-right">
                      {numberWithCommas(Number(activity.amount) / Math.pow(10, pool.lending_contract.decimals), 2)}
                    </Table.Cell>
                    <Table.Cell className="text-sm py-4">
                      <a 
                        href={`${getScanExplorer()}tx/${activity.transaction_hash}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <span className="text-sm">View</span>
                        <MdOpenInNew className="w-4 h-4" />
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