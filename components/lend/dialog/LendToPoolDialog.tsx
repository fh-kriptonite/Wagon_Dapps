import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { ImCross } from "react-icons/im"
import { inputNumberFilter, numberWithCommas } from "../../../util/stringUtility";
import { formatTime } from '../../../util/lendingUtility';
import { Button, Checkbox, Label } from 'flowbite-react';
import useGetStableBalanceHook from '../utils/useGetStableBalanceHook';
import { useAccount } from '@particle-network/connectkit';
import Link from 'next/link';
import { Pool, PoolFee, PoolJson } from '../types';

interface LendToPoolDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  pool: Pool | null;
  poolJson: PoolJson | null;
  symbol: string;
  fees: PoolFee | null;
  decimal: number;
  chainId: number;
  handleLend: (stableNumber: string, wagNumber: string, adminFee: number) => void;
}

export default function LendToPoolDialog(props: LendToPoolDialogProps) {
  const address = useAccount();
  const chainId = props.chainId;

  const [stableNumber, setStableNumber] = useState<string>("")
  const [wagNumber, setWagNumber] = useState<string>("")
  const [checkedTnc, setCheckedTnc] = useState<boolean>(false)

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
      getStableBalance(chainId, address || "", pool.lendingCurrency);
      getWagBalance(chainId, address || "", pool.pairingCurrency);
    }
    resetModal();
  }, [pool, isOpen])

  function getRatio(): number {
    if(pool == null) return 0;
    return parseFloat(pool.stabletoPairRate) / Math.pow(10,18);
  }

  function resetModal(): void {
    setStableNumber("")
    setWagNumber("")
  }

  function getExpectedInterest(): number {
    if(stableNumber === "" || !pool) return 0;
    return parseFloat(stableNumber) / parseFloat(pool.targetLoan) * parseFloat(pool.targetInterestPerPayment) * parseFloat(pool.paymentFrequency)
  }

  function getAdminFee(): number {
    if(fees == null || stableNumber === "") return 0;
    return (parseFloat(stableNumber) * Number(fees.adminFee) / 10000);
  }

  function showAdminFee(): boolean {
    if(!fees) return false;
    if(Number(fees.adminFee) === 0) return false;
    return true;
  }

  function getStableBalanceWithDecimal(): string {
    if(stableBalance == null) return "0";
    return (parseFloat(stableBalance.toString()) / Math.pow(10,decimal)).toString();
  }

  function getWagBalanceWithDecimal(): string {
    if(wagBalance == null) return "0";
    return (parseFloat(wagBalance.toString()) / Math.pow(10,18)).toString();
  }

  function getTotalStable(): number {
    if(stableNumber === "") return 0;
    return parseFloat(stableNumber) + getAdminFee()
  }

  function getLendToPoolButtonDisabled(): boolean {
    if(!checkedTnc) return true
    if(stableNumber === "") return true
    if(parseFloat(stableNumber) <= 0) return true
    const stableBalanceValue = stableBalance ? stableBalance.toString() : "0";
    const wagBalanceValue = wagBalance ? wagBalance.toString() : "0";
    if(parseFloat(stableNumber) > parseFloat(stableBalanceValue) / Math.pow(10,decimal)) return true
    if(parseFloat(wagNumber) > parseFloat(wagBalanceValue) / Math.pow(10,18)) return true
    if(parseFloat(getStableBalanceWithDecimal()) < getTotalStable()) return true
    return false;
  }

  function handleLend(): void {
    const adminFee = getAdminFee();
    props.handleLend(stableNumber, wagNumber, adminFee);
  }

  function showWagPair(): boolean {
    if(!pool) return false;
    if(Number(pool.stabletoPairRate) === 0) return false
    return true;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const rawValue = inputNumberFilter(e.target.value);
    setStableNumber(rawValue)
    setWagNumber((parseFloat(rawValue) * getRatio()).toString())
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
                      <input type="text"
                        className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                        value={numberWithCommas(stableNumber)}
                        onChange={handleChange}
                        placeholder="0" required/>
                      <img src={poolJson?.properties.currency_logo} className="h-7" alt="Token Logo"/>
                      <p className="text-lg text-gray-500">
                        {symbol}
                      </p>
                      <Button
                        color={"light"}
                        size={"sm"}
                        onClick={() => {
                          setStableNumber(getStableBalanceWithDecimal())
                          setWagNumber((parseFloat(getStableBalanceWithDecimal()) * getRatio()).toString())
                        }}
                      >
                        Max
                      </Button>
                    </div>

                    {showAdminFee() && (
                      <div className='flex gap-2 items-center justify-between text-center border-t pt-3 mt-2'>
                        <p className="text-xs text-gray-500">
                          Admin Fee
                        </p>
                        <p className="text-xs font-semibold">
                          + {numberWithCommas(getAdminFee(), 2)} {symbol}
                        </p>
                      </div>
                    )}
                  </div>

                  <p 
                    onClick={()=>{window.open(`https://pancakeswap.finance/swap?outputCurrency=${pool?.lendingCurrency}`, `buy${symbol}`);}}
                    className="text-xs text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit ml-auto mt-2"
                  >
                    Buy more {symbol}
                  </p>
                  
                  {showWagPair() && (
                    <div>
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
                              setStableNumber((parseFloat(e.target.value) / getRatio()).toString())
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
                              setStableNumber((parseFloat(getWagBalanceWithDecimal()) / getRatio()).toString())
                            }}
                          >
                            Max
                          </Button>
                        </div>
                      </div>

                      <p 
                        onClick={()=>{window.open(`https://pancakeswap.finance/swap?inputCurrency=${pool?.lendingCurrency}&outputCurrency=${pool?.pairingCurrency}`, "buyWAG");}}
                        className="text-xs text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit ml-auto mt-2"
                      >
                        Buy more WAG
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center">
                      <Checkbox
                        id="accept"
                        checked={checkedTnc}
                        onChange={(e) => setCheckedTnc(e.target.checked)}
                      />
                      <Label htmlFor="accept" className="ml-2">
                        I accept the <Link href="/terms" className="text-blue-500 hover:text-blue-800">Terms and Conditions</Link>
                      </Label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      color="dark"
                      className="w-full disabled:bg-gray-300 hover:bg-gray-600"
                      disabled={getLendToPoolButtonDisabled()}
                      onClick={handleLend}
                    >
                      Lend to Pool
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