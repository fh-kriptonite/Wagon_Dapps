import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { ImCross } from "react-icons/im"
import { AiFillBank } from 'react-icons/ai';
import { BiQrScan } from 'react-icons/bi';

export default function ConfirmationLendToPoolFiatDialog(props) {
  
  const isOpen = props.isOpen;
  const closeModal = props.closeModal;
  
  useEffect(()=>{
    if (isOpen) {
      
    }
  }, [isOpen])

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
                          Choose Method
                      </Dialog.Title>
                      <button onClick={()=>closeModal()}>
                          <ImCross/>
                      </button>
                  </div>

                  <ul className="pt-2 mt-2 space-y-2 font-medium text-sm">
                    <li>
                      <div className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                        <AiFillBank className='w-5 h-5 text-gray-500'/>
                        <span className="mx-auto">Virtual Account</span>
                      </div>
                    </li>
                    <li>
                      <div className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                        <BiQrScan className='w-5 h-5 text-gray-500'/>
                        <span className="mx-auto">QRIS</span>
                      </div>
                    </li>
                </ul>
                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
