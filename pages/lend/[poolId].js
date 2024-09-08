// pages/[postId].js
import { useRouter } from 'next/router';
import { Alert, Breadcrumb } from 'flowbite-react';
import { useEffect, useState } from "react";

import PoolDetailCard from '../../components/lend/PoolDetailCard';
import UserLendingStatistic from '../../components/lend/UserLendingStatistic';
import PoolOverviewCard from '../../components/lend/PoolOverviewCard';
import PoolHighlightsCard from '../../components/lend/PoolHighlightsCard';
import PoolRepaymentTermCard from '../../components/lend/PoolRepaymentTermCard';
import PoolActivityCard from '../../components/lend/PoolActivityCard';
import useGetPoolJsonHook from '../../components/lend/utils/useGetPoolJsonHook';
import useGetLendingPoolHook from '../../components/lend/utils/useGetLendingPoolHook';
import useGetActivePoolHook from '../../components/lend/utils/useGetActivePoolHook';
import useGetPoolMaxSupplyHook from '../../components/lend/utils/useGetPoolMaxSupplyHook';
import useGetPoolSupplyHook from '../../components/lend/utils/useGetPoolSupplyHook';
import { getTokenDecimals } from '../../util/lendingUtility';
import Head from 'next/head';

export default function Pool() {
  const router = useRouter();
  const { poolId } = router.query;

  const [isLate, setIsLate] = useState(false);

  const {data: pool, fetchData: getPool} = useGetLendingPoolHook();
  const {data: poolJson, fetchData: getPoolJson} = useGetPoolJsonHook();
  const {data: activePool, fetchData: getActivePool} = useGetActivePoolHook();
  const {data: poolMaxSupply, fetchData: getPoolMaxSupply} = useGetPoolMaxSupplyHook();
  const {data: poolSupply, fetchData: getPoolSupply} = useGetPoolSupplyHook();

  
  function getSymbol() {
    if(poolJson == null) return "";
    return poolJson.properties.currency;
  }

  function getDecimal() {
    if(poolJson == null) return 0;
    return getTokenDecimals(poolJson.properties.currency);
}

  useEffect(()=>{
    if (poolId != null) {
      getPoolJson(poolId);
      getPool(poolId);
      getActivePool(poolId);
      getPoolMaxSupply(poolId);
      getPoolSupply(poolId);
    }
  }, [poolId])

  useEffect(()=>{
    if(pool != null && poolJson != null)
      checkIsLate();
  }, [poolJson, pool])

  function checkIsLate() {
    if(parseFloat(pool.status) == 1) return;

    const loanStart = parseFloat(pool.termStart) * 1000;
    const durationBetweenPayment = parseFloat(pool.loanTerm) / parseFloat(pool.paymentFrequency) * 1000;
    const paymentTime = loanStart + (durationBetweenPayment * (parseFloat(pool.latestRepayment) + 1));
    
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    setIsLate(Math.floor((Date.now()-paymentTime)/millisecondsPerDay));
  }

  return (
    <div className='container mx-auto px-4 md:px-10 space-y-6 pb-4 max-w-7xl'>
      <Head>
        <title>Lend-{poolId} | Wagon Network</title>
      </Head>
      <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/lend">Pool Explorer</Breadcrumb.Item>
          <Breadcrumb.Item>{poolJson?.name}</Breadcrumb.Item>
      </Breadcrumb>

      { 
        // isLate > 0 &&
        // <Alert color="warning" rounded>
        //   <p className='text-sm'>{`Alert: ${poolJson.name} is ${isLate} days late on repayment.`}</p>
        // </Alert>
      }

      <div className='flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          <PoolDetailCard
            poolId={poolId}
            poolJson={poolJson}
            pool={pool}
            symbol={getSymbol()}
            decimal={getDecimal()}
            activePool={activePool}
            poolMaxSupply={poolMaxSupply}
            poolSupply={poolSupply}
          />
        </div>

        <div className='flex-1 space-y-4'>
          <UserLendingStatistic
            pool={pool}
            poolJson={poolJson}
            symbol={getSymbol()}
            decimal={getDecimal()}
            poolMaxSupply={poolMaxSupply}
            poolSupply={poolSupply}
            refresh={()=>{
              console.log("refreshing activepool");
              getActivePool(poolId);
              getPoolSupply(poolId);
            }}
          />

          <PoolOverviewCard
            pool={pool}
            symbol={getSymbol()}
            decimal={getDecimal()}
          />

          <PoolHighlightsCard
            poolJson={poolJson}
          />

          <PoolRepaymentTermCard
            poolJson={poolJson}
          />

          <div className='card'>
            <h6 className="!font-semibold">Announcement</h6>
            <p className='text-sm mt-6'>No announcement found</p>
          </div>

          <PoolActivityCard
            poolId={poolId}
            decimal={getDecimal()}
          />

        </div>
      </div>
    </div>
  );
};