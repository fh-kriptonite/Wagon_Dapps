import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { inputNumberFilter, numberWithCommas } from "../../../util/stringUtility";
import { Button } from 'flowbite-react';
import { Pool, PoolFee } from '../types';

interface SellPoolDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  pool: Pool | null;
  fees: PoolFee | null;
  stableBalance: string | null;
  handleSell: (stableNumber: string) => void;
}

export default function SellPoolDialog(props: SellPoolDialogProps) {
  const [stableNumber, setStableNumber] = useState<string>("")
  
  const isOpen = props.isOpen;
  const closeModal = props.closeModal;
  const pool = props.pool;
  
  const stableBalance = props.stableBalance;
  
  function handleSell(): void {
    props.handleSell(stableNumber);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const rawValue = inputNumberFilter(e.target.value);
    setStableNumber(rawValue)
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
                      List Token for Sale
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
                        Token Amount
                      </p>
                      <p className="text-sm font-medium text-gray-600">
                        Available: {numberWithCommas(stableBalance || 0, 2)} tokens
                      </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between'>
                      <input type="text"
                        className="text-gray-900 bg-transparent border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none flex-1" 
                        value={numberWithCommas(stableNumber)}
                        onChange={handleChange}
                        placeholder="0" required/>
                      <div className="flex items-center gap-2">
                        <p className="text-lg text-gray-500">
                          Token
                        </p>
                        <Button
                          color="light"
                          size="xs"
                          onClick={() => {
                            setStableNumber(stableBalance?.toString() || "0")
                          }}
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm font-medium text-gray-600 border-b pb-2 mb-4">
                      Transaction Details
                    </p>
                    
                    <div className='flex gap-2 items-center justify-between mb-3'>
                      <p className="text-sm text-gray-600">
                        Token Amount
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {numberWithCommas(stableNumber)} tokens
                      </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between mb-3'>
                      <p className="text-sm text-gray-600">
                        Token Price
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        1 {pool?.detail.currency}
                      </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between mb-3 border-b pb-2'>
                      <p className="text-sm text-gray-600">
                        Platform Fee (0.25%)
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        Free
                      </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between'>
                      <p className="text-sm text-gray-600">
                        Receive
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {numberWithCommas(stableNumber)} {pool?.detail.currency}
                      </p>
                    </div>
                  </div>

                  <p className='text-xs text-gray-600 mt-6'>
                    Your listing will be visible to all investors in the secondary market until sold or canceled.
                  </p>

                  <div className="mt-4">
                    <Button
                      color="dark"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={false}
                      onClick={handleSell}
                    >
                      List for Sale
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