// pages/[postId].js
import { useRouter } from 'next/router';
import { Alert, Breadcrumb, Card, Tabs } from 'flowbite-react';
import { GrTransaction } from "react-icons/gr";
import { MdOutlinePayments } from "react-icons/md";
import { PiPackage } from "react-icons/pi";
import { FaTruckFront } from "react-icons/fa6";
import { PiUserFill } from "react-icons/pi";
import { useEffect, useState } from "react";

import PoolDetailCard from '../../components/lend/PoolDetailCard';
import UserLendingStatistic from '../../components/lend/UserLendingStatistic';
import PoolOverviewCard from '../../components/lend/PoolOverviewCard';
import PoolActivityCard from '../../components/lend/PoolActivityCard';
import useGetPoolJsonHook from '../../components/lend/utils/useGetPoolJsonHook';
import useGetLendingPoolHook from '../../components/lend/utils/useGetLendingPoolHook';
import useGetActivePoolHook from '../../components/lend/utils/useGetActivePoolHook';
import useGetPoolMaxSupplyHook from '../../components/lend/utils/useGetPoolMaxSupplyHook';
import useGetPoolSupplyHook from '../../components/lend/utils/useGetPoolSupplyHook';
import { getTokenDecimals } from '../../util/lendingUtility';
import Head from 'next/head';
import TimelinePool from '../../components/lend/TimelinePool';
import AssetReports from '../../components/lend/AssetReports';
import AssetList from '../../components/lend/AssetList';

import { getAssetsPoolService, getShipmentsPoolService } from "../../services/service_lending";
import ShipmentList from '../../components/lend/ShipmentList';
import AboutBorrower from '../../components/lend/AboutBorrower';

import useGetLendStableBalanceHook from '../../components/lend/utils/useGetLendStableBalanceHook';
import useGetLendWagBalanceHook from '../../components/lend/utils/useGetLendWagBalanceHook';
import useGetPoolFeeHook from '../../components/lend/utils/useGetPoolFeeHook';
import { useAccount } from '@particle-network/connectkit';

export default function Pool() {
  const router = useRouter();
  const { poolId } = router.query;
  const address = useAccount();

  const [isLate, setIsLate] = useState(false);

  const {data: pool, fetchData: getPool} = useGetLendingPoolHook();
  const {data: poolJson, fetchData: getPoolJson} = useGetPoolJsonHook();
  const {data: activePool, fetchData: getActivePool} = useGetActivePoolHook();
  const {data: poolMaxSupply, fetchData: getPoolMaxSupply} = useGetPoolMaxSupplyHook();
  const {data: poolSupply, fetchData: getPoolSupply} = useGetPoolSupplyHook();

  const {data: stableBalance, fetchData: getStableBalance} = useGetLendStableBalanceHook();
  const {data: wagBalance, fetchData: getWagBalance} = useGetLendWagBalanceHook();
  const {data: fees, fetchData: getFees} = useGetPoolFeeHook();
    
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
      getFees(poolId);
    }
  }, [poolId])

  useEffect(()=>{
    if(pool != null && poolJson != null)
      checkIsLate();
  }, [poolJson, pool])

  useEffect(()=>{
    console.log(address)
    if(address != null) {
      getStableBalance(address, poolId);
      getWagBalance(address, poolId)
    }
  }, [address])

  function checkIsLate() {
    if(parseFloat(pool.status) == 1) return;

    const loanStart = parseFloat(pool.termStart) * 1000;
    const durationBetweenPayment = parseFloat(pool.loanTerm) / parseFloat(pool.paymentFrequency) * 1000;
    const paymentTime = loanStart + (durationBetweenPayment * (parseFloat(pool.latestRepayment) + 1));
    
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    setIsLate(Math.floor((Date.now()-paymentTime)/millisecondsPerDay));
  }

  useEffect(()=>{
    if(poolJson != null) {
      if(poolJson.properties.type == "Asset Leasing") {
        getShipments();
        getAssetsPool();
      }
    }
  }, [poolJson])

  const [assets, setAssets] = useState(null);
  const [isLoadingAsset, setIsLoadingAsset] = useState(false);

  async function getAssetsPool() {
    setIsLoadingAsset(true)
      try {
          const data = await getAssetsPoolService(poolId);
          setAssets(data.data)
          setIsLoadingAsset(false)
      } catch (error) {
          console.log(error)
          setIsLoadingAsset(false)
      }
  }

  const [shipments, setShipments] = useState(null);
  const [isLoadingShipment, setIsLoadingShipment] = useState(false);

  async function getShipments() {
    setIsLoadingShipment(true)
      try {
          const data = await getShipmentsPoolService(poolId);
          console.log(data.data)
          setShipments(data.data)
          setIsLoadingShipment(false)
      } catch (error) {
          console.log(error)
          setIsLoadingShipment(false)
      }
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

        <div className='flex-1'>
          <div className='sticky top-20 space-y-4'>
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
                getStableBalance(address, poolId);
                getWagBalance(address, poolId);
              }}
              stableBalance={stableBalance}
              wagBalance={wagBalance}
              fees={fees}
            />

            <PoolOverviewCard
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
        </div>
      </div>

      {
        poolJson?.properties.type == "Asset Leasing" &&
        <AssetReports 
          shipments={shipments}
          assets={assets}
        />
      }

      <div className='card !pt-2'>
        <Tabs variant="underline">
          <Tabs.Item active title="Transactions" icon={GrTransaction}>
            <div className='min-h-60'>
              <PoolActivityCard
                poolId={poolId}
                decimal={getDecimal()}
              />
              </div>
          </Tabs.Item>
          <Tabs.Item title="Borrowers" icon={PiUserFill}>
              <div className='min-h-60'>
                <AboutBorrower
                  poolJson={poolJson}
                />
              </div>
          </Tabs.Item>
          {
            pool?.status > 1 &&
            <Tabs.Item title="Repayments" icon={MdOutlinePayments}>
              <div className='min-h-60'>
                <TimelinePool 
                  pool={pool}
                  symbol={getSymbol()}
                  decimal={getDecimal()}
                  stableBalance={stableBalance}
                  wagBalance={wagBalance}
                  fees={fees}
                  refresh={()=>{
                    console.log("refreshing user");
                    getStableBalance(address, poolId);
                    getWagBalance(address, poolId);
                  }}
                />
              </div>
            </Tabs.Item>
          }
          {
            poolJson?.properties.type == "Asset Leasing" &&
            <Tabs.Item title="Shipments" icon={PiPackage}>
                <div className='min-h-60'>
                  <ShipmentList
                    shipments={shipments}
                  />
                </div>
            </Tabs.Item>
          }
          {
            poolJson?.properties.type == "Asset Leasing" &&
            <Tabs.Item title="Assets" icon={FaTruckFront}>
                <div className='min-h-60'>
                  <AssetList
                    assets={assets}
                  />
                </div>
            </Tabs.Item>
          }
          
        </Tabs>
      </div>
    </div>
  );
};