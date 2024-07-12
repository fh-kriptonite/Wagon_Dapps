import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { ImCross } from "react-icons/im"
import { numberWithCommas } from "../../../util/stringUtility";
import { formatTime } from '../../../util/lendingUtility';
import { Button } from 'flowbite-react';
import useGetStableBalanceHook from '../utils/useGetStableBalanceHook';
import { useWeb3WalletState } from '../../general/web3WalletContext';

export default function LendToPoolDialog(props) {
  const { chainId, address } = useWeb3WalletState();

  const [stableNumber,setStableNumber] = useState("")
  const [wagNumber,setWagNumber] = useState("")

  const isOpen = props.isOpen;
  const closeModal = props.closeModal;
  const pool = props.pool;
  const poolJson = props.poolJson;
  const symbol = props.symbol;
  const fees = props.fees;
  const decimal = props.decimal;

  const {data: stableBalance, fetchData: getStableBalance} = useGetStableBalanceHook()
  const {data: wagBalance, fetchData: getWagBalance} = useGetStableBalanceHook()

  useEffect(()=>{
    if(isOpen && pool != null) {
      getStableBalance(chainId, address, pool.lendingCurrency);
      getWagBalance(chainId, address, pool.pairingCurrency);
    }
    resetModal();
  }, [pool, isOpen])

  function getRatio() {
    if(pool == null) return 0;
    return parseFloat(parseFloat(pool?.stabletoPairRate) / Math.pow(10,18));
  }

  function resetModal() {
    setStableNumber("")
    setWagNumber("")
  }

  function getExpectedInterest() {
    if(stableNumber == "") return 0;
    return parseFloat(stableNumber) / parseFloat(pool?.targetLoan) * parseFloat(pool?.targetInterestPerPayment) * parseFloat(pool?.paymentFrequency)
  }

  function getAdminFee() {
    if(fees == null) return 0;
    return (stableNumber * parseFloat(fees.adminFee) / 10000);
  }

  function getStableBalanceWithDecimal() {
    if(stableBalance == null) return "0";

    return parseFloat(stableBalance) / Math.pow(10,decimal);
  }

  function getWagBalanceWithDecimal() {
    if(wagBalance == null) return "0";

    return parseFloat(wagBalance) / Math.pow(10,18);
  }

  function getTotalStable() {
    if(stableNumber == "") return 0;
    return parseFloat(stableNumber) + getAdminFee()
  }

  function getLendToPoolButtonDisabled() {
    if(stableNumber == "") return true
    if(wagNumber == "") return true
    if(parseFloat(stableNumber) <= 0) return true
    if(parseFloat(wagNumber) <= 0) return true
    if(parseFloat(stableNumber) > parseFloat(stableBalance) / Math.pow(10,decimal)) return true
    if(parseFloat(wagNumber) > parseFloat(wagBalance) / Math.pow(10,18)) return true
    if(getStableBalanceWithDecimal() < getTotalStable()) return true

    return false;
  }

  function handleLend() {
    const adminFee = getAdminFee();
    props.handleLend(stableNumber, wagNumber, adminFee);
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
                    <div className='flex justify-between'>
                        <p className="text-xs font-semibold text-gray-500">
                            Amount
                        </p>
                        <p className="text-xs font-semibold text-gray-500">
                            Available: {numberWithCommas(getStableBalanceWithDecimal(), 2)} {symbol}
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <input type="number" id="amount" 
                            min="0"
                            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                            value={stableNumber}
                            onChange={(e)=>{
                              setStableNumber(e.target.value)
                              setWagNumber(e.target.value * getRatio())
                            }}
                            placeholder="0" required/>
                        <img src={poolJson?.properties.currency_logo} className="h-7" alt="IDRT Logo"/>
                        <p className="text-lg text-gray-500">
                            {symbol}
                        </p>
                        <Button
                          color={"light"}
                          size={"sm"}
                          onClick={() => {
                            setStableNumber(getStableBalanceWithDecimal())
                            setWagNumber(getStableBalanceWithDecimal() * getRatio())
                          }}
                        >
                          Max
                        </Button>
                    </div>

                    <div className='flex gap-2 items-center justify-between text-center border-t pt-3 mt-2'>
                      <p className="text-xs text-gray-500">
                        Admin Fee
                      </p>
                      <p className="text-xs font-semibold">
                        + {numberWithCommas(getAdminFee(), 2)} {symbol}
                      </p>
                    </div>
                    
                  </div>

                  <p 
                    onClick={()=>{window.open(`https://pancakeswap.finance/swap?outputCurrency=${pool.lendingCurrency}`, "buyIDRT");}}
                    className="text-xs text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit ml-auto mt-2"
                  >
                    Buy more {symbol}
                  </p>
                  

                  <p className='mt-2 text-center'>+</p>

                  <div className="mt-4 border rounded-xl p-4">
                    <div className='flex justify-between'>
                        <p className="text-xs font-semibold text-gray-500">
                            Amount
                        </p>
                        <p className="text-xs font-semibold text-gray-500">
                            Available: {numberWithCommas(getWagBalanceWithDecimal(), 2)} WAG
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <input type="number" id="amount" 
                            min="0"
                            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                            value={wagNumber}
                            onChange={(e)=>{
                              setWagNumber(e.target.value)
                              setStableNumber(e.target.value / getRatio())
                            }}
                            placeholder="0" required/>
                        <img src="/logo.png" className="h-7" alt="Wagon Logo"/>
                        <p className="text-lg text-gray-500">
                            WAG
                        </p>
                        <Button
                          color={"light"}
                          size={"sm"}
                          onClick={() => {
                            setWagNumber(getWagBalanceWithDecimal())
                            setStableNumber(getWagBalanceWithDecimal() / getRatio())
                          }}
                        >
                          Max
                        </Button>
                    </div>
                  </div>

                  <p 
                    onClick={()=>{window.open(`https://pancakeswap.finance/swap?inputCurrency=${pool.lendingCurrency}&outputCurrency=${pool.pairingCurrency}`, "buyWAG");}}
                    className="text-xs text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit  ml-auto mt-2"
                  >
                    Buy more WAG
                  </p>
                  
                  <div className="mt-6 border rounded-xl p-4">
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
                          Expected Interest
                      </p>
                      <p className="text-xs font-semibold">
                          {numberWithCommas(getExpectedInterest(), 2)} {symbol}
                      </p>
                    </div>
                    
                  </div>

                  <div className="mt-4 border rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 border-b pb-2">
                      Total needs for lend and fee
                    </p>

                    <div className='flex gap-2 items-center justify-between mt-2 text-center'>
                      <p className="text-xs text-gray-500">
                          Total {symbol}
                      </p>
                      <p className="text-xs font-semibold">
                          {numberWithCommas(getTotalStable() , 2)} {symbol}
                      </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between mt-1 text-center'>
                      <p className="text-xs text-gray-500">
                          Total WAG
                      </p>
                      <p className="text-xs font-semibold">
                          {numberWithCommas(wagNumber , 2)} WAG
                      </p>
                    </div>
                    
                  </div>

                  <div className="mt-4 text-center">
                    <Button
                      color={"dark"}
                      size={"sm"}
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
