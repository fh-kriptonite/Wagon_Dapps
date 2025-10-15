import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ImCross } from "react-icons/im"
import { Button } from 'flowbite-react';
import { numberWithCommas } from '../../../util/stringUtility';
import { Pool } from '../types';

interface ConfirmationSellPoolDialogProps {
  poolId: string;
  isOpen: boolean;
  pool: Pool;
  closeModal: () => void;
  refreshUser: () => void;
  stableNumber: string;
}

export default function ConfirmationSellPoolDialog(props: ConfirmationSellPoolDialogProps) {
  const {
    isOpen,
    pool,
    closeModal,
    refreshUser,
    stableNumber,
  } = props;

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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className='flex justify-between items-center mb-6'>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900"
                    >
                      Confirming List for Sale
                    </Dialog.Title>
                    <button 
                      onClick={()=>closeModal()}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <ImCross className="w-4 h-4"/>
                    </button>
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
                    Once listed, your tokens will remain in your wallet until purchased by another investor.
                  </p>

                  <p className='text-xs text-gray-600 mt-1'>
                    When purchased, the tokens will be transferred to the buyer and you will receive the sale amount.
                  </p>

                  <div className="mt-4">
                    <Button
                      color="dark"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={false}
                      onClick={()=>{}}
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
  );
} 