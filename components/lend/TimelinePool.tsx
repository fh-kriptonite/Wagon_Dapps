import { Button, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import useSwitchNetworkHook from './utils/useSwitchNetworkHook';
import ButtonConnect from '../general/ButtonConnect';
import { formatDate, numberWithCommas } from '../../util/stringUtility';
import useGetInterestAmountSharedHook from './utils/useGetInterestAmountSharedHook';
import { useRouter } from 'next/router';
import useGetLatestInterestClaimedHook from './utils/useGetLatestInterestClaimedHook';
import ConfirmationClaimInterestDialog from './dialog/ConfirmationClaimInterestDialog'
import useChainHook from '../../util/useChainHook';
import useGetDeploymentGracePeriodHook from './utils/useGetDeploymentGracePeriodHook';
import { PoolFee, Pool } from './types';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';

interface Repayment {
  id: number;
  status: string;
}

interface TimelinePoolProps {
  pool: Pool;
  symbol: string;
  decimal: number;
  stableBalance: string;
  wagBalance: string;
  fees: PoolFee;
  refresh: () => void;
  [key: string]: any;
}

export default function TimelinePool(props: TimelinePoolProps) {
  const { connectedAddress: address } = useConnectedAddress();
  const { fetchData: getChainId } = useChainHook();

  const {fetchData: switchNetwork} = useSwitchNetworkHook();

  const router = useRouter();
  const { poolId } = router.query;

  const pool = props.pool;
  const symbol = props.symbol;
  const decimal = props.decimal;
  const stableBalance = props.stableBalance;
  const wagBalance = props.wagBalance;
  const fees = props.fees;
  const refresh = props.refresh;

  console.log("stableBalance: ", stableBalance);
  console.log('decimal: ', decimal);
  
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);

  const {data: interestAmountShare, fetchData: getInterestAmountShare} = useGetInterestAmountSharedHook();
  const {data: latestInterestClaimed, fetchData: getLatestInterestClaimed} = useGetLatestInterestClaimedHook();
  const {data: deploymentGracePeriod, fetchData: getDeploymentGracePeriod} = useGetDeploymentGracePeriodHook();

  useEffect(() => {
    if (poolId && typeof poolId === 'string' && address) {
      getInterestAmountShare(address, poolId, pool.contract.network_id);
      getLatestInterestClaimed(address, poolId, pool.contract.network_id);
      getDeploymentGracePeriod(poolId, pool.contract.network_id);
    }
  }, []);

  useEffect(() => {
    if (poolId && typeof poolId === 'string' && address) {
      getInterestAmountShare(address, poolId, pool.contract.network_id);
      getLatestInterestClaimed(address, poolId, pool.contract.network_id);
      getDeploymentGracePeriod(poolId, pool.contract.network_id);
    }
  }, [address]);

  useEffect(()=>{
    if(pool != null) {
      setRepayments(new Array(pool.payment_frequency).fill(null).map((_, index) => ({
        id: index,
        status: "pending"
      })));
    }
  },[pool]);

  function isInterestClaimable(index: number): string {
    if(pool == null) return "~";

    if(index < Number(latestInterestClaimed?.toString() || "0")) return "Claimed";
    if(index < Number(pool.latest_repayment)) return "Claimable";
    return "Unclaimable";
  }

  function handleClaim(): void {
    setIsOpenConfirmationDialog(true);
  }

  async function handleClaimButton(): Promise<void> {
    // switch network
    const chainId = (await getChainId()).data;
    const poolNetworkId = pool.contract.network_id;
    if(chainId && poolNetworkId && chainId !== poolNetworkId) {
      try {
        const resultSwitchNetwork = await switchNetwork(poolNetworkId);
        if (resultSwitchNetwork.error) {
          throw resultSwitchNetwork.error;
        }
        handleClaim();
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      handleClaim();
    }
  }

  function isUnclaimable(): boolean {
    if(pool == null) return true;
    if(parseFloat(stableBalance) == 0) return true;
    if(Number(latestInterestClaimed?.toString() || "0") < Number(pool.latest_repayment)) return false;
    return true;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {
          !address
          ? <ButtonConnect/>
          : <Button 
              color="dark"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isUnclaimable()}
              onClick={handleClaimButton}
            >
              Claim All
            </Button>
        }
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head className="bg-gray-50">
              <Table.HeadCell className="text-sm font-medium text-gray-600">Term</Table.HeadCell>
              <Table.HeadCell className="text-sm font-medium text-gray-600">Repayment Deadline</Table.HeadCell>
              <Table.HeadCell className="text-sm font-medium text-gray-600 text-right">Amount</Table.HeadCell>
              <Table.HeadCell className="text-sm font-medium text-gray-600 text-right">Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {
                repayments.map((repayment, index) => {
                  const termStart = new Date(pool.term_start);
                  const loanStart = (termStart.getTime() + Number(deploymentGracePeriod || 0));
                  const durationBetweenPayment = (pool.loan_term || 0) / (pool.payment_frequency || 1);
                  const paymentTime = loanStart + (durationBetweenPayment * (index + 1));
                  const status = isInterestClaimable(index);
                  
                  return (     
                    <Table.Row 
                      key={`repayment-${index}`}
                      className="bg-white hover:bg-gray-50"
                    >
                      <Table.Cell className="text-sm text-gray-900 py-4">{index+1}</Table.Cell>
                      <Table.Cell className="text-sm text-gray-900 py-4">{formatDate(new Date(paymentTime))}</Table.Cell>
                      <Table.Cell className="text-sm text-gray-900 py-4 text-right">
                        {
                          (index+1 == Number(pool?.payment_frequency)) 
                            ? numberWithCommas((parseFloat(stableBalance) / Math.pow(10,decimal)) + (Number(interestAmountShare?.toString() || "0") / Math.pow(10,decimal)), 2) 
                            : numberWithCommas(Number(interestAmountShare?.toString() || "0") / Math.pow(10,decimal), 2)
                        } {symbol}
                      </Table.Cell>
                      <Table.Cell className="text-sm py-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === "Claimed" 
                            ? "bg-green-100 text-green-800" 
                            : status === "Claimable" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-gray-100 text-gray-800"
                        }`}>
                          {status}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              }
            </Table.Body>
          </Table>
        </div>
      </div>

      {pool && (
        <ConfirmationClaimInterestDialog
          {...props}
          isOpen={isOpenConfirmationDialog} 
          close={()=>{setIsOpenConfirmationDialog(false)}}
          repayments={repayments}
          interestAmountShare={interestAmountShare?.toString() || "0"}
          latestInterestClaimed={latestInterestClaimed?.toString() || "0"}
          refreshLatestInterestClaimed={()=>{
            if (poolId && typeof poolId === 'string' && address) {
              getLatestInterestClaimed(address, poolId, pool.contract.network_id);
            }
          }}
          stableBalance={stableBalance}
          wagBalance={wagBalance}
          fees={fees}
          refresh={refresh}
          pool={pool}
        />
      )}
    </div>
  );
} 