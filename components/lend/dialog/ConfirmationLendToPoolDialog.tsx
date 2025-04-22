import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { ImCross } from "react-icons/im"
import { Button } from 'flowbite-react';
import { numberWithCommas } from '../../../util/stringUtility';
import useApproveAllowanceHook from '../utils/useApproveAllowanceHook';
import useGetAllowanceHook from '../utils/useGetAllowanceHook';
import { ethers, parseEther } from 'ethers';
import useLendToPoolHook from '../utils/useLendToPoolHook';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import { Pool, PoolJson } from '../types';

interface ConfirmationLendToPoolDialogProps {
  poolId: string;
  isOpen: boolean;
  pool: Pool;
  poolJson: PoolJson;
  symbol: string;
  closeModal: () => void;
  refreshUser: () => void;
  decimal: number;
  stableNumber: string;
  adminFee: number;
  wagNumber: string;
}

export default function ConfirmationLendToPoolDialog(props: ConfirmationLendToPoolDialogProps) {
  const { connectedAddress: address } = useConnectedAddress();

  const {
    poolId,
    isOpen,
    pool,
    poolJson,
    symbol,
    closeModal,
    refreshUser,
    decimal,
    stableNumber,
    adminFee,
    wagNumber
  } = props;

  const {isLoading: isLoadingStableAllowance, data: stableAllowance, fetchData: getStableAllowance} = useGetAllowanceHook()
  const {isLoading: isLoadingWagAllowance, data: wagAllowance, fetchData: getWagAllowance} = useGetAllowanceHook()

  useEffect(()=>{
    if (isOpen && address) {
      getStableAllowance(address, pool.lendingCurrency);
      getWagAllowance(address, pool.pairingCurrency);
    }
  }, [isOpen, address])

  const {isLoading: isLoadingApproveStable, isWaitingApproval: isWaitingApprovalStable, fetchData: approveStable} = useApproveAllowanceHook()

  async function handleApproveStable() {
    try {
      const stableAmount = ethers.parseUnits((parseFloat(stableNumber) + adminFee).toString(), decimal);
      const resultApprove = await approveStable(stableAmount, pool.lendingCurrency)
      if (resultApprove.error) {
          throw resultApprove.error
      }
      if (address) {
        getStableAllowance(address, pool.lendingCurrency);
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleStableApproveButtonDisabled(): boolean {
    if(isLoadingStableAllowance) return true;
    
    const allowanceWithoutDecimal = stableAllowance ? parseFloat(stableAllowance.toString()) / Math.pow(10,decimal) : 0;
    if( allowanceWithoutDecimal >= parseFloat(stableNumber) + adminFee) return true;

    if(isLoadingApproveStable) return true;

    return false;
  }

  function handleStableApproveButtonString(): string {
    if(isLoadingStableAllowance) return "Checking Allowance";

    const allowanceWithoutDecimal = stableAllowance ? parseFloat(stableAllowance.toString()) / Math.pow(10,decimal) : 0;
    if( allowanceWithoutDecimal >= parseFloat(stableNumber) + adminFee) return "Approved";

    if(isLoadingApproveStable) return "Approving...";

    return "Approve";
  }

  const {isLoading: isLoadingApproveWag, isWaitingApproval: isWaitingApprovalWag, fetchData: approveWag} = useApproveAllowanceHook()

  async function handleApproveWag() {
    try {
      const wagAmount = parseEther(`${wagNumber}`)
      const resultApprove = await approveWag(wagAmount, pool.pairingCurrency)
      if (resultApprove.error) {
          throw resultApprove.error
      }
      if (address) {
        getWagAllowance(address, pool.pairingCurrency);
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleWagApproveButtonDisabled(): boolean {
    if(isLoadingWagAllowance) return true;
    
    const allowanceWithoutDecimal = wagAllowance ? parseFloat(wagAllowance.toString()) / Math.pow(10,18) : 0;
    if( allowanceWithoutDecimal >= parseFloat(wagNumber) ) return true;

    if(isLoadingApproveWag) return true;

    return false;
  }

  function handleWagApproveButtonString(): string {
    if(isLoadingWagAllowance) return "Checking Allowance";

    const allowanceWithoutDecimal = wagAllowance ? parseFloat(wagAllowance.toString()) / Math.pow(10,18) : 0;
    if( allowanceWithoutDecimal >= parseFloat(wagNumber) ) return "Approved";

    if(isLoadingApproveWag) return "Approving...";

    return "Approve";
  }

  const {isLoading: isLoadingLendToPool, isWaitingApproval: isWaitingApprovalLendToPool, fetchData: lendToPool} = useLendToPoolHook();

  async function handleLend() {
    try {
      const stableAmount = parseFloat(stableNumber) * Math.pow(10, decimal);
      const resultLend = await lendToPool(poolId, BigInt(stableAmount))
      if (resultLend.error) {
          throw resultLend.error
      }
      refreshUser();
      closeModal();
    } catch (error) {
      console.log(error)
    }
  }

  function handleLendButtonDisabled(): boolean {
    if(isLoadingLendToPool) return true;
    
    const allowanceStableWithoutDecimal = stableAllowance ? parseFloat(stableAllowance.toString()) / Math.pow(10,decimal) : 0;
    const allowanceWagWithoutDecimal = wagAllowance ? parseFloat(wagAllowance.toString()) / Math.pow(10,18) : 0;

    if ( 
      allowanceStableWithoutDecimal >= parseFloat(stableNumber) + adminFee && 
      allowanceWagWithoutDecimal >= parseFloat(wagNumber)
    ) return false;
    
    return true;
  }

  function handleLendButtonString(): string {
    if(isLoadingLendToPool) return "Lending..."

    return "Lend To Pool";
  }

  function handleShowButton(): boolean {
    if(isWaitingApprovalStable || isWaitingApprovalWag || isWaitingApprovalLendToPool) return false;
    return true;
  }

  return (
    <>
      <Transition appear show={isOpen && handleShowButton()} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className='flex justify-between items-center mb-6'>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900"
                    >
                      Confirming Lend To Pool
                    </Dialog.Title>
                    <button 
                      onClick={()=>closeModal()}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <ImCross className="w-4 h-4"/>
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className='flex justify-between mb-2'>
                      <p className="text-sm font-medium text-gray-600">
                        Amount
                      </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between'>
                      <p className="text-2xl font-semibold text-gray-900">
                        {numberWithCommas(stableNumber)}
                      </p>
                      <div className="flex items-center gap-2">
                        <img src={poolJson?.properties.currency_logo} className="h-7" alt="Token Logo"/>
                        <p className="text-lg text-gray-500">
                          {symbol}
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-2 items-center justify-between text-center border-t pt-3 mt-2'>
                      <p className="text-sm text-gray-600">
                        Admin Fee
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        + {numberWithCommas(adminFee, 2)} {symbol}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className='text-sm text-gray-600 mb-2'>
                      <span className='font-semibold text-gray-900'>Step 1. </span> Approving contract to spend <span className='font-semibold text-gray-900'>{numberWithCommas(parseFloat(stableNumber) + adminFee, 2)} {symbol}</span>
                    </p>
                    <Button
                      color={handleStableApproveButtonString() === "Approved" ? "success" : "dark"}
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={handleStableApproveButtonDisabled()}
                      onClick={()=>{
                        handleApproveStable()
                      }}
                    >
                      {handleStableApproveButtonString()}
                    </Button>
                  </div>

                  { 
                    wagNumber !== "" && wagNumber !== "0" &&
                    <div>
                      <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className='flex justify-between mb-2'>
                          <p className="text-sm font-medium text-gray-600">
                            Amount
                          </p>
                        </div>
                        
                        <div className='flex gap-2 items-center justify-between'>
                          <p className="text-2xl font-semibold text-gray-900">
                            {numberWithCommas(wagNumber)}
                          </p>
                          <div className="flex items-center gap-2">
                            <img src="/images/wag.png" className="h-7" alt="WAG Token Logo"/>
                            <p className="text-lg text-gray-500">
                              WAG
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className='text-sm text-gray-600 mb-2'>
                          <span className='font-semibold text-gray-900'>Step 2. </span> Approving contract to spend <span className='font-semibold text-gray-900'>{numberWithCommas(wagNumber)} WAG</span>
                        </p>
                        <Button
                          color={handleWagApproveButtonString() === "Approved" ? "success" : "dark"}
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={handleWagApproveButtonDisabled()}
                          onClick={()=>{
                            handleApproveWag()
                          }}
                        >
                          {handleWagApproveButtonString()}
                        </Button>
                      </div>
                    </div>
                  }

                  <div className="mt-6">
                    <p className='text-sm text-gray-600 mb-2'>
                      <span className='font-semibold text-gray-900'>Step {wagNumber !== "" ? "3" : "2"}. </span> Lend to pool
                    </p>
                    <Button
                      color="dark"
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={handleLendButtonDisabled()}
                      onClick={()=>{
                        handleLend()
                      }}
                    >
                      {handleLendButtonString()}
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