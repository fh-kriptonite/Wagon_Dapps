import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { numberWithCommas } from "../../../util/stringUtility";
import { Button } from 'flowbite-react';
import useSwitchNetworkHook from '../utils/useSwitchNetworkHook';
import useUnstakeWagHook from '../utils/useUnstakeWagHook';
import useChainHook from '../../../util/useChainHook';

interface UnstakeDialogProps {
  fetch: boolean;
  stakedBalance: string;
  triggerFetch: () => void;
}

interface ChainResult {
  data: number | null;
  error?: string;
}

interface UnstakeResult {
  error?: string;
}

export default function UnstakeDialog(props: UnstakeDialogProps) {
  const { stakedBalance, triggerFetch } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [number, setNumber] = useState<string>("");
  const [showButton, setShowButton] = useState<number>(0);

  const { fetchData: switchNetwork } = useSwitchNetworkHook();
  const { isLoading, isWaitingApproval, fetchData: unstakeWag } = useUnstakeWagHook();
  const { fetchData: getChain } = useChainHook();

  function closeModal(): void {
    setIsOpen(false);
  }

  function openModal(): void {
    setNumber("");
    setShowButton(0);
    setIsOpen(true);
  }

  function isNextButtonDisabled(): boolean {
    if(number === "") return true;
    if(parseFloat(number) === 0) return true;
    if(isLoading) return true;
    if(parseFloat(number) > parseFloat(stakedBalance) / 1e18) return true;
    return false;
  }

  async function handleUnstake(): Promise<void> {
    try {
      const chainIdResult = await getChain() as ChainResult;
      if (!chainIdResult.data) {
        throw new Error("Failed to get chain ID");
      }

      if(chainIdResult.data !== Number(process.env.ETH_CHAIN_ID)) {
        try {
          const resultSwitchNetwork = await switchNetwork(Number(process.env.ETH_CHAIN_ID));
          if (resultSwitchNetwork.error) {
              throw resultSwitchNetwork.error
          }
        } catch (error) {
          console.log(error)
          return
        }
      }

      const resultUnstake = await unstakeWag(number) as UnstakeResult;
      if (resultUnstake.error) {
        throw new Error(resultUnstake.error);
      }

      closeModal();
      triggerFetch();
    } catch (error) {
      console.error(error);
    }
  }

  function handleShowButton(): boolean {
    if(isWaitingApproval) return false;
    return true;
  }

  return (
    <>
      <Button color={"light"} size={"sm"} style={{width:"100%"}}
          onClick={openModal}
        >
          Unstake
      </Button>

      <Transition appear show={isOpen && handleShowButton()} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                            disabled={isLoading}
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
                          disabled={isLoading}
                          onClick={() => {
                            setNumber((parseFloat(stakedBalance) / 1e18).toString())
                          }}
                        >
                          Max
                        </Button>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Button color={"failure"} size={"sm"}
                      className="w-full disabled:bg-gray-300"
                      disabled={isNextButtonDisabled()}
                      onClick={()=>{handleUnstake()}}
                    >
                      {
                        isLoading
                        ? "Unstaking..."
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