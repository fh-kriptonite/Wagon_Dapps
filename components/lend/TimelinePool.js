import { Button, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import ButtonConnect from '../general/ButtonConnect';
import { formatDate, numberWithCommas } from '../../util/stringUtility';
import useGetInterestAmountSharedHook from './utils/useGetInterestAmountSharedHook';
import { useRouter } from 'next/router';
import useGetLatestInterestClaimedHook from './utils/useGetLatestInterestClaimedHook';
import ConfirmationClaimInterestDialog from './dialog/ConfirmationClaimInterestDialog'
import { checkConnected } from '../../util/web3Utility';
import { useWeb3WalletState } from '../general/web3WalletContext';
import useSwitchNetworkHook from '../../util/useSwitchNetworkHook';

export default function TimelinePool(props) {
  const { isConnected, chainId, address } = useWeb3WalletState();

  const { isLoading: isLoadingSwitchNetwork, switchChain } = useSwitchNetworkHook();

  const router = useRouter();
  const { poolId } = router.query;

  const pool = props.pool;
  const symbol = props.symbol;
  const stableBalance = props.stableBalance;
  const decimal = props.decimal;
  
  const [repayments, setRepayments] = useState([]);
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);

  const {data: interestAmountShare, fetchData: getInterestAmountShare}  = useGetInterestAmountSharedHook();
  const {data: latestInterestClaimed, fetchData: getLatestInterestClaimed}  = useGetLatestInterestClaimedHook();

  useEffect(() => {
    getInterestAmountShare(address, poolId)
    getLatestInterestClaimed(address, poolId)
  }, [])

  useEffect(() => {
    getInterestAmountShare(address, poolId)
    getLatestInterestClaimed(address, poolId)
  }, [address])

  useEffect(()=>{
    if(pool != null) {
        setRepayments(new Array(parseFloat(pool.paymentFrequency)).fill(null))
    }
  },[pool])

  function isInterestClaimable(index) {
    if(pool == null) return "~"

    if(index < latestInterestClaimed) return "Claimed"
    if(index < pool.latestRepayment) return "Claimable"
    return "Unclaimable"
  }

  function handleClaim() {
    setIsOpenConfirmationDialog(true)
  }

  async function handleClaimButton() {
    try {
      const resultSwitchNetwork = await switchChain(chainId, process.env.BNB_CHAIN_ID);
      if (resultSwitchNetwork.error) {
          throw resultSwitchNetwork.error
      }
    } catch (error) {
      console.log(error)
      return
    }
    handleClaim()
  }

  function isUnclaimable() {
    if(isLoadingSwitchNetwork) return true
    if(pool == null) return true
    if(parseFloat(stableBalance) == 0) return true
    if(parseFloat(latestInterestClaimed) < parseFloat(pool.latestRepayment)) return false
    return true
  }

  function handleClaimButtonString() {
    if(isLoadingSwitchNetwork) return "Loading..."
    return "Claim All"  
  }

  return (
    <div>
      {
        !isConnected
        ? <div className='w-full flex justify-end'>
            <ButtonConnect/>
        </div>
        : <Button color={"dark"} size={"sm"} style={{marginLeft:"auto"}}
            disabled={isUnclaimable()}
            onClick={handleClaimButton}
          >
            { handleClaimButtonString() }
          </Button>
      }

      <div className="mt-2 space-y-1">
        <div className="overflow-x-auto">
          <Table>
            <Table.Head className="!bg-blue-100">
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell>Repayment Deadline</Table.HeadCell>
              <Table.HeadCell className='text-right'>Amount</Table.HeadCell>
              <Table.HeadCell className='text-right'>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {
                repayments.map((repayment, index) => {
                    const loanStart = parseFloat(pool.termStart) * 1000;
                    const durationBetweenPayment = parseFloat(pool.loanTerm) / parseFloat(pool.paymentFrequency) * 1000;
                    const paymentTime = loanStart + (durationBetweenPayment * (index + 1));
                    return (     
                      <Table.Row className="bg-blue-100 text-xs" key={`repayment-${index}`}>
                        <Table.Cell className='!py-2'>{index+1}</Table.Cell>
                        <Table.Cell className='!py-2'>{formatDate(new Date(paymentTime))}</Table.Cell>
                        <Table.Cell className='!py-2 text-right'>
                          {
                            (index+1 == pool.paymentFrequency) 
                                ? numberWithCommas((parseFloat(stableBalance) / Math.pow(10,decimal)) + (parseFloat(interestAmountShare) / Math.pow(10,decimal)), 2) 
                                : numberWithCommas(parseFloat(interestAmountShare) / Math.pow(10,decimal), 2)
                          } {symbol}
                        </Table.Cell>
                        <Table.Cell className='!py-2 text-right'>{isInterestClaimable(index)}</Table.Cell>

                      </Table.Row>
                    )
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
        refreshLatestInterestClaimed={()=>{getLatestInterestClaimed(address, poolId);}}
      />
      
    </div>
  )
}
