import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { ImCross } from "react-icons/im"
import { Button } from 'flowbite-react';
import { numberWithCommas } from '../../../util/stringUtility';
import useApproveAllowanceHook from '../utils/useApproveAllowanceHook';
import useGetAllowanceHook from '../utils/useGetAllowanceHook';
import { ethers, parseEther } from 'ethers';
import useLendToPoolHook from '../utils/useLendToPoolHook';
import { useAccount } from '@particle-network/connectkit';

export default function ConfirmationLendToPoolDialog(props) {
  
  const address = useAccount();

  const poolId = props.poolId;
  const isOpen = props.isOpen;
  const pool = props.pool;
  const poolJson = props.poolJson;
  const symbol = props.symbol;
  const closeModal = props.closeModal;
  const refreshUser = props.refreshUser;

  const decimal = props.decimal;

  const stableNumber = props.stableNumber;
  const adminFee = props.adminFee;

  const wagNumber = props.wagNumber;

  const {isLoading: isLoadingStableAllowance, data: stableAllowance, fetchData: getStableAllowance} = useGetAllowanceHook()
  const {isLoading: isLoadingWagAllowance, data: wagAllowance, fetchData: getWagAllowance} = useGetAllowanceHook()

  useEffect(()=>{
    if (isOpen) {
      getStableAllowance(address, pool.lendingCurrency);
      getWagAllowance(address, pool.pairingCurrency);
    }
  }, [isOpen])

  const {isLoading: isLoadingApproveStable, fetchData: approveStable} = useApproveAllowanceHook()

  async function handleApproveStable() {
    try {
      const stableAmount = ethers.parseUnits((parseFloat(stableNumber) + adminFee).toString(), decimal);
      const resultApprove = await approveStable(stableAmount, pool.lendingCurrency)
      if (resultApprove.error) {
          throw resultApprove.error
      }
      getStableAllowance(address, pool.lendingCurrency);
    } catch (error) {
      console.log(error)
    }
  }

  function handleStableApproveButtonDisabled() {
    if(isLoadingStableAllowance) return true;
    
    const allowanceWithoutDecimal = parseFloat(stableAllowance) / Math.pow(10,decimal);
    if( allowanceWithoutDecimal >= parseFloat(stableNumber) + adminFee) return true;

    if(isLoadingApproveStable) return true;

    return false;
  }

  function handleStableApproveButtonString() {
    if(isLoadingStableAllowance) return "Checking Allowance";

    const allowanceWithoutDecimal = parseFloat(stableAllowance) / Math.pow(10,decimal);
    if( allowanceWithoutDecimal >= parseFloat(stableNumber) + adminFee) return "Approved";

    if(isLoadingApproveStable) return "Approving...";

    return "Approve";
  }

  const {isLoading: isLoadingApproveWag, fetchData: approveWag} = useApproveAllowanceHook()

  async function handleApproveWag() {
    try {
      const wagAmount = parseEther(`${wagNumber}`).toString()
      const resultApprove = await approveWag(wagAmount, pool.pairingCurrency)
      if (resultApprove.error) {
          throw resultApprove.error
      }
      getWagAllowance(address, pool.pairingCurrency);
    } catch (error) {
      console.log(error)
    }
  }

  function handleWagApproveButtonDisabled() {
    if(isLoadingWagAllowance) return true;
    
    const allowanceWithoutDecimal = parseFloat(wagAllowance) / Math.pow(10,18);
    if( allowanceWithoutDecimal >= parseFloat(wagNumber) ) return true;

    if(isLoadingApproveWag) return true;

    return false;
  }

  function handleWagApproveButtonString() {
    if(isLoadingWagAllowance) return "Checking Allowance";

    const allowanceWithoutDecimal = parseFloat(wagAllowance) / Math.pow(10,18);
    if( allowanceWithoutDecimal >= parseFloat(wagNumber) ) return "Approved";

    if(isLoadingApproveWag) return "Approving...";

    return "Approve";
  }

  const {isLoading: isLoadingLendToPool, fetchData: lendToPool} = useLendToPoolHook();

  async function handleLend() {
    try {
      const stableAmount = parseFloat(stableNumber) * Math.pow(10, decimal);
      const resultLend = await lendToPool(poolId, stableAmount)
      if (resultLend.error) {
          throw resultLend.error
      }
      refreshUser();
      closeModal();
    } catch (error) {
      console.log(error)
    }
  }

  function handleLendButtonDisabled() {
    if(isLoadingLendToPool) return true;
    
    const allowanceStableWithoutDecimal = parseFloat(stableAllowance) / Math.pow(10,decimal);
    const allowanceWagWithoutDecimal = parseFloat(wagAllowance) / Math.pow(10,18);

    if ( 
      allowanceStableWithoutDecimal >= parseFloat(stableNumber) + adminFee && 
      allowanceWagWithoutDecimal >= parseFloat(wagNumber)
    ) return false;
    
    return true;
  }

  function handleLendButtonString() {

    if(isLoadingLendToPool) return "Lending..."

    return "Lend To Pool";
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
                          Confirming Lend To Pool
                      </Dialog.Title>
                      <button onClick={()=>closeModal()}>
                          <ImCross/>
                      </button>
                  </div>

                  <div className="mt-4 border rounded-xl p-4">
                    <div className='flex justify-between'>
                        <p className="text-xs font-semibold text-gray-500">
                            Amount
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <p className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" >
                            {stableNumber}
                        </p>
                        <img src={poolJson?.properties.currency_logo} className="h-7" alt="IDRT Logo"/>
                        <p className="text-lg text-gray-500">
                            {symbol}
                        </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between text-center border-t pt-3 mt-2'>
                      <p className="text-xs text-gray-500">
                        Admin Fee
                      </p>
                      <p className="text-xs font-semibold">
                        + {numberWithCommas(adminFee, 2)} {symbol}
                      </p>
                    </div>
                    
                  </div>

                  <div className="mt-4">
                    <p className='text-base'>
                      <span className='font-bold'>Step 1. </span> Approving contract to spend <span className='font-semibold'>{numberWithCommas(parseFloat(stableNumber) + adminFee, 2)} {symbol}</span>
                    </p>
                    <div className='mt-2'>
                      <Button
                        color={"dark"}
                        size={"sm"}
                        style={{width:"100%"}}
                        disabled={handleStableApproveButtonDisabled()}
                        onClick={()=>{
                          handleApproveStable()
                        }}
                      >
                        {handleStableApproveButtonString()}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 border rounded-xl p-4">
                    <div className='flex justify-between'>
                        <p className="text-xs font-semibold text-gray-500">
                            Amount
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <p className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" >
                            {wagNumber}
                        </p>
                        <img src={"/logo.png"} className="h-7" alt="WAG Logo"/>
                        <p className="text-lg text-gray-500">
                            WAG
                        </p>
                    </div>

                  </div>

                  <div className="mt-4">
                    <p className='text-base'>
                      <span className='font-bold'>Step 2. </span> Approving contract to spend <span className='font-semibold'>{numberWithCommas(parseFloat(wagNumber), 2)} WAG</span>
                    </p>
                    <div className='mt-2'>
                      <Button
                        color={"dark"}
                        size={"sm"}
                        style={{width:"100%"}}
                        disabled={handleWagApproveButtonDisabled()}
                        onClick={()=>{
                          handleApproveWag()
                        }}
                      >
                        {handleWagApproveButtonString()}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className='text-base'>
                      <span className='font-bold'>Step 3. </span> Lend <span className='font-bold'>{symbol}</span> and <span className='font-bold'>WAG</span> to pool
                    </p>
                    <div className='mt-2'>
                      <Button
                        color={"dark"}
                        size={"sm"}
                        style={{width:"100%"}}
                        disabled={handleLendButtonDisabled()}
                        onClick={()=>{
                          handleLend()
                        }}
                      >
                        {handleLendButtonString()}
                      </Button>
                    </div>
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
