import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { numberWithCommas } from "../../../util/stringUtility";
import { Button } from 'flowbite-react';
import useUnstakeWagHook from '../utils/useUnstakeWagHook';
import { useWeb3WalletState } from '../../general/web3WalletContext';
import useSwitchNetworkHook from '../../../util/useSwitchNetworkHook';

export default function UnstakeDialog(props) {
  let [isOpen, setIsOpen] = useState(false)
  const [number, setNumber] = useState("")
  const { chainId } = useWeb3WalletState();

  const stakedBalance = props.stakedBalance;

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setNumber("")
    setIsOpen(true)
  }

  const { isLoading: isLoadingSwitchChain, switchChain } = useSwitchNetworkHook();
  const { isLoading: isLoadingUnstakeWag, fetchData: unstakeWag } = useUnstakeWagHook();
  
  async function handleUnstake() {
    try {
      const resultSwitchNetwork = await switchChain(chainId, process.env.ETH_CHAIN_ID);
      if (resultSwitchNetwork.error) {
          throw resultSwitchNetwork.error
      }
    } catch (error) {
      console.log(error)
      return
    }

    try {
      const resultUnstake = await unstakeWag(number)
      if (resultUnstake.error) {
          throw resultUnstake.error;
      }
      props.triggerFetch();
      closeModal();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="">
        <Button color={"light"} size={"sm"} style={{width:"100%"}}
          onClick={openModal}
        >
          Unstake
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
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                        >
                            Unstake
                        </Dialog.Title>
                        <button onClick={()=>closeModal()}>
                            <ImCross/>
                        </button>
                    </div>
                  
                  <div className="mt-4 border rounded-xl p-4">
                    <div className='flex justify-between'>
                        <p className="text-xs font-semibold text-gray-500">
                            Amount
                        </p>
                        <p className="text-xs font-semibold text-gray-500">
                            Available: {
                              stakedBalance == null
                                ? "~"
                                : numberWithCommas(parseFloat(stakedBalance) / 1e18, 2)
                            } WAG
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <input type="number" id="amount" 
                            min="0"
                            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                            value={number}
                            disabled={isLoadingSwitchChain || isLoadingUnstakeWag}
                            onChange={(e)=>{
                              setNumber(e.target.value)
                            }}
                            placeholder="0" required
                            />
                        <img src="/logo.png" className="h-7" alt="Wagon Logo"/>
                        <p className="text-lg text-gray-500">
                            WAG
                        </p>
                        <Button size={"xs"} color={"light"}
                          disabled={isLoadingSwitchChain || isLoadingUnstakeWag}
                          onClick={() => {
                            setNumber(parseFloat(stakedBalance) / 1e18)
                          }}
                        >
                          Max
                        </Button>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Button color={"failure"} size={"sm"} style={{width:"100%"}}
                      disabled={isLoadingSwitchChain || isLoadingUnstakeWag}
                      onClick={()=>{handleUnstake()}}
                    >
                      {
                        isLoadingUnstakeWag || isLoadingSwitchChain
                        ? "Loading"
                        : "Unstake"
                      }
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
