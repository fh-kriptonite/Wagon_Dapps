import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { ImCross } from "react-icons/im"
import { inputNumberFilter, numberWithCommas } from "../../../util/stringUtility";
import { Button, Checkbox, Label } from 'flowbite-react';
import useGetStableBalanceHook from '../utils/useGetStableBalanceHook';
import { useConnectedAddress } from '../../../hooks/useConnectedAddress';
import Link from 'next/link';
import { Pool, PoolFee } from '../types';
import { useAccount } from '@particle-network/connectkit';

interface LendToPoolDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  pool: Pool | null;
  fees: PoolFee | null;
  handleLend: (stableNumber: string, wagNumber: string, adminFee: number) => void;
}

export default function LendToPoolDialog(props: LendToPoolDialogProps) {
  const { connectedAddress: address } = useConnectedAddress();
  const { chainId } = useAccount();

  const [stableNumber, setStableNumber] = useState<string>("")
  const [wagNumber, setWagNumber] = useState<string>("")
  const [checkedTnc, setCheckedTnc] = useState<boolean>(false)

  const isOpen = props.isOpen;
  const closeModal = props.closeModal;
  const pool = props.pool;
  const fees = props.fees;

  const {data: stableBalance, fetchData: getStableBalance} = useGetStableBalanceHook()
  const {data: wagBalance, fetchData: getWagBalance} = useGetStableBalanceHook()

  useEffect(()=>{
    if(isOpen && pool && chainId) {
      getStableBalance(chainId, address || "", pool.lending_contract.address);
      getWagBalance(chainId, address || "", pool.pairing_contract.address);
    }
    resetModal();
  }, [pool, isOpen, chainId])

  function getRatio(): number {
    if(pool == null) return 0;
    return pool.stable_to_pair_rate / Math.pow(10,18);
  }

  function resetModal(): void {
    setStableNumber("")
    setWagNumber("")
  }

  function getExpectedInterest(): number {
    if(stableNumber === "" || !pool) return 0;
    return parseFloat(stableNumber) / parseFloat(pool.target_loan) * parseFloat(pool.target_interest_per_payment) * pool.payment_frequency
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

  function getWagBalanceWithDecimal(): string {
    if(wagBalance == null) return "0";
    return wagBalance.toString();
  }

  function getTotalStable(): number {
    if(stableNumber === "") return 0;
    return parseFloat(stableNumber) + getAdminFee()
  }

  function getLendToPoolButtonDisabled(): boolean {
    if(!checkedTnc) return true
    if(stableNumber === "") return true
    if(parseFloat(stableNumber) <= 0) return true
    if(parseFloat(stableNumber) > (stableBalance || 0)) return true
    if(parseFloat(wagNumber) > (wagBalance || 0)) return true
    if((stableBalance || 0) < getTotalStable()) return true
    return false;
  }

  function handleLend(): void {
    const adminFee = getAdminFee();
    props.handleLend(stableNumber, wagNumber, adminFee);
  }

  function showWagPair(): boolean {
    if(!pool) return false;
    if(Number(pool.stable_to_pair_rate) === 0) return false
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
                      Lend To Pool
                    </Dialog.Title>
                    <button 
                      onClick={closeModal}
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
                      <p className="text-sm font-medium text-gray-600">
                        Available: {numberWithCommas(stableBalance || 0, 2)} {pool?.detail.currency}
                      </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between'>
                      <input type="text"
                        className="text-gray-900 bg-transparent border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none flex-1" 
                        value={numberWithCommas(stableNumber)}
                        onChange={handleChange}
                        placeholder="0" required/>
                      <div className="flex items-center gap-2">
                        <img src={pool?.detail.currency_logo} className="h-7" alt="Token Logo"/>
                        <p className="text-lg text-gray-500">
                          {pool?.detail.currency}
                        </p>
                        <Button
                          color="light"
                          size="xs"
                          onClick={() => {
                            setStableNumber(stableBalance?.toString() || "0")
                            setWagNumber((parseFloat(stableBalance?.toString() || "0") * getRatio()).toString())
                          }}
                        >
                          Max
                        </Button>
                      </div>
                    </div>

                    {showAdminFee() && (
                      <div className='flex gap-2 items-center justify-between text-center border-t pt-3 mt-2'>
                        <p className="text-sm text-gray-600">
                          Admin Fee
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          + {numberWithCommas(getAdminFee(), 2)} {pool?.detail.currency}
                        </p>
                      </div>
                    )}
                  </div>

                  <p 
                    onClick={()=>{window.open(`https://pancakeswap.finance/swap?outputCurrency=${pool?.lending_contract.address}`, `buy${pool?.detail.currency}`);}}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:cursor-pointer w-fit ml-auto mt-2"
                  >
                    Buy more {pool?.detail.currency}
                  </p>
                  
                  {showWagPair() && (
                    <div>
                      <p className='mt-2 text-center text-gray-500'>+</p>

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-4">
                        <div className='flex justify-between mb-2'>
                          <p className="text-sm font-medium text-gray-600">
                            Amount
                          </p>
                          <p className="text-sm font-medium text-gray-600">
                            Available: {numberWithCommas(getWagBalanceWithDecimal(), 2)} WAG
                          </p>
                        </div>
                        
                        <div className='flex gap-2 items-center justify-between'>
                          <input type="number" id="amount" 
                            min="0"
                            className="text-gray-900 bg-transparent border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none flex-1" 
                            value={wagNumber}
                            onChange={(e)=>{
                              setWagNumber(e.target.value)
                              setStableNumber((parseFloat(e.target.value) / getRatio()).toString())
                            }}
                            placeholder="0" required/>
                          <div className="flex items-center gap-2">
                            <img src="/logo.png" className="h-7" alt="Wagon Logo"/>
                            <p className="text-lg text-gray-500">
                              WAG
                            </p>
                            <Button
                              color="light"
                              size="xs"
                              onClick={() => {
                                setWagNumber(getWagBalanceWithDecimal())
                                setStableNumber((parseFloat(getWagBalanceWithDecimal()) / getRatio()).toString())
                              }}
                            >
                              Max
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p 
                        onClick={()=>{window.open(`https://pancakeswap.finance/swap?inputCurrency=${pool?.lending_contract.address}&outputCurrency=${pool?.pairing_contract.address}`, "buyWAG");}}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:cursor-pointer w-fit ml-auto mt-2"
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
                      <Label htmlFor="accept" className="ml-2 text-sm text-gray-600">
                        I accept the <Link href="/terms" className="text-blue-600 hover:text-blue-700">Terms and Conditions</Link>
                      </Label>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      color="dark"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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