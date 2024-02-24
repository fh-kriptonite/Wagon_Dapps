import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Button } from 'flowbite-react';
import { numberWithCommas } from '../../../util/stringUtility';
import { ImCross } from 'react-icons/im';

export default function ConfirmationClaimInterestDialog(props) {

  const isOpen = props.isOpen;
  const number = props.number;
  const tokenName = props.tokenName;
  const lockedWag = props.lockedWag;
  const title = props.title;
  const isLastClaim = props.isLastClaim;

  const repayments = props.repayments;
  const poolDetail = props.poolDetail;
  const latestInterestClaimed = props.latestInterestClaimed;
  const interestSharePerPayment = props.interestSharePerPayment;
  const symbol = props.symbol;
  const stableBalance = props.stableBalance;

  const protocolFee = props.fees?.protocolFee;

  function closeModal() {
    props.close();
  }

  function isInterestClaimable(index) {
    if(index < latestInterestClaimed) return "Claimed"
    if(index < poolDetail?.latestRepayment) return "Claimable"
    return "Unclaimable"
}

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={()=>{props.close}}>
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
                          {title}
                      </Dialog.Title>
                      <button onClick={()=>closeModal()}>
                        <ImCross/>
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
                          if(claimable != "Claimable") return(<></>);
                          const loanStart = parseFloat(poolDetail.termStart) * 1000;
                          const durationBetweenPayment = poolDetail.loanTerm / poolDetail.paymentFrequency * 1000;
                          const paymentTime = loanStart + (durationBetweenPayment * (index + 1));
                          return (     
                              <div className='flex justify-between px-4 py-1 gap-4' key={`repayment-${index}`}>
                                  <p className='text-xs font-light w-10'>{index+1}</p>
                                  <p className='text-xs font-light flex-1 text-end'>{(index+1 == poolDetail.paymentFrequency) ? numberWithCommas(stableBalance + interestSharePerPayment) : numberWithCommas(interestSharePerPayment)} {symbol}</p>
                                  <p className='text-xs font-light flex-1 text-end'>{claimable}</p>
                              </div>
                          )
                      })
                    }
                    
                    <div className="mt-6 border rounded-xl p-2">
                      <p className="text-xs font-semibold text-gray-500">
                          Breakdown
                      </p>

                      <div className='w-full border-t my-2'></div>
                      
                      <div className='space-y-1'>
                          <div className='flex justify-between'>
                            <p className="text-xs text-gray-500">
                                Claimable Interest ({tokenName})
                            </p>
                            <p className="text-xs text-gray-500">
                              {numberWithCommas(number)}
                            </p>
                          </div>
                          <div className='flex justify-between'>
                            <p className="text-xs text-gray-500">
                                Protocol Fee ({tokenName})
                            </p>
                            <p className="text-xs text-gray-500">
                              -{numberWithCommas(number * protocolFee / 10000, 2)}
                            </p>
                          </div>
                      </div>

                      <div className='w-full border-t my-2'></div>

                      <div className='space-y-1'>
                          <div className='flex justify-between'>
                            <p className="text-xs text-gray-500">
                                Received Interest ({tokenName})
                            </p>
                            <p className="text-xs text-gray-500 font-semibold">
                              {numberWithCommas(number)}
                            </p>
                          </div>
                          <div className='flex justify-between'>
                            <p className="text-xs text-gray-500">
                                Unlock (WAG)
                            </p>
                            <p className="text-xs text-gray-500 font-semibold">
                            {
                              isLastClaim
                              ? numberWithCommas(lockedWag)
                              : 0.00
                            }
                            </p>
                          </div>
                      </div>

                    </div>
                  </div>

                  <div className='mt-6'>
                    <Button color={"dark"} style={{ width: '100%' }} size={"sm"} onClick={()=>{props.claimInterest()}}>Claim</Button>
                  </div>
                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
