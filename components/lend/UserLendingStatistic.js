// pages/[postId].js
import { useRouter } from 'next/router';
import { Button } from 'flowbite-react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import ButtonConnect from '../../components/general/ButtonConnect';
import LendToPoolDialog from '../../components/lend/dialog/LendToPoolDialog';
import { useEffect, useState } from "react";

import lendingABI from "../../public/ABI/lending.json";

import { formatDate, numberWithCommas } from '../../util/stringUtility';
import ClaimInterestDialog from '../../components/lend/dialog/ClaimInterestDialog';
import ConfirmationClaimInterestDialog from './dialog/ConfirmationClaimInterestDialog';
import { getOnGoingPoolUserBalanceService, getUserBalanceService } from '../../services/service_lending';

const lendingContract = {
  address: process.env.LENDING_ADDRESS_BNB,
  abi: lendingABI,
}

export default function UserLendingStatistic(props) {
    const { isConnected, address } = useAccount();
    const router = useRouter();
    const { poolId } = router.query;

    const isLoading = props.isLoading;
    const poolDetail = props.poolDetail;
    const poolDetailErc1155 = props.poolDetailErc1155;
    const symbol = props.symbol;
    const decimal = props.decimal;

    const [stableBalance, setStableBalance] = useState(0)
    const [lockedWag, setLockedWag] = useState(0)
    const [latestInterestClaimed, setLatestInterestClaimed] = useState(0);
    const [interestSharePerPayment, setInterestSharePerPayment] = useState(0);
    const [claimableInterestAmount, setClaimableInterestAmount] = useState(0);
    const [repayments, setRepayments] = useState([]);
    const [showClaimDialog, setShowClaimDialog] = useState(false)
    const [fees, setFees] = useState(null);
    
    const [isLoadingUserDetail, setIsLoadingUserDetail] = useState(false);
    const [isLoadingOnGoingUserDetail, setIsLoadingOnGoingUserDetail] = useState(false);

    const [loadingImage, setLoadingImage] = useState(true);
    const [errorImage, setErrorImage] = useState(false);

    const handleImageLoaded = () => {
        setLoadingImage(false);
    };

    const handleImageError = () => {
        setLoadingImage(false);
        setErrorImage(true);
    };

    async function getUserBalance() {
        setIsLoadingUserDetail(true)
        try {
            const response = await getUserBalanceService(address, poolId);
    
            setStableBalance(parseFloat(response.stableBalance) / Math.pow(10,decimal));
            setLockedWag(parseFloat(response.wagLocked) / Math.pow(10,18));
            setFees(response.fees)
            console.log(response)

            setIsLoadingUserDetail(false)
        } catch (error) {
            console.log(error)
            setIsLoadingUserDetail(false)
        }
    }

    async function getOnGoingUserBalance() {
        setIsLoadingOnGoingUserDetail(true)
        try {
            const response = await getOnGoingPoolUserBalanceService(address, poolId);
    
            setLatestInterestClaimed(parseFloat(response.latestInterestClaimed))
            setInterestSharePerPayment(parseFloat(response.interestAmountShare / Math.pow(10, decimal)))
            setClaimableInterestAmount(parseFloat(response.claimableInterestAmount / Math.pow(10, decimal)))
            
            setIsLoadingOnGoingUserDetail(false)
        } catch (error) {
            console.log(error)
            setIsLoadingOnGoingUserDetail(false)
        }
    }

    useEffect(()=>{
        if(poolId != null) {
            getUserBalance();
            getOnGoingUserBalance();
        }
    }, [poolId, address])

    useEffect(()=>{
        if(poolDetail != null) {
            setRepayments(new Array(parseFloat(poolDetail.paymentFrequency)).fill(null))
        }
    },[poolDetail, address])

    // APPROVE STABLE ----- START -----

    const { data: dataClaimInterest, isLoading: isLoadingClaimInterest, write : writeClaimInterest } = useContractWrite({
        ...lendingContract,
        functionName: 'claimInterest',
        args:[
            poolId
        ]
    })

    const {isLoading : isLoadingWaitClaimInterest} 
    = useWaitForTransaction({
        hash: dataClaimInterest?.hash,
        onSuccess(data) {
            getUserBalance();
        }
    })

    // APPROVE STABLE ----- END -----

    function claimInterest() {
        try {
            writeClaimInterest();
        } catch (error) {
            console.log(error)
        }
    }

    function isInterestClaimable(index) {
        if(index < latestInterestClaimed) return "Claimed"
        if(index < poolDetail?.latestRepayment) return "Claimable"
        return "Unclaimable"
    }

    function isUnclaimable() {
        if(latestInterestClaimed < parseFloat(poolDetail?.latestRepayment)) return false
        return true
    }

  return (
    <>
        {
            isLoading || isLoadingUserDetail || isLoadingOnGoingUserDetail
            ? <div className='card space-y-6 flex-1'>
                <h6 className="!font-semibold">Your Lending Statistics</h6>
                <div className='flex gap-4'>
                    <div className='flex-1 flex items-center gap-2'>
                    <div className="h-8 w-8 bg-gray-300 rounded-full"/>
                    <div>
                        <p className='text-sm font-light'>Your Lending Balance</p>
                        <div className="h-3 w-1/2 bg-gray-300 rounded-full mt-1"/>
                    </div>
                    </div>
                    <div className='flex-1 flex items-center gap-2'>
                    <img src="/logo.png" className="h-8" alt="WAG Logo" />
                    <div>
                        <p className='text-sm font-light'>Your Wagon Balance</p>
                        <div className="h-3 w-1/2 bg-gray-300 rounded-full mt-1"/>
                    </div>
                    </div>
                </div>

                <div className="h-8 w-full bg-gray-300 rounded-lg"/>
                </div>
            : <div className='card space-y-4 flex-1'>
                <h6 className="!font-semibold">Your Lending Statistics</h6>
                
                <div className='flex gap-4'>
                    <div className='flex-1 flex items-center gap-2'>
                    <img 
                        src={poolDetailErc1155?.properties.currency_logo} 
                        onLoad={handleImageLoaded}
                        onError={handleImageError} 
                        className="h-8" 
                        alt="Stable coin Logo"
                        style={{ display: loadingImage || errorImage ? 'none' : 'block' }}
                        />
                    <div>
                        <p className='text-sm font-light'>Your Lending Balance</p>
                        <p className='text-base font-semibold'>{numberWithCommas(stableBalance)} {symbol}</p>
                    </div>
                    </div>
                    <div className='flex-1 flex items-center gap-2'>
                    <img src="/logo.png" className="h-8" alt="IDRT Logo" />
                    <div>
                        <p className='text-sm font-light'>Your Wagon Balance</p>
                        <p className='text-base font-semibold'>{numberWithCommas(lockedWag)} WAG</p>
                    </div>
                    </div>
                </div>

                {
                    poolDetail?.status == 1 &&
                    <>
                        {
                        !isConnected
                            ? <ButtonConnect/>
                            : <LendToPoolDialog 
                                poolDetail={poolDetail} 
                                poolDetailErc1155={poolDetailErc1155} 
                                poolId={poolId} 
                                symbol={symbol} 
                                fees={fees}
                            />
                        }
                    </>
                }

                {
                    poolDetail?.status > 1 && latestInterestClaimed < poolDetail?.paymentFrequency && stableBalance > 0 &&
                    <>
                        {
                        !isConnected
                            ? <ButtonConnect/>
                            : <div>
                                <div className="flex items-end justify-between">
                                <p className='text-sm font-semibold'>Your Interest</p>
                                <Button size={"xs"} color="dark" disabled={isUnclaimable()} 
                                    onClick={()=>{
                                        setShowClaimDialog(true);
                                    }}
                                >Claim</Button>
                                <ConfirmationClaimInterestDialog
                                    isOpen={showClaimDialog} 
                                    close={()=>{setShowClaimDialog(false)}}
                                    number={claimableInterestAmount}
                                    repayments={repayments}
                                    poolDetail={poolDetail} 
                                    tokenName={symbol} 
                                    latestInterestClaimed={latestInterestClaimed}
                                    interestSharePerPayment={interestSharePerPayment}
                                    symbol={symbol}
                                    stableBalance={stableBalance}
                                    title={"Claiming Interest"} 
                                    lockedWag={lockedWag}
                                    fees={fees}
                                    claimInterest={()=>{
                                        setShowClaimDialog(false);
                                        claimInterest()
                                    }}
                                    isLastClaim={parseFloat(poolDetail?.latestRepayment) == parseFloat(poolDetail?.paymentFrequency)}
                                />
                                <ClaimInterestDialog 
                                    isOpen={isLoadingClaimInterest || isLoadingWaitClaimInterest} 
                                    number={claimableInterestAmount} 
                                    tokenName={symbol} 
                                    poolName={poolDetailErc1155?.name} 
                                    title={"Claiming Interest"} 
                                    lockedWag={lockedWag}
                                    isLastClaim={parseFloat(poolDetail?.latestRepayment) == parseFloat(poolDetail?.paymentFrequency)}
                                />
                                </div>
                                <div className="mt-2 space-y-1">
                                <div className='flex bg-blue-100 justify-between px-4 py-2 gap-4'>
                                    <p className='text-xs font-semibold w-10'></p>
                                    <p className='text-xs font-semibold flex-1 text-center'>Repayment Deadline</p>
                                    <p className='text-xs font-semibold flex-1 text-end'>Amount</p>
                                    <p className='text-xs font-semibold flex-1 text-end'>Status</p>
                                </div>
                                {
                                    repayments.map((repayment, index) => {
                                        const loanStart = parseFloat(poolDetail.termStart) * 1000;
                                        const durationBetweenPayment = poolDetail.loanTerm / poolDetail.paymentFrequency * 1000;
                                        const paymentTime = loanStart + (durationBetweenPayment * (index + 1));
                                        return (     
                                            <div className='flex bg-blue-100 justify-between px-4 py-2 gap-4' key={`repayment-${index}`}>
                                                <p className='text-xs font-light w-10'>{index+1}</p>
                                                <p className='text-xs font-light flex-1 text-center'>{formatDate(new Date(paymentTime))}</p>
                                                <p className='text-xs font-light flex-1 text-end'>{
                                                    (index+1 == poolDetail.paymentFrequency) 
                                                        ? numberWithCommas(stableBalance + interestSharePerPayment) 
                                                        : numberWithCommas(interestSharePerPayment)} {symbol}
                                                </p>
                                                <p className='text-xs font-light flex-1 text-end'>{isInterestClaimable(index)}</p>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        }
                    </>
                }
            </div>
        }
    </>
  );
};