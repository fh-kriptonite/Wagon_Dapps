import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { IoIosArrowDown } from "react-icons/io";

import tokenJson from "../../../public/files/rampToken.json"

export default function SelectTokenDialog(props) {

  const token = props.token;
  const tokenIndex = props.index;
  
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  
  return (
    <>
      <div className='flex justify-end'>
        <div className="flex gap-2 items-center hover:cursor-pointer"
          onClick={openModal}
        >
            {
              token &&
              <div className='relative h-10 w-10'>
                <img src={token?.logo} className="h-10 w-10 rounded-full border-2" alt="Token Logo" />
                <div className='absolute -bottom-2 -right-2 bg-white rounded-full overflow-hidden border-2'>
                  <img src={token?.network_logo} className="h-6 w-6 p-1" alt="Token Logo" />
                </div>
              </div>
            }
            <p className="text-sm font-semibold">
              {
                token == null 
                ? "Select"
                : token.name
              }
            </p>  
            <IoIosArrowDown/>
        </div>
      </div>

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
                  <div className='flex justify-between'>
                      <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                      >
                          Token
                      </Dialog.Title>
                      <button onClick={()=>closeModal()}>
                          <ImCross/>
                      </button>
                  </div>

                  <div className='h-[360px] mt-6 overflow-auto'>
                    {
                      tokenJson.map((token) => {
                        return (
                          <div 
                            key={props.id + "_" + token.name}
                            className='px-2 py-3 flex items-center gap-6 hover:cursor-pointer'
                            onClick={() => {
                              props.replaceToken(tokenIndex, token);
                              closeModal();
                            }}
                          >
                            <div className='relative h-10 w-10'>
                              <img src={token.logo} className="h-10 w-10 rounded-full border-2" alt="Token Logo" />
                              <div className='absolute -bottom-2 -right-2 bg-white rounded-full overflow-hidden border-2'>
                                <img src={token.network_logo} className="h-6 w-6 p-1" alt="Token Logo" />
                              </div>
                            </div>
                            <div>
                              <p className='text-sm font-bold'>{token.name} ({token.network})</p>
                            </div>
                          </div>
                        )
                      })
                    }
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
