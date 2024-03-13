// pages/[postId].js
import { useRouter } from 'next/router';
import { Alert, Breadcrumb } from 'flowbite-react';
import { erc20ABI, useContractReads } from 'wagmi';
import { useEffect, useState } from "react";

import erc1155ABI from "../../public/ABI/lendingErc1155.json";
import lendingABI from "../../public/ABI/lending.json";

import { getPoolCardDetailService, getPoolDetailJson } from "../../services/service_lending";
import PoolDetailCard from '../../components/lend/PoolDetailCard';
import UserLendingStatistic from '../../components/lend/UserLendingStatistic';
import PoolOverviewCard from '../../components/lend/PoolOverviewCard';
import PoolHighlightsCard from '../../components/lend/PoolHighlightsCard';
import PoolRepaymentTermCard from '../../components/lend/PoolRepaymentTermCard';
import PoolActivityCard from '../../components/lend/PoolActivityCard';

export default function Pool() {
  const router = useRouter();
  const { poolId } = router.query;

  const [poolDetailErc1155, setPoolDetailErc1155] = useState(null);
  const [poolDetail, setPoolDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [symbol, setSymbol] = useState("");
  const [decimal, setDecimal] = useState(0);

  const [tokenSupply, setTokenSupply] = useState(0);
  const [tokenMaxSupply, setTokenMaxSupply] = useState(0);

  const [collectedPrincipal, setCollectedPrincipal] = useState(0);

  const [isLate, setIsLate] = useState(false);
  
  async function getPoolDetail() {
    setIsLoading(true)
    try {
      const poolCardDetail = await getPoolCardDetailService(poolId)

      setPoolDetail(poolCardDetail.pool);
      setPoolDetailErc1155(poolCardDetail.json);
  
      setSymbol(poolCardDetail.lendingCurrency.symbol)
      const decimal = poolCardDetail.lendingCurrency.decimals;
      setDecimal(decimal)
  
      setTokenSupply(parseFloat(poolCardDetail.erc1155.tokenSupply) / Math.pow(10, decimal));
      setTokenMaxSupply(parseFloat(poolCardDetail.erc1155.tokenMaxSupply) / Math.pow(10, decimal));

      setCollectedPrincipal(parseFloat(poolCardDetail.activePool.collectedPrincipal) / Math.pow(10, decimal));
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    if (poolId != null) getPoolDetail();
  }, [poolId])

  useEffect(()=>{
    if(poolDetail != null && poolDetailErc1155 != null)
      checkIsLate();
  }, [poolDetailErc1155, poolDetail])

  function checkIsLate() {
    if(parseFloat(poolDetail.status) == 1) return;

    const loanStart = parseFloat(poolDetail.termStart) * 1000;
    const durationBetweenPayment = poolDetail.loanTerm / poolDetail.paymentFrequency * 1000;
    const paymentTime = loanStart + (durationBetweenPayment * (poolDetail.latestRepayment + 1));
    
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    setIsLate(Math.floor((Date.now()-paymentTime)/millisecondsPerDay));
  }

  return (
    <div className='container mx-auto px-4 md:px-10 space-y-6 pb-4 max-w-7xl'>
      <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/lend">Pool Explorer</Breadcrumb.Item>
          <Breadcrumb.Item>{poolDetailErc1155?.name}</Breadcrumb.Item>
      </Breadcrumb>

      { isLate > 0 &&
        <Alert color="warning" rounded>
          <p className='text-sm'>{`Alert: ${poolDetailErc1155.name} is ${isLate} days late on repayment.`}</p>
        </Alert>
      }

      <div className='flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          <PoolDetailCard 
            isLoading={isLoading}
            poolDetailErc1155={poolDetailErc1155}
            poolDetail={poolDetail}
            tokenSupply={tokenSupply}
            tokenMaxSupply={tokenMaxSupply}
            collectedPrincipal={collectedPrincipal}
            symbol={symbol}
          />
        </div>

        <div className='flex-1 space-y-4'>
          <UserLendingStatistic
            isLoading={isLoading}
            poolDetail={poolDetail}
            poolDetailErc1155={poolDetailErc1155}
            symbol={symbol}
            decimal={decimal}
          />

          <PoolOverviewCard
            isLoading={isLoading}
            decimal={decimal}
            poolDetail={poolDetail}
            symbol={symbol}
          />

          <PoolHighlightsCard
            isLoadingDetail={isLoading}
            isLoadingPool={isLoading}
            poolDetailErc1155={poolDetailErc1155}
          />

          <PoolRepaymentTermCard
            isLoadingDetail={isLoading}
            isLoadingPool={isLoading}
            poolDetail={poolDetail}
            poolDetailErc1155={poolDetailErc1155}
          />

          <div className='card'>
            <h6 className="!font-semibold">Announcement</h6>
            <p className='text-sm mt-6'>No announcement found</p>
          </div>

          <PoolActivityCard
            poolId={poolId}
            decimal={decimal}
          />

        </div>
      </div>
    </div>
  );
};