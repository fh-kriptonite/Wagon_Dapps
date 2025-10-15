import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ImCross } from "react-icons/im";
import { numberWithCommas, shortenAddress } from "../../../util/stringUtility";
import { List, Button } from 'flowbite-react';
import { MdOpenInNew } from 'react-icons/md';
import { IoIosWarning } from "react-icons/io";
import { HiArrowRight } from 'react-icons/hi2';

interface Profile {
  id: string;
  wallet_address: string;
  email: string;
  kyc_status: string;
  created_at: string;
  updated_at: string;
  status: number;
  full_name: string;
}

interface OnrampData {
  amount: number;
  currency: string;
  paymentUrl: string;
}

interface LendFiatConfirmationDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  stableNumber: string;
  profile: Profile | null;
  onrampData: OnrampData | null;
}

export default function LendFiatConfirmationDialog(props: LendFiatConfirmationDialogProps) {
  const { isOpen, closeModal, stableNumber, profile, onrampData } = props;

  const handleProceedToPayment = () => {
    if (onrampData?.paymentUrl) {
        window.open(onrampData.paymentUrl, '_blank');
    }
  };
  
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
                      Payment Instructions
                    </Dialog.Title>
                    <button 
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <ImCross className="w-4 h-4"/>
                    </button>
                  </div>
                  
                  <p className='text-base font-medium text-gray-900 mb-4'>Follow the payment link to transfer the fund</p>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className='mb-3'>
                      <p className='text-sm text-gray-600'>Transfer Amount</p>
                      <p className='mt-1 text-lg font-semibold text-gray-900'>Rp {numberWithCommas(onrampData?.amount)}</p>
                    </div>

                    <hr className="my-3 h-px bg-gray-200 border-0" />

                    <div className='mb-3'>
                      <p className='text-sm text-gray-600'>Account Name</p>
                      <p className='mt-1 text-lg font-semibold text-gray-900'>{profile?.full_name}</p>
                      <div className='flex gap-2 items-center mt-2'>
                        <IoIosWarning className="text-amber-500 w-4 h-4"/>
                        <p className='text-sm text-gray-600'>Bank account name must match your account</p>
                      </div>
                    </div>

                    <hr className="my-3 h-px bg-gray-200 border-0" />

                    <div className='mb-3'>
                      <p className='text-sm text-gray-600'>Wallet Address</p>
                      <p className='mt-1 text-lg font-semibold text-gray-900'>{shortenAddress(profile?.wallet_address, 8)}</p>
                    </div>
                    
                    <hr className="my-3 h-px bg-gray-200 border-0" />
                    
                    <div className=''>
                      <p className='text-sm text-gray-600'>Payment Link</p>
                      <a 
                        href={onrampData?.paymentUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <p className='text-sm truncate'>{onrampData?.paymentUrl}</p>
                        <MdOpenInNew className="w-4 h-4"/>
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <List className='space-y-2'>
                      <List.Item className="text-xs text-gray-600">
                        Some of the transfer amount will be cut for onramp and gas fee.
                      </List.Item>
                      <List.Item className="text-xs text-gray-600">
                        If the transfer amount or bank account name doesn't match, please contact our Customer Support immediately for a refund (processed within 15 working days).
                      </List.Item>
                      <List.Item className="text-xs text-gray-600">
                        Please note that Wagon needs approximately 1-2 business days to process your payment and update your lending status.
                      </List.Item>
                    </List>

                    <hr className="my-4 h-px bg-gray-200 border-0" />

                    <div className="flex items-center gap-2">
                      <p className='text-xs text-gray-600'>
                        Contact Customer Support:
                      </p>
                      <a 
                        className='text-blue-600 hover:text-blue-700 transition-colors' 
                        target="_blank"
                        rel="noopener noreferrer"
                        href='https://t.me/wagon_network'
                      >
                        @wagon_network
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                        color="dark"
                        onClick={handleProceedToPayment}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2"
                    >
                        Proceed to Payment
                        <HiArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                        color="light"
                        onClick={closeModal}
                        className="w-full hover:bg-gray-50 transition-colors"
                    >
                        Done
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