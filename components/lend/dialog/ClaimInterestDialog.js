import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Spinner } from 'flowbite-react';
import { numberWithCommas } from '../../../util/stringUtility';

export default function ClaimInterestDialog(props) {

  const isOpen = props.isOpen;
  const number = props.number;
  const tokenName = props.tokenName;
  const lockedWag = props.lockedWag;
  const poolName = props.poolName;
  const title = props.title;
  const isLastClaim = props.isLastClaim;

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
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className='text-center'>
                    <Spinner size={"xl"}/>
                  </div>
                  
                  <div className='flex justify-center mt-4'>
                      <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                      >
                          {title}
                      </Dialog.Title>
                  </div>

                  <div className='mt-6 overflow-auto'>
                    <p className='text-sm text-center'>
                      {
                        isLastClaim
                        ? `Claiming ${numberWithCommas(number)} ${tokenName} and ${lockedWag} WAG from ${poolName}.`
                        : `Claiming ${numberWithCommas(number)} ${tokenName} from ${poolName}.`
                      }
                    </p>
                    <p className='text-xs text-center mt-6'>
                      Please check your wallet for transaction prompt.
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
