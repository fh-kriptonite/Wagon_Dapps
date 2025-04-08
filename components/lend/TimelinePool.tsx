import { Button, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import useSwitchNetworkHook from './utils/useSwitchNetworkHook';
import ButtonConnect from '../general/ButtonConnect';
import { formatDate, numberWithCommas } from '../../util/stringUtility';
import useGetInterestAmountSharedHook from './utils/useGetInterestAmountSharedHook';
import { useRouter } from 'next/router';
import useGetLatestInterestClaimedHook from './utils/useGetLatestInterestClaimedHook';
import ConfirmationClaimInterestDialog from './dialog/ConfirmationClaimInterestDialog'
import { useAccount } from '@particle-network/connectkit';
import useChainHook from '../../util/useChainHook';
import useGetDeploymentGracePeriodHook from './utils/useGetDeploymentGracePeriodHook';

interface Pool {
  paymentFrequency: string;
  termStart: string;
  loanTerm: string;
  latestRepayment: string;
}

interface TimelinePoolProps {
  pool: Pool | null;
  symbol: string;
  decimal: number;
  stableBalance: string;
  wagBalance: string;
  [key: string]: any; // For any additional props passed to ConfirmationClaimInterestDialog
}

export default function TimelinePool(props: TimelinePoolProps) {
  const address = useAccount();
  const { fetchData: getChainId } = useChainHook();

  const {fetchData: switchNetwork} = useSwitchNetworkHook();

  const router = useRouter();
  const { poolId } = router.query;

  const pool = props.pool;
  const symbol = props.symbol;
  const decimal = props.decimal;
  const stableBalance = props.stableBalance;
  const wagBalance = props.wagBalance;
  
  const [repayments, setRepayments] = useState<null[]>([]);
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);

  const {data: interestAmountShare, fetchData: getInterestAmountShare} = useGetInterestAmountSharedHook();
  const {data: latestInterestClaimed, fetchData: getLatestInterestClaimed} = useGetLatestInterestClaimedHook();
  const {data: deploymentGracePeriod, fetchData: getDeploymentGracePeriod} = useGetDeploymentGracePeriodHook();

  useEffect(() => {
    if (poolId && typeof poolId === 'string') {
      getInterestAmountShare(address, poolId);
      getLatestInterestClaimed(address, poolId);
      getDeploymentGracePeriod(poolId);
    }
  }, []);

  useEffect(() => {
    if (poolId && typeof poolId === 'string') {
      getInterestAmountShare(address, poolId);
      getLatestInterestClaimed(address, poolId);
      getDeploymentGracePeriod(poolId);
    }
  }, [address]);

  useEffect(()=>{
    if(pool != null) {
      setRepayments(new Array(parseFloat(pool.paymentFrequency)).fill(null));
    }
  },[pool]);

  function isInterestClaimable(index: number): string {
    if(pool == null) return "~";

    if(index < Number(latestInterestClaimed)) return "Claimed";
    if(index < Number(pool.latestRepayment)) return "Claimable";
    return "Unclaimable";
  }

  function handleClaim(): void {
    setIsOpenConfirmationDialog(true);
  }

  async function handleClaimButton(): Promise<void> {
    // switch network
    const chainId = (await getChainId()).data;
    const bnbChainId = process.env.BNB_CHAIN_ID;
    if(chainId && bnbChainId && chainId.toString() !== bnbChainId.toString()) {
      try {
        const resultSwitchNetwork = await switchNetwork(bnbChainId);
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
    if(Number(latestInterestClaimed) < Number(pool.latestRepayment)) return false;
    return true;
  }

  return (
    <div>
      {
        !address
        ? <ButtonConnect/>
        : <Button color={"dark"} size={"sm"} style={{marginLeft:"auto"}}
            disabled={isUnclaimable()}
            onClick={handleClaimButton}
          >
            Claim All
          </Button>
      }

      <div className="mt-2 space-y-1">
        <div className="overflow-x-auto">
          <Table>
            <Table.Head className="">
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell>Repayment Deadline</Table.HeadCell>
              <Table.HeadCell className='text-right'>Amount</Table.HeadCell>
              <Table.HeadCell className='text-right'>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {
                repayments.map((repayment, index) => {
                  const loanStart = (parseFloat(pool?.termStart || "0") + parseFloat(deploymentGracePeriod || "0")) * 1000;
                  const durationBetweenPayment = parseFloat(pool?.loanTerm || "0") / parseFloat(pool?.paymentFrequency || "1") * 1000;
                  const paymentTime = loanStart + (durationBetweenPayment * (index + 1));
                  return (     
                    <Table.Row className="text-sm" key={`repayment-${index}`}>
                      <Table.Cell className='!py-2'>{index+1}</Table.Cell>
                      <Table.Cell className='!py-2'>{formatDate(new Date(paymentTime))}</Table.Cell>
                      <Table.Cell className='!py-2 text-right'>
                        {
                          (index+1 == Number(pool?.paymentFrequency)) 
                            ? numberWithCommas((parseFloat(stableBalance) / Math.pow(10,decimal)) + (parseFloat(interestAmountShare || "0") / Math.pow(10,decimal)), 2) 
                            : numberWithCommas(parseFloat(interestAmountShare || "0") / Math.pow(10,decimal), 2)
                        } {symbol}
                      </Table.Cell>
                      <Table.Cell className='!py-2 text-right'>{isInterestClaimable(index)}</Table.Cell>
                    </Table.Row>
                  );
                })
              }
            </Table.Body>
          </Table>
        </div>
      </div>

      <ConfirmationClaimInterestDialog
        {...props}
        isOpen={isOpenConfirmationDialog} 
        close={()=>{setIsOpenConfirmationDialog(false)}}
        repayments={repayments}
        interestAmountShare={interestAmountShare}
        latestInterestClaimed={latestInterestClaimed}
        refreshLatestInterestClaimed={()=>{
          if (poolId && typeof poolId === 'string') {
            getLatestInterestClaimed(address, poolId);
          }
        }}
        stableBalance={stableBalance}
        wagBalance={wagBalance}
      />
      
    </div>
  );
} 