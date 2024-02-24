import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { ImCross } from "react-icons/im"
import { numberWithCommas } from "../../../util/stringUtility";
import { erc20ABI, useAccount, useContractReads, useContractWrite, useNetwork, useSwitchNetwork, useWaitForTransaction } from 'wagmi';

import lendingABI from "../../../public/ABI/lending.json"
import { parseEther } from 'ethers/lib/utils.js';
import LendProcessDialog from './LendprocessDialog';
import { formatTime } from '../../../util/lendingUtility';

const wagContract = {
  address: process.env.WAG_ADDRESS_BNB,
  abi: erc20ABI,
}

export default function LendToPoolDialog(props) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [isOpen, setIsOpen] = useState(false)
  const [stableNumber,setStableNumber] = useState("")
  const [wagNumber,setWagNumber] = useState("")
  
  const [stablebalance, setStableBalance] = useState(0)
  const [wagBalance, setWagBalance] = useState(0)

  const poolDetail = props.poolDetail;
  const poolDetailErc1155 = props.poolDetailErc1155;
  const symbol = props.symbol;
  const fees = props.fees;

  const stableContract = {
    address: poolDetail?.lendingCurrency,
    abi: erc20ABI,
  }

  const { isLoading : isLoadingBalance, refetch : getBalance } = useContractReads({
    enabled:false,
    contracts: [
        {
          ...stableContract,
          functionName: 'balanceOf',
          args:[address]
        },
        {
          ...stableContract,
          functionName: 'decimals'
        },
        {
          ...wagContract,
          functionName: 'balanceOf',
          args:[address]
        },
        {
          ...wagContract,
          functionName: 'decimals'
        }
    ],
    onSuccess: (data) => {
      const stableDecimal = parseFloat(data[1]);
      setStableBalance(parseFloat(data[0]) / Math.pow(10, stableDecimal))
      const wagDecimal = parseFloat(data[3]);
      setWagBalance(parseFloat(data[2]) / Math.pow(10, wagDecimal))
    }
  })

  useEffect(()=>{
    if(isOpen) getBalance();
  }, [isOpen])

  const { data: dataAllowance, isLoading : isLoadingAllowance, refetch } = useContractReads({
    enabled:false,
    contracts: [
        {
          ...stableContract,
          functionName: 'allowance',
          args: [
            address,
            process.env.LENDING_ADDRESS_BNB
          ]
        },
        {
          ...wagContract,
          functionName: 'allowance',
          args: [
            address,
            process.env.LENDING_ADDRESS_BNB
          ]
        },
        {
          ...stableContract,
          functionName: 'decimals'
        },
        {
          ...wagContract,
          functionName: 'decimals'
        },
        
    ]
  })

  const ratio = parseFloat(poolDetail?.stabletoPairRate / Math.pow(10,18));

  function closeModal() {
    setIsOpen(false)
  }

  const { chains, error, isLoading : isLoadingSwitching, pendingChainId, switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
        
    },
    onError(data) {
        
    }
})

  function openModal() {
    // switch network
    if(chain.id != parseFloat(process.env.BNB_CHAIN_ID_TESTNET)) {
      switchNetwork(parseFloat(process.env.BNB_CHAIN_ID_TESTNET))
    } else {
      setStableNumber("")
      setWagNumber("")
      setIsOpen(true)
    }
  }

  function getExpectedInterest() {
    return numberWithCommas(stableNumber / poolDetail?.targetLoan * poolDetail?.targetInterestPerPayment * poolDetail?.paymentFrequency)
  }

  function getAdminFee() {
    return (stableNumber * parseFloat(fees.adminFee) / 10000);
  }

   // APPROVE STABLE ----- START -----

   const { data: dataApproveStable, isLoading: isLoadingApproveStable, write : writeApproveStable } = useContractWrite({
    ...stableContract,
    functionName: 'approve',
    args:[
          process.env.LENDING_ADDRESS_BNB,
          (dataAllowance == undefined) 
            ? 0
            : ((parseFloat(stableNumber) + getAdminFee()) * Math.pow(10, parseFloat(dataAllowance[2]))).toString()
        ]
  })

  const {isLoading : isLoadingWaitApproveStable} 
  = useWaitForTransaction({
    hash: dataApproveStable?.hash,
    onSuccess(data) {
      const wagDecimals = parseFloat(dataAllowance[3])
      const wagAllowance = parseFloat(dataAllowance[1] / Math.pow(10,wagDecimals));

      if(parseFloat(wagNumber) > wagAllowance) {
        writeApproveWag()
      } else {
        writeLendToPool()
      }
    }
  })

  // APPROVE STABLE ----- END -----

  // APPROVE WAG ----- START -----

  const { data: dataApproveWag, isLoading: isLoadingApproveWag, write : writeApproveWag } = useContractWrite({
    ...wagContract,
    functionName: 'approve',
    args:[
          process.env.LENDING_ADDRESS_BNB,
          parseEther(`${wagNumber == "" ? 0 : wagNumber}`).toString()
        ]
  })

  const {isLoading : isLoadingWaitApproveWag} 
  = useWaitForTransaction({
    hash: dataApproveWag?.hash,
    onSuccess(data) {
      writeLendToPool();
    }
  })

  // APPROVE WAG ----- END -----


  // LEND TO POOL ----- START -----

  const { data: dataLendToPool, isLoading: isLoadingLendToPool, write: writeLendToPool } = useContractWrite({
    address: process.env.LENDING_ADDRESS_BNB,
    abi: lendingABI,
    functionName: 'lendToPool',
    args:[
          props.poolId,
          (dataAllowance == undefined) 
            ? 0
            : (parseFloat(stableNumber) * Math.pow(10, parseFloat(dataAllowance[2]))).toString()
        ],
    onError(error) {
      console.log('Error', error.message)
    },
  })
  
  const {isLoading : isLoadingWaitLendToPool} 
  = useWaitForTransaction({
    hash: dataLendToPool?.hash,
    onSuccess(data) {
      closeModal();
    }
  })

  // LEND TO POOL ----- END -----

  async function lendToPool() {
    
    await refetch()
    // check allowance
    const stableDecimals = parseFloat(dataAllowance[2])
    const stableAllowance = parseFloat(dataAllowance[0] / Math.pow(10,stableDecimals));

    const wagDecimals = parseFloat(dataAllowance[3])
    const wagAllowance = parseFloat(dataAllowance[1] / Math.pow(10,wagDecimals));

    if(parseFloat(stableNumber) + getAdminFee() > stableAllowance) {
      writeApproveStable();
    } else if(parseFloat(wagNumber) > wagAllowance) {
      writeApproveWag();
    } else {
      writeLendToPool();
    }
  }

  return (
    <>
      <div>
        <button
          type="button"
          onClick={openModal}
          className="button-light"
        >
          Lend to Pool
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
                            Lend To Pool
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
                            Available: {numberWithCommas(stablebalance)} {symbol}
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <input type="number" id="amount" 
                            min="0"
                            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                            value={stableNumber == "" ? "" : stableNumber}
                            onChange={(e)=>{
                              setStableNumber(e.target.value)
                              setWagNumber(e.target.value * ratio)
                            }}
                            placeholder="0" required/>
                        <img src={poolDetailErc1155?.properties.currency_logo} className="h-7" alt="IDRT Logo"/>
                        <p className="text-lg text-gray-500">
                            {symbol}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setStableNumber(stablebalance)
                            setWagNumber(stablebalance * ratio)
                          }}
                          className="button-max text-sm"
                        >
                          Max
                        </button>
                    </div>
                  </div>

                  <p className='mt-4 text-center'>+</p>

                  <div className="mt-4 border rounded-xl p-4">
                    <div className='flex justify-between'>
                        <p className="text-xs font-semibold text-gray-500">
                            Amount
                        </p>
                        <p className="text-xs font-semibold text-gray-500">
                            Available: {numberWithCommas(wagBalance)} WAG
                        </p>
                    </div>
                    
                    <div className='flex gap-2 items-center justify-between mt-2'>
                        <input type="number" id="amount" 
                            min="0"
                            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none" 
                            value={wagNumber == "" ? "" : wagNumber}
                            onChange={(e)=>{
                              setWagNumber(e.target.value)
                              setStableNumber(e.target.value / ratio)
                            }}
                            placeholder="0" required/>
                        <img src="/logo.png" className="h-7" alt="Wagon Logo"/>
                        <p className="text-lg text-gray-500">
                            WAG
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setWagNumber(wagBalance)
                            setStableNumber(wagBalance / ratio)
                          }}
                          className="button-max text-sm"
                        >
                          Max
                        </button>
                    </div>
                  </div>

                  <div className="mt-6 border rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 border-b pb-4">
                        Expectation and pool maturity
                    </p>
                    
                    <div className='flex gap-2 items-center justify-between mt-4 text-center'>
                        <div>
                          <p className="text-xs">
                            {formatTime(parseFloat(poolDetail?.loanTerm))}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                              Loan Term
                          </p>
                        </div>
                        <div>
                          <p className="text-xs">
                            {numberWithCommas(getAdminFee())} {symbol}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Admin Fee
                          </p>
                        </div>
                        <div>
                          <p className="text-xs">
                              {getExpectedInterest()} {symbol}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                              Expected Interest
                          </p>
                        </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    {
                      <button
                          type="button"
                          className={
                            `button-light`
                          }
                          onClick={()=>{
                            lendToPool()
                          }}
                        >
                          Lend To Pool
                      </button>
                    }
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <LendProcessDialog 
        isOpen={
          isLoadingApproveStable || isLoadingWaitApproveStable || 
          isLoadingApproveWag || isLoadingWaitApproveWag || 
          isLoadingLendToPool || isLoadingWaitLendToPool } 
        number={stableNumber} 
        tokenName={symbol} 
        wagNumber={wagNumber} 
        poolName={poolDetailErc1155?.name} 
        title={
          isLoadingApproveStable || isLoadingApproveWag ? "Checking Allowance"
          : isLoadingWaitApproveStable || isLoadingWaitApproveWag ? "Approving Allowance"
          : isLoadingLendToPool || isLoadingWaitLendToPool ? "Lending To Pool"
          : "Processing"
        }/>
    </>
  )
}
