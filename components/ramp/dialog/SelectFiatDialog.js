import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { IoIosArrowDown } from "react-icons/io";

import fiatJson from "../../../public/files/rampFiat.json"

export default function SelectFiatDialog(props) {

  const fiat = props.fiat;
  
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  
  return (
    <>
      <div>
        <div className="flex gap-2 items-center hover:cursor-pointer pr-4"
          onClick={openModal}
        >
            <img src={fiat?.logo} className="h-10 w-10 rounded-full border-2" alt="Fiat Logo" />
            <p className="text-sm font-semibold">
              {
                fiat == null 
                ? "Select"
                : fiat.name
              }
            </p>
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
                          Fiat
                      </Dialog.Title>
                      <button onClick={()=>closeModal()}>
                          <ImCross/>
                      </button>
                  </div>

                  <div className='h-[360px] mt-6 overflow-auto'>
                    {
                      fiatJson.map((fiat, index) => {
                        return (
                          <div 
                            key={props.id + "_" + fiat.name}
                            className='px-2 py-3 flex items-center gap-4 hover:cursor-pointer'
                            onClick={() => {
                              props.setFiat(fiat);
                              closeModal();
                            }}
                          >
                            <img src={fiat.logo} className="h-7 border" alt="Wagon Logo"/>
                            <div>
                              <p className='text-sm font-bold'>{fiat.name}</p>
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
