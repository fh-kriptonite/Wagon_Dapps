import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"

import { 
  useAccount, 
  useContractReads, 
  useContractWrite, 
  useNetwork, 
  usePrepareContractWrite, 
  useWaitForTransaction } from 'wagmi'

import erc20ABI from "../../../public/ABI/erc20.json";
import stakingABI from "../../../public/ABI/staking.json";
import { numberWithCommas } from "../../../util/stringUtility";

export default function StakeDialog(props) {
  const [isOpen, setIsOpen] = useState(false)
  const [number,setNumber] = useState("")

  const { chain } = useNetwork()

  const stakingContract = {
    address: (chain?.id == 1) ? process.env.WAGON_STAKING_PROXY : process.env.WAGON_STAKING_PROXY_BASE_GOERLI,
    abi: stakingABI,
}

  const wagonContract = {
    address: (chain?.id == 1) ? process.env.WAG_ADDRESS : process.env.WAG_ADDRESS_BASE_GOERLI,
    abi: erc20ABI,
  }

  function closeModal() {
    setIsOpen(false)
    refetch()
  }

  function openModal() {
    setNumber("")
    refetch()
    setIsOpen(true)
  }

  const { address } = useAccount();

  const { data, isError, isLoading, isSuccess, refetch } = useContractReads({
      contracts: [
          {
            ...wagonContract,
            functionName: 'balanceOf',
            args: [address],
            watch: true,
          },
          {
            ...wagonContract,
            functionName: 'allowance',
            args: [address, process.env.WAGON_STAKING_PROXY],
            watch: true,
          }
      ]
  })

  let { config } = usePrepareContractWrite({
    ...stakingContract,
    functionName: 'stake',
    args: [number.toLocaleString('fullwide', { useGrouping: false })]
  })

  let { config: configAllowance } = usePrepareContractWrite({
    ...wagonContract,
    functionName: 'approve',
    args: [process.env.WAGON_STAKING_PROXY, number.toLocaleString('fullwide', { useGrouping: false })],
  })

  const {
    data : useContractWriteData, 
    error: errorWrite, 
    isError: isErrorWrite,  
    isLoading : useContractWriteLoading, 
    write 
  } = useContractWrite(config)

  const {
    data : useContractWriteDataAllowance, 
    error: errorWriteAllowance, 
    isError: isErrorWriteAllowance,  
    isLoading : useContractWriteLoadingAllowance, 
    write : writeAllowance 
  } = useContractWrite(configAllowance)

  const {
    data : useWaitForTransactionData, 
    isLoading : useWaitForTransactionLoading, 
    isSuccess : useWaitForTransactionSuccess
  } = useWaitForTransaction({
      hash: useContractWriteData?.hash,
      onSuccess(data) {
        closeModal();
        props.triggerFetch();
      }
    })

  const {
    data : useWaitForTransactionDataAllowance, 
    isLoading : useWaitForTransactionLoadingAllowance, 
    isSuccess : useWaitForTransactionSuccessAllowance
  } = useWaitForTransaction({
      hash: useContractWriteDataAllowance?.hash,
      onSuccess(data) {
        refetch();
      }
    })

  return (
    <>
      <div>
        <button
          type="button"
          onClick={openModal}
          className="button-light"
        >
          Stake
        </button>
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
                            Available: { 
                              isLoading 
                                ? "~"
                                : isSuccess 
                                  ? numberWithCommas(data[0]/1e18) 
                                  : "-"
                            } WAG
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <input type="number" id="amount" 
                            min="0"
                            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                            value={number == "" ? "" : number / Math.pow(10,18)}
                            onChange={(e)=>{
                              setNumber(e.target.value * Math.pow(10, 18))
                            }}
                            placeholder="0" required/>
                        <img src="/logo.png" className="h-7" alt="Wagon Logo"/>
                        <p className="text-lg text-gray-500">
                            WAG
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setNumber(data[0])
                          }}
                          className="button-max text-sm"
                        >
                          Max
                        </button>
                        
                    </div>
        
                  </div>

                  <div className="mt-4 text-center">
                    {
                      isSuccess && parseFloat(number) > data[1]
                        ? <button
                            type="button"
                            className={
                              (useContractWriteLoadingAllowance || useWaitForTransactionLoadingAllowance || !writeAllowance ) 
                              ? `button-light !bg-gray-300`
                              : `button-light`
                            }
                            disabled={(useContractWriteLoadingAllowance || useWaitForTransactionLoadingAllowance || !writeAllowance)}
                            onClick={()=>{
                              writeAllowance?.()
                            }}
                          >
                            Allow
                        </button>
                        :<button
                          type="button"
                          className={
                            (!isSuccess || useContractWriteLoading || useWaitForTransactionLoading || !write || parseFloat(number) <= 0) 
                            ? `button-light !bg-gray-300`
                            : `button-light`
                          }
                          disabled={(useContractWriteLoading || useWaitForTransactionLoading || !write) || parseFloat(number) <= 0}
                          onClick={()=>{write?.()}}
                        >
                          Stake
                      </button>
                    }
                    {
                      ((isErrorWrite) && data[1] > 0 || (isErrorWriteAllowance && isErrorWriteAllowance.message != "")) && (
                        <div className='mt-2 text-red-500 text-xs'>{(errorWrite || errorWriteAllowance)?.message}</div>
                      )
                    }
                    
                  </div>

                  {
                    (useContractWriteLoading || useWaitForTransactionLoading) &&
                    <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                      <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
