import { useRouter } from 'next/router';
import { Breadcrumb, Tabs } from 'flowbite-react';
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

import { services } from "../../services/service_lending";
import ShipmentList from '../../components/lend/ShipmentList';
import AboutBorrower from '../../components/lend/AboutBorrower';

import useGetLendStableBalanceHook from '../../components/lend/utils/useGetLendStableBalanceHook';
import useGetLendWagBalanceHook from '../../components/lend/utils/useGetLendWagBalanceHook';
import useGetPoolFeeHook from '../../components/lend/utils/useGetPoolFeeHook';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import PoolCustody from '../../components/lend/PoolCustody';
import { Asset, PoolFee, Shipment } from '@/components/lend/types';

export default function Pool() {
  const router = useRouter();
  const { poolId } = router.query;
  const { connectedAddress: address } = useConnectedAddress();

  // All state hooks must be at the top
  const [isLate, setIsLate] = useState<number>(0);
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [isLoadingAsset, setIsLoadingAsset] = useState<boolean>(false);
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [isLoadingShipment, setIsLoadingShipment] = useState<boolean>(false);

  // All data fetching hooks
  const {data: pool, fetchData: getPool} = useGetLendingPoolHook();
  const {data: poolJson, fetchData: getPoolJson} = useGetPoolJsonHook();
  const {data: activePool, fetchData: getActivePool} = useGetActivePoolHook();
  const {data: poolMaxSupply, fetchData: getPoolMaxSupply} = useGetPoolMaxSupplyHook();
  const {data: poolSupply, fetchData: getPoolSupply} = useGetPoolSupplyHook();
  const {data: stableBalance, fetchData: getStableBalance} = useGetLendStableBalanceHook();
  const {data: wagBalance, fetchData: getWagBalance} = useGetLendWagBalanceHook();
  const {data: fees, fetchData: getFees} = useGetPoolFeeHook();

  // Data fetching effect
  useEffect(() => {
    if (router.isReady && poolId) {
      getPoolJson(poolId as string);
      getPool(poolId as string);
      getActivePool(poolId as string);
      getPoolMaxSupply(poolId as string);
      getPoolSupply(poolId as string);
      getFees(poolId as string);
    }
  }, [router.isReady, poolId]);

  // Balance fetching effect
  useEffect(() => {
    if (address && poolId) {
      getStableBalance(address, poolId as string);
      getWagBalance(address, poolId as string);
    }
  }, [address, poolId]);

  // Late payment check effect
  useEffect(() => {
    if (pool && poolJson) {
      checkIsLate();
    }
  }, [pool, poolJson]);

  // Assets and shipments fetching effect
  useEffect(() => {
    if (poolJson && poolId) {
      if (poolJson.properties.type === "Asset Leasing") {
        getShipments();
        getAssetsPool();
      }
    }
  }, [poolJson, poolId]);

  // Helper functions
  function getSymbol(): string {
    if (!poolJson) return "";
    return poolJson.properties.currency;
  }

  function getDecimal(): number {
    if (!poolJson) return 0;
    return getTokenDecimals(poolJson.properties.currency_logo);
  }

  function checkIsLate(): void {
    if (!pool) return;
    const poolData = pool;
    if (parseFloat(poolData.status) === 1) return;

    const loanStart = parseFloat(poolData.termStart) * 1000;
    const durationBetweenPayment = parseFloat(poolData.loanTerm) / parseFloat(poolData.paymentFrequency) * 1000;
    const paymentTime = loanStart + (durationBetweenPayment * (parseFloat(poolData.latestRepayment) + 1));
    
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    setIsLate(Math.floor((Date.now() - paymentTime) / millisecondsPerDay));
  }

  async function getAssetsPool(): Promise<void> {
    if (!poolId) return;
    setIsLoadingAsset(true);
    try {
      const data = await services.getOffchainAssetsPool(poolId as string);
      setAssets(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAsset(false);
    }
  }

  async function getShipments(): Promise<void> {
    if (!poolId) return;
    setIsLoadingShipment(true);
    try {
      const data = await services.getOffchainShipmentsPool(poolId as string);
      setShipments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingShipment(false);
    }
  }

  // Loading state
  if (!router.isReady || !poolId) {
    return <div>Loading...</div>;
  }

  const themeSkin = Number(process.env.THEME_SKIN || '0');

  return (
    <div className='container mx-auto px-4 md:px-10 space-y-6 pb-4 max-w-7xl'>
      <Head>
        {
          themeSkin === 1
          ? <title>Lend-{poolId} | Wagon Network</title>
          : themeSkin === 2
            ? <title>Waresix ABS | Lend-{poolId}</title>
            : <title>Lend-{poolId}</title>
        }
      </Head>
      <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/lend">Pool Explorer</Breadcrumb.Item>
          <Breadcrumb.Item>{poolJson ? poolJson.name : ''}</Breadcrumb.Item>
      </Breadcrumb>

      { 
        // isLate > 0 &&
        // <Alert color="warning" rounded>
        //   <p className='text-sm'>{`Alert: ${poolJson.name} is ${isLate} days late on repayment.`}</p>
        // </Alert>
      }

      <div className='flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          {poolJson && pool && (
            <PoolDetailCard
              poolJson={poolJson}
            />
          )}
        </div>

        <div className='flex-1'>
          <div className='sticky top-20 space-y-4'>
            {poolJson && pool && (
              <UserLendingStatistic
                pool={pool}
                poolJson={poolJson}
                symbol={getSymbol()}
                decimal={getDecimal()}
                stableBalance={stableBalance?.toString() || null}
                wagBalance={wagBalance?.toString() || null}
                fees={fees || null}
                poolMaxSupply={poolMaxSupply?.toString() || null}
                poolSupply={poolSupply?.toString() || null}
                refresh={() => {
                  getActivePool(poolId as string);
                  getPoolSupply(poolId as string);
                  getStableBalance(address || '', poolId as string);
                  getWagBalance(address || '', poolId as string);
                }}
              />
            )}

            {poolJson && pool && (
              <PoolOverviewCard
                poolId={poolId as string}
                poolJson={poolJson}
                pool={pool}
                symbol={getSymbol()}
                decimal={getDecimal()}
                activePool={activePool}
                poolMaxSupply={poolMaxSupply?.toString() || null}
                poolSupply={poolSupply?.toString() || null}
              />
            )}

            {poolJson && (
              <PoolCustody
                poolJson={poolJson}
              />
            )}
          </div>
        </div>
      </div>

      {
        poolJson && poolJson.properties.type === "Asset Leasing" &&
        <AssetReports 
          shipments={shipments as any}
          assets={assets as any} 
        />
      }

      <div className='card !pt-2'>
        <Tabs variant="underline">
          <Tabs.Item active title="Transactions" icon={GrTransaction}>
            <div className='min-h-60'>
              <PoolActivityCard
                poolId={poolId as string}
                decimal={getDecimal()}
              />
            </div>
          </Tabs.Item>
          <Tabs.Item title="Borrowers" icon={PiUserFill}>
            <div className='min-h-60'>
              <AboutBorrower
                content={poolJson ? poolJson.properties.borrower : ''}
              />
            </div>
          </Tabs.Item>
          {
            pool && parseFloat((pool).status) > 1 &&
            <Tabs.Item title="Repayments" icon={MdOutlinePayments}>
              <div className='min-h-60'>
                <TimelinePool 
                  pool={pool}
                  symbol={getSymbol()}
                  decimal={getDecimal()}
                  stableBalance={stableBalance?.toString() || ''}
                  wagBalance={wagBalance?.toString() || ''}
                  fees={fees as PoolFee}
                  refresh={()=>{
                    console.log("refreshing user");
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
  )
} 