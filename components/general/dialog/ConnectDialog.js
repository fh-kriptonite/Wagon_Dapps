import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { Button } from 'flowbite-react';
import { SiGmail } from 'react-icons/si';
import { FaFacebook, FaWallet } from "react-icons/fa";import { useWeb3Auth } from '@web3auth/modal-react-hooks';
import { useWeb3Modal } from '@web3modal/ethers/react';

export default function ConnectDialog(props) {
  const [isOpen, setIsOpen] = useState(false)

  const { connect } = useWeb3Auth();
  const { open } = useWeb3Modal();

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true);
  }
  
  async function handleConnectSocialMedia() {
    try {
        closeModal();
        await connect();
    } catch (error) {
        console.warn(error)
    }
  }

  async function handleConnectWeb3() {
    try {
        closeModal();
        await open();
    } catch (error) {
        console.warn(error)
    }
  }

  return (
    <>
      <div>
        <Button
          onClick={openModal}
          color="dark"
          style={{borderRadius:"100px"}}
        >
          Connect Wallet
        </Button>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className='flex justify-between'>
                      <img src={"/logo.png"} className="h-6 w-6" alt="Wagon Logo"/>
                      <Dialog.Title
                          as="h3"
                          className="font-semibold text-center w-full"
                      >
                          Connect Wallet
                      </Dialog.Title>
                      <button onClick={()=>closeModal()}>
                          <ImCross/>
                      </button>
                    </div>
                  
                  <div className="mt-8 flex flex-col">
                    <p className="text-sm font-semibold text-center mt-4">
                      Connect with Social Media
                    </p>
                    <div className="flex gap-4 mt-4">
                      <div className="flex-1">
                        <Button onClick={handleConnectSocialMedia} color="light" style={{width:"100%"}}>
                          <div className="flex gap-4 rounded-xl justify-center items-center">
                            <SiGmail/>
                            <p className="text-sm ">
                                Gmail
                            </p>
                          </div>
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Button onClick={handleConnectSocialMedia} color="light" style={{width:"100%"}}>
                          <div className="flex gap-4 rounded-xl justify-center items-center">
                            <FaFacebook/>
                            <p className="text-sm ">
                                More Media
                            </p>
                          </div>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-center mt-8">
                      Connect with Crypto Wallet
                    </p>
                    <div className="mt-4">
                      <Button onClick={handleConnectWeb3} color="light" style={{width:"100%"}}>
                        <div className="flex gap-4 rounded-xl justify-center items-center">
                          <FaWallet/>
                          <p className="text-sm ">
                              Wallet Crypto
                          </p>
                        </div>
                      </Button>
                    </div>
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
