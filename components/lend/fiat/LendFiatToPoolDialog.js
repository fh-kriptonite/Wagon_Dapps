import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { ImCross } from "react-icons/im"
import { inputNumberFilter, numberWithCommas } from "../../../util/stringUtility";
import { formatTime } from '../../../util/lendingUtility';
import { Button, Checkbox, Spinner } from 'flowbite-react';
import { useAccount } from '@particle-network/connectkit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LendFiatToPoolDialog(props) {
  const address = useAccount();

  const router = useRouter();
  
  const [stableNumber,setStableNumber] = useState("")
  const [checkedTnc, setCheckedTnc] = useState(false)

  const isOpen = props.isOpen;
  const closeModal = props.closeModal;
  const pool = props.pool;
  const poolJson = props.poolJson;
  const symbol = props.symbol;
  const fees = props.fees;
  const profile = props.profile;
  const poolId = props.poolId;

  function resetModal() {
    setStableNumber("")
  }

  function getExpectedInterest() {
    if(stableNumber == "") return 0;

    const interestPerTerm = parseFloat(stableNumber) / parseFloat(pool?.targetLoan) * parseFloat(pool?.targetInterestPerPayment);
    const protocolFee = interestPerTerm * parseFloat(fees?.protocolFee) / 10000;

    const interestNetPerTerm = interestPerTerm - protocolFee;

    return  interestNetPerTerm * parseFloat(pool?.paymentFrequency);
  }

  function getPaymentFrequency() {
    if(!pool) return 0;
    return pool.paymentFrequency;
  }

  function getAdminFee() {
    if(fees == null) return 0;
    return (stableNumber * parseFloat(fees.adminFee) / 10000);
  }

  function showAdminFee() {
    if(!fees) return false;
    if(fees.adminFee == 0) return false

    return true;
  }

  function getLendToPoolButtonDisabled() {
    if(!checkedTnc) return true
    if(stableNumber == "") return true
    if(parseFloat(stableNumber) <= 0) return true
    
    return false;
  }

  async function requestOnramp(stableNumber, fee) {
    try {
        const payload ={
          amount: parseInt(stableNumber),
          fee: fee,
          poolId: parseInt(poolId),
          wallet_address: address
        }

        console.log(payload)

        // Request Account
        const response = await axios.post(`${process.env.RAMP_API_URL}/idrx/onramp_wagon`, payload, 
          {
            headers: {
              'Content-Type': 'application/json'
            }
          });

        // Handle success response
        console.log(response)
        
        if(response.error) {
            throw response.error
        }

        props.handleLend(response.data.data);
    } catch (error) {
        // Handle error response
        console.error('Error:', error);
    }
  }

  function handleLend() {
    if(profile == null) {
      router.push('/account/profile')
    } else if(profile.status != 1) {
      router.push('/account/profile')
    } else {
      // call onramp service
      const fee = getAdminFee();
      requestOnramp(stableNumber, fee);
    }
  }

  function handleChange(e) {
    const rawValue = inputNumberFilter(e.target.value);
    setStableNumber(rawValue)
  }
  
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={()=>{}}>

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
                            Lend To Pool
                        </Dialog.Title>
                        <button onClick={()=>closeModal()}>
                            <ImCross/>
                        </button>
                    </div>
                  
                  <div className="mt-4 border rounded-xl p-4">
                    <div className='flex gap-2 items-center justify-between'>
                        <input type="text"
                            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                            value={numberWithCommas(stableNumber)}
                            onChange={handleChange}
                            placeholder="0" required/>
                        <img src={poolJson?.properties.currency_logo} className="h-7" alt="IDRT Logo"/>
                        <p className="text-lg text-gray-500">
                            IDR
                        </p>
                    </div>

                    {
                      showAdminFee() &&
                      <div className='flex gap-2 items-center justify-between text-center border-t pt-3 mt-2'>
                        <p className="text-xs text-gray-500">
                          Admin Fee
                        </p>
                        <p className="text-xs font-semibold">
                          + {numberWithCommas(getAdminFee(), 2)} {symbol}
                        </p>
                      </div>
                    }
                  </div>

                  <div className="mt-4 border rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 border-b pb-2">
                        Expectation and pool maturity
                    </p>
                    
                    <div className='flex gap-2 items-center justify-between mt-2 text-center'>
                      <p className="text-xs text-gray-500">
                          Loan Term
                      </p>
                      <p className="text-xs font-semibold">
                        {formatTime(parseFloat(pool?.loanTerm))}
                      </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between mt-1 text-center'>
                      <p className="text-xs text-gray-500">
                          Payment Frequency
                      </p>
                      <p className="text-xs font-semibold">
                          {numberWithCommas(getPaymentFrequency())} times
                      </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between mt-1 text-center'>
                      <p className="text-xs text-gray-500">
                          Expected Interest
                      </p>
                      <p className="text-xs font-semibold">
                          {numberWithCommas(getExpectedInterest(), 2)} IDR
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Checkbox id="tnc" checked={checkedTnc} onClick={()=>{setCheckedTnc(!checkedTnc)}}/>
                    <p className="text-xs text-gray-500">I confirm acceptance of these 
                      <span>
                        <Link href="/lendTnc" passHref>
                          <a target="_blank" className="font-bold text-black hover:cursor-pointer ml-1">terms and conditions</a>
                        </Link>
                      </span>.
                    </p>
                  </div>

                  {
                    (profile == null || profile?.status != 1) && 
                    <p className='tetx-xs mt-4 text-xs text-red-500 text-center'>Please verify your account by KYC to unlock this service.</p>
                  }
                  <div className="mt-4 text-center">
                    <Button
                      color={"dark"}
                      style={{width:"100%"}}
                      disabled={getLendToPoolButtonDisabled()}
                      onClick={handleLend}
                    >
                      Lend To Pool
                    </Button>
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
