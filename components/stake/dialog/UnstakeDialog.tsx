import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { convertTime, numberWithCommas } from "../../../util/stringUtility";
import { Button } from 'flowbite-react';
import useSwitchNetworkHook from '../utils/useSwitchNetworkHook';
import useUnstakeWagHook from '../utils/useUnstakeWagHook';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import useChainHook from '../../../util/useChainHook';
import { HiLockClosed } from "react-icons/hi2";

interface UnstakeDialogProps {
  stakedBalance: string;
  claimableDuration: string | null;
  triggerFetch: () => void;
}

export default function UnstakeDialog(props: UnstakeDialogProps) {
  const stakedBalance = props.stakedBalance;
  const {connectedAddress: address} = useConnectedAddress();
  const claimableDuration = props.claimableDuration;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [number, setNumber] = useState<string>("");
  const [showButton, setShowButton] = useState<number>(0);

  const { fetchData: switchNetwork } = useSwitchNetworkHook();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setNumber("");
    setShowButton(0);
    setIsOpen(true);
  }

  function isNextButtonDisabled(): boolean {
    if(stakedBalance === "0") return true;
    if(number === "") return true;
    if(parseFloat(number) === 0) return true;
    if(isLoading) return true;
    return false;
  }

  const { isLoading, fetchData: getChain } = useChainHook();

  async function checkNetwork() {
    if(number === "") return;
    if(parseFloat(number) === 0) return;
    const chainId = (await getChain()).data;
    if (!chainId) return;
    if (!address) return;
    if(chainId !== Number(process.env.ETH_CHAIN_ID)) {
      try {
        const resultSwitchNetwork = await switchNetwork(Number(process.env.ETH_CHAIN_ID));
        if (resultSwitchNetwork.error) {
            throw resultSwitchNetwork.error;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
    setShowButton(1);
  }

  const { isLoading: isLoadingUnstakeWag, isWaitingApproval: isWaitingApprovalUnstakeWag, fetchData: unstakeWag } = useUnstakeWagHook();

  async function handleUnstake() {
    try {
      const resultUnstake = await unstakeWag(number);
      if (resultUnstake.error) {
          throw resultUnstake.error;
      }
      props.triggerFetch();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div>
        <Button
          color='dark'
          size='sm'
          onClick={openModal}
          className="w-full"
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
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
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
                      Unstake WAG
                    </Dialog.Title>
                    <button 
                      onClick={()=>closeModal()}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <ImCross className="w-4 h-4"/>
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className='flex justify-between mb-2'>
                      <p className="text-sm font-medium text-gray-600">
                        Amount to Unstake
                      </p>
                      <p className="text-sm font-medium text-gray-600">
                        Staked: { numberWithCommas(parseFloat(stakedBalance) / 1e18) } WAG
                      </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between'>
                      <input 
                        type="number" 
                        id="amount" 
                        min="0"
                        className="text-gray-900 bg-transparent border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none flex-1" 
                        value={number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                          setNumber(e.target.value);
                        }}
                        disabled={(showButton === 0 ? false : true)}
                        placeholder="0" 
                        required
                      />
                      <div className="flex items-center gap-2">
                        <img src="/logo.png" className="h-7" alt="Wagon Logo"/>
                        <p className="text-lg text-gray-500">
                          WAG
                        </p>
                        <Button 
                          size={"xs"} 
                          color={"light"}
                          onClick={() => {
                            setNumber((parseFloat(stakedBalance) / 1e18).toString());
                          }}
                          disabled={(showButton === 0 ? false : true)}
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-between items-center mt-6 p-4 bg-blue-50 rounded-xl'>
                    <div className="flex items-center gap-2">
                      <HiLockClosed className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-medium text-gray-600">
                        Unstake Period
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      { claimableDuration === null ? "~" : convertTime(parseFloat(claimableDuration)) }
                    </p>
                  </div>
                  
                  <div className='mt-6'>
                    <div className={`${showButton === 0 ? "block" : "hidden"}`}>
                      <Button 
                        color={"dark"} 
                        size={"sm"} 
                        className="w-full disabled:bg-gray-300"
                        disabled={isNextButtonDisabled()}
                        onClick={()=>{checkNetwork()}}
                      >
                        Next
                      </Button>
                    </div>
                    <div className={`${showButton === 1 ? "block" : "hidden"}`}>
                      <Button 
                        color={"dark"} 
                        size={"sm"} 
                        className="w-full disabled:bg-gray-300"
                        disabled={isLoadingUnstakeWag}
                        onClick={()=>{handleUnstake()}}
                      >
                        {
                          isLoadingUnstakeWag
                          ? "Unstaking..."
                          : "Unstake"
                        }
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
  );
} 