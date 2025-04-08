import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { convertTime, numberWithCommas } from "../../../util/stringUtility";
import { Button } from 'flowbite-react';
import useGetWagAllowanceHook from '../utils/useGetWagAllowanceHook';
import useApproveAllowanceHook from '../utils/useApproveAllowanceHook';
import useSwitchNetworkHook from '../utils/useSwitchNetworkHook';
import useStakeWagHook from '../utils/useStakeWagHook';
import { useAccount } from '@particle-network/connectkit';
import useChainHook from '../../../util/useChainHook';

interface StakeDialogProps {
  balance: string;
  claimableDuration: string | null;
  triggerFetch: () => void;
}

export default function StakeDialog(props: StakeDialogProps) {
  const balance = props.balance;
  const address = useAccount();
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
    if(balance === "0") return true;
    if(number === "") return true;
    if(parseFloat(number) === 0) return true;
    if(isLoading) return true;

    return false;
  }

  const { error, isLoading, fetchData: getAllowance } = useGetWagAllowanceHook();
  const { fetchData: getChain } = useChainHook();

  async function checkAllowance() {
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

    const response = await getAllowance(address);
    if(error) {
      console.log(error);
      return;
    }
    var amount = response?.toString().split(',')[2];
    if (!amount) amount = "0";
    if(parseFloat(amount) / 1e18 < parseFloat(number)) {
      setShowButton(1);
    } else {
      setShowButton(2);
    }
  }

  const { isLoading: isLoadingApproveAllowance, fetchData: approveAllowance } = useApproveAllowanceHook();

  async function handleApprove() {
    try {
      const resultApprove = await approveAllowance(number);
      if (resultApprove.error) {
          throw resultApprove.error;
      }
      setShowButton(2);
    } catch (error) {
      console.log(error);
    }
  }

  const { isLoading: isLoadingStakeWag, fetchData: stakeWag } = useStakeWagHook();

  async function handleStake() {
    try {
      const resultStake = await stakeWag(number);
      if (resultStake.error) {
          throw resultStake.error;
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
          Stake
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
                            Stake
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
                            Available: { numberWithCommas(parseFloat(balance) / 1e18) } WAG
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <input type="number" id="amount" 
                            min="0"
                            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                            value={number}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                              setNumber(e.target.value);
                            }}
                            disabled={(showButton === 0 ? false : true)}
                            placeholder="0" required/>
                        <img src="/logo.png" className="h-7" alt="Wagon Logo"/>
                        <p className="text-lg text-gray-500">
                            WAG
                        </p>
                        <Button size={"xs"} color={"light"}
                          onClick={() => {
                            setNumber((parseFloat(balance) / 1e18).toString());
                          }}
                          disabled={(showButton === 0 ? false : true)}
                        >
                          Max
                        </Button>
                    </div>

                  </div>

                  <div className='flex justify-between  mt-4'>
                    <p className="text-xs font-semibold">
                      Unstake Period
                    </p>
                    <p className="text-xs font-semibold">
                      { claimableDuration === null ? "~" : convertTime(parseFloat(claimableDuration)) }
                    </p>
                  </div>
                  
                  <div className='mt-4'>
                    <div className={`${showButton === 0 ? "block" : "hidden"}`}>
                      <Button color={"dark"} size={"sm"} 
                        className="w-full disabled:bg-gray-300"
                        disabled={isNextButtonDisabled()}
                        onClick={()=>{checkAllowance()}}
                      >
                        Next
                      </Button>
                    </div>
                    <div className={`${showButton === 1 ? "block" : "hidden"}`}>
                      <Button color={"dark"} size={"sm"} 
                        className="w-full disabled:bg-gray-300"
                        disabled={isLoadingApproveAllowance}
                        onClick={()=>{handleApprove()}}
                      >
                        {
                          isLoadingApproveAllowance
                          ? "Approving..."
                          : "Approve"
                        }
                      </Button>
                    </div>
                    <div className={`${showButton === 2 ? "block" : "hidden"}`}>
                      <Button color={"dark"} size={"sm"} 
                        className="w-full disabled:bg-gray-300"
                        disabled={isLoadingStakeWag}
                        onClick={()=>{handleStake()}}
                      >
                        {
                          isLoadingStakeWag
                          ? "Staking..."
                          : "Stake"
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