import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ImCross } from "react-icons/im"
import { numberWithCommas } from "../../../util/stringUtility";
import { List } from 'flowbite-react';
import { useAccount } from '@particle-network/connectkit';
import { MdOpenInNew } from 'react-icons/md';
import { IoIosWarning } from "react-icons/io";

export default function LendFiatConfirmationDialog(props) {
  const address = useAccount();
  
  const isOpen = props.isOpen;
  const closeModal = props.closeModal;
  const stableNumber = props.stableNumber;
  const profile = props.profile;

  const onrampData = props.onrampData;
  
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
                  
                  <p className='mt-4 text-base font-semibold'>Follow the payment link to transfer the fund</p>

                  <div className="mt-2 border rounded-xl p-3">
                    <div className=''>
                        <p className='text-xs'>Transfer Amount</p>
                        <p className='mt-1 text-sm font-semibold'>Rp {numberWithCommas(onrampData?.amount)}</p>
                    </div>

                    <hr class="my-2 h-0.5 border-t-0 bg-neutral-100" />

                    <div className=''>
                        <p className='text-xs'>Account Name</p>
                        <p className='mt-1 text-sm font-semibold'>{profile?.full_name}</p>
                        <div className='flex gap-1 items-center mt-1'>
                          <IoIosWarning color='orange' size={16}/>
                          <p className='text-xs'>Bank account name must match your account</p>
                        </div>
                    </div>
                    
                    <hr class="my-2 h-0.5 border-t-0 bg-neutral-100" />
                    
                    <div className=''>
                        <p className='text-xs'>Payment Link</p>
                        <a href={onrampData?.paymentUrl} target={onrampData?.paymentUrl}
                          className="mt-1 flex items-center gap-1 text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
                        >
                          <p className='text-xs w-full overflow-hidden'>{onrampData?.paymentUrl}</p>
                          <MdOpenInNew size={16} className="text-blue-500 hover:text-blue-800"/>
                        </a>
                    </div>
                  </div>

                  <div className="mt-2 border rounded-xl p-3">
                    <List className='text-xs px-3'>
                      <List.Item>Some of the transfer amount will be cut for onramp and gas fee.</List.Item>
                      <List.Item>If the transfer amount or bank account name doesnt match, please contact our Customer Support immediately for a refund (processed within 15 working days).</List.Item>
                    </List>

                    <hr class="mt-3 mb-2 h-0.5 border-t-0 bg-neutral-100" />

                    <p className='text-xs'>
                      Contact Customer Support: <span>
                        <a className='text-blue-500' 
                          target='https://t.me/wagon_network' href='https://t.me/wagon_network'>
                            @wagon_network
                        </a>
                      </span>
                    </p>

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
