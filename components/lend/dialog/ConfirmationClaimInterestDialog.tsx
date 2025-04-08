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

  const [protocolFeeAmount, setProtocolFeeAmount] = useState(0);

  useEffect(() => {
    getProtocolFeeAmount();
  }, [fees, pool, latestInterestClaimed]);

  function closeModal() {
    close();
  }

  function isInterestClaimable(index: number): string {
    if (index < parseFloat(latestInterestClaimed)) return "Claimed";
    if (index < parseFloat(pool.latestRepayment)) return "Claimable";
    return "Unclaimable";
  }

  function countTotalClaimable(): number {
    const countClaimable = parseFloat(pool.latestRepayment) - parseFloat(latestInterestClaimed);
    const claimable = countClaimable * parseFloat(interestAmountShare) / Math.pow(10, decimal);
    return claimable;
  }

  function getClaimableInterestAmount(): string {
    const claimable = countTotalClaimable();
    return numberWithCommas(claimable, 2);
  }

  function countFee(): number {
    if (fees == null) return 0;
    const claimable = countTotalClaimable();
    const fee = claimable * Number(fees.protocolFee) / 10000;
    return fee;
  }

  function getProtocolFeeAmount(): void {
    if (fees == null) return;

    const fee = countFee();
    setProtocolFeeAmount(fee);
  }

  function getReceivedInterestAmount(): string {
    const claimable = countTotalClaimable();
    const fee = countFee();

    return numberWithCommas(claimable - fee, 2);
  }

  function getUnlockWagAmount(): string {
    if (pool == null) return "~";
    if (parseFloat(pool.latestRepayment) == parseFloat(pool.paymentFrequency)) 
      return numberWithCommas(parseFloat(wagBalance) / 1e18, 2);

    return numberWithCommas(0, 2);
  }

  const { isLoading: isLoadingClaimInterest, fetchData: claimInterest } = useClaimInterestHook();

  async function handleClaimInterest() {
    try {
      const resultClaim = await claimInterest(poolId as string);
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
      <Transition appear show={isOpen} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className='flex justify-between'>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Claiming Interest
                    </Dialog.Title>
                    <button onClick={closeModal}>
                      <ImCross />
                    </button>
                  </div>

                  <div className='mt-6 overflow-auto'>
                    <div className='flex justify-between px-4 py-2 gap-4'>
                      <p className='text-xs font-semibold w-10'>Term</p>
                      <p className='text-xs font-semibold flex-1 text-end'>Amount</p>
                      <p className='text-xs font-semibold flex-1 text-end'>Status</p>
                    </div>
                    {
                      repayments.map((repayment, index) => {
                        const claimable = isInterestClaimable(index);
                        if (claimable !== "Claimable") return null;
                        return (
                          <div className='flex justify-between px-4 py-1 gap-4' key={`confirmrepayment-${index}`}>
                            <p className='text-xs font-light w-10'>{index + 1}</p>
                            <p className='text-xs font-light flex-1 text-end'>
                              {
                                (index + 1 === parseFloat(pool.paymentFrequency))
                                  ? numberWithCommas((parseFloat(stableBalance) / Math.pow(10, decimal)) + (parseFloat(interestAmountShare) / Math.pow(10, decimal)), 2)
                                  : numberWithCommas(parseFloat(interestAmountShare) / Math.pow(10, decimal), 2)
                              } {symbol}
                            </p>
                            <p className='text-xs font-light flex-1 text-end'>{claimable}</p>
                          </div>
                        );
                      })
                    }

                    <div className="mt-6 border rounded-xl p-2">
                      <p className="text-xs font-semibold">
                        Breakdown
                      </p>

                      <div className='w-full border-t my-2'></div>

                      <div className='space-y-1'>
                        <div className='flex justify-between'>
                          <p className="text-xs text-gray-500">
                            Claimable Interest ({symbol})
                          </p>
                          <p className="text-xs text-gray-500">
                            {getClaimableInterestAmount()}
                          </p>
                        </div>
                        <div className='flex justify-between'>
                          <p className="text-xs text-gray-500">
                            Protocol Fee ({symbol})
                          </p>
                          <p className="text-xs text-gray-500">
                            -{numberWithCommas(protocolFeeAmount, 2)}
                          </p>
                        </div>
                      </div>

                      <div className='w-full border-t my-2'></div>

                      <div className='space-y-1'>
                        <div className='flex justify-between'>
                          <p className="text-xs">
                            Received Interest ({symbol})
                          </p>
                          <p className="text-xs">
                            {getReceivedInterestAmount()}
                          </p>
                        </div>
                        <div className='flex justify-between'>
                          <p className="text-xs">
                            Unlock (WAG)
                          </p>
                          <p className="text-xs">
                            {getUnlockWagAmount()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6'>
                    <Button color={"dark"}
                      className='w-full disabled:bg-gray-300'
                      size={"sm"}
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