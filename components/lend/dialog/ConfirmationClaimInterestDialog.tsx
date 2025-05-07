import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { Button } from 'flowbite-react';
import { numberWithCommas } from '../../../util/stringUtility';
import { ImCross } from 'react-icons/im';
import useClaimInterestHook from '../utils/useClaimInterestHook';
import { useRouter } from 'next/router';
import { Pool, PoolFee } from '../types';

interface Repayment {
  // Add repayment properties based on your data structure
  [key: string]: any;
}

interface ConfirmationClaimInterestDialogProps {
  isOpen: boolean;
  symbol: string;
  wagBalance: string;
  repayments: Repayment[];
  pool: Pool;
  latestInterestClaimed: string;
  interestAmountShare: string;
  stableBalance: string;
  decimal: number;
  fees: PoolFee;
  refreshLatestInterestClaimed: () => void;
  refresh: () => void;
  close: () => void;
}

export default function ConfirmationClaimInterestDialog(props: ConfirmationClaimInterestDialogProps) {
  const router = useRouter();
  const { poolId } = router.query;

  const {
    isOpen,
    symbol,
    wagBalance,
    repayments,
    pool,
    latestInterestClaimed,
    interestAmountShare,
    stableBalance,
    decimal,
    fees,
    refreshLatestInterestClaimed,
    refresh,
    close
  } = props;

  const [totalClaimable, setTotalClaimable] = useState(null);
  const [protocolFeeAmount, setProtocolFeeAmount] = useState(null);

  useEffect(() => {
    if(pool != null && latestInterestClaimed != null && interestAmountShare != null && decimal != null) {
      const countClaimable = pool.latest_repayment - parseFloat(latestInterestClaimed);
      const claimable = countClaimable * parseFloat(interestAmountShare) / Math.pow(10, decimal);
      setTotalClaimable(claimable as any); // Type assertion to fix type error
    }
  }, [pool, latestInterestClaimed, interestAmountShare, decimal]);

  useEffect(() => {
    if(fees != null && totalClaimable != null) {
      const fee = totalClaimable * Number(fees.protocolFee) / 10000;
      setProtocolFeeAmount(fee as any); // Type assertion to fix type error
    }
  }, [fees, totalClaimable]);

  function closeModal() {
    close();
  }

  function isInterestClaimable(index: number): string {
    if (index < parseFloat(latestInterestClaimed)) return "Claimed";
    if (index < pool.latest_repayment) return "Claimable";
    return "Unclaimable";
  }

  function getClaimableInterestAmount(): string {
    if(totalClaimable == null) return "~";
    return numberWithCommas(totalClaimable, 2);
  }

  function getReceivedInterestAmount(): string {
    if(totalClaimable == null || protocolFeeAmount == null) return "~";
    return numberWithCommas(totalClaimable - protocolFeeAmount, 2);
  }

  function getUnlockWagAmount(): string {
    if (pool == null) return "~";
    if (pool.latest_repayment == pool.payment_frequency) 
      return numberWithCommas(parseFloat(wagBalance) / 1e18, 2);

    return numberWithCommas(0, 2);
  }

  const { isLoading: isLoadingClaimInterest, isWaitingApproval, fetchData: claimInterest } = useClaimInterestHook();

  async function handleClaimInterest() {
    try {
      const resultClaim = await claimInterest(poolId as string, pool.contract.network_id);
      if (resultClaim.error) {
        throw resultClaim.error;
      }
      refreshLatestInterestClaimed();
      refresh();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  function handleClaimButtonString(): string {
    if (isLoadingClaimInterest) return "Claiming...";
    return "Claim";
  }

  return (
    <>
      <Transition appear show={isOpen && !isWaitingApproval} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className='flex justify-between items-center mb-6'>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900"
                    >
                      Claiming Interest
                    </Dialog.Title>
                    <button 
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <ImCross className="w-4 h-4"/>
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className='flex justify-between px-4 py-2 gap-4'>
                      <p className='text-sm font-medium text-gray-600 w-10'>Term</p>
                      <p className='text-sm font-medium text-gray-600 flex-1 text-end'>Amount</p>
                      <p className='text-sm font-medium text-gray-600 flex-1 text-end'>Status</p>
                    </div>
                    <hr className="my-3 h-px bg-gray-200 border-0" />
                    {
                      repayments.map((repayment, index) => {
                        const claimable = isInterestClaimable(index);
                        if (claimable !== "Claimable") return null;
                        return (
                          <div className='flex justify-between px-4 py-2 gap-4' key={`confirmrepayment-${index}`}>
                            <p className='text-sm text-gray-900 w-10'>{index + 1}</p>
                            <p className='text-sm text-gray-900 flex-1 text-end'>
                              {
                                (index + 1 === pool.payment_frequency)
                                  ? numberWithCommas((parseFloat(stableBalance) / Math.pow(10, decimal)) + (parseFloat(interestAmountShare) / Math.pow(10, decimal)), 2)
                                  : numberWithCommas(parseFloat(interestAmountShare) / Math.pow(10, decimal), 2)
                              } {symbol}
                            </p>
                            <p className='text-sm text-gray-900 flex-1 text-end'>{claimable}</p>
                          </div>
                        );
                      })
                    }
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm font-medium text-gray-600 mb-4">
                      Breakdown
                    </p>

                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <p className="text-sm text-gray-600">
                          Claimable Interest ({symbol})
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getClaimableInterestAmount()}
                        </p>
                      </div>
                      <div className='flex justify-between'>
                        <p className="text-sm text-gray-600">
                          Protocol Fee ({symbol})
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          -{numberWithCommas(protocolFeeAmount, 2)}
                        </p>
                      </div>
                    </div>

                    <hr className="my-4 h-px bg-gray-200 border-0" />

                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <p className="text-sm font-medium text-gray-600">
                          Received Interest ({symbol})
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getReceivedInterestAmount()}
                        </p>
                      </div>
                      <div className='flex justify-between'>
                        <p className="text-sm font-medium text-gray-600">
                          Unlock (WAG)
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getUnlockWagAmount()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      color="dark"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoadingClaimInterest}
                      onClick={handleClaimInterest}
                    >
                      {handleClaimButtonString()}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 