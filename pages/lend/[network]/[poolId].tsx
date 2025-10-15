import { useRouter } from 'next/router';
import { Breadcrumb, Tabs } from 'flowbite-react';
import { GrTransaction } from "react-icons/gr";
import { MdOutlinePayments } from "react-icons/md";
import { PiPackage } from "react-icons/pi";
import { FaTruckFront } from "react-icons/fa6";
import { PiUserFill } from "react-icons/pi";
import { useEffect, useState } from "react";

import PoolDetailCard from '../../../components/lend/PoolDetailCard';
import UserLendingStatistic from '../../../components/lend/UserLendingStatistic';
import PoolOverviewCard from '../../../components/lend/PoolOverviewCard';
import PoolActivityCard from '../../../components/lend/PoolActivityCard';
import useGetActivePoolHook from '../../../components/lend/utils/useGetActivePoolHook';
import useGetPoolSupplyHook from '../../../components/lend/utils/useGetPoolSupplyHook';

import Head from 'next/head';
import TimelinePool from '../../../components/lend/TimelinePool';
import AssetReports from '../../../components/lend/AssetReports';
import AssetList from '../../../components/lend/AssetList';

import { services } from "../../../services/service_lending";
import ShipmentList from '../../../components/lend/ShipmentList';
import AboutBorrower from '../../../components/lend/AboutBorrower';

import useGetLendStableBalanceHook from '../../../components/lend/utils/useGetLendStableBalanceHook';
import useGetLendWagBalanceHook from '../../../components/lend/utils/useGetLendWagBalanceHook';
import useGetPoolFeeHook from '../../../components/lend/utils/useGetPoolFeeHook';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import PoolCustody from '../../../components/lend/PoolCustody';
import { Asset, PoolFee, Shipment, Pool } from '@/components/lend/types';

export default function PoolDetail() {
  const router = useRouter();
  const { network, poolId } = router.query;
  const { connectedAddress: address } = useConnectedAddress();

  // All state hooks must be at the top
  const [pool, setPool] = useState<Pool | null>(null);
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [isLoadingAsset, setIsLoadingAsset] = useState<boolean>(false);
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [isLoadingShipment, setIsLoadingShipment] = useState<boolean>(false);

  // All data fetching hooks
  const {data: activePool, fetchData: getActivePool} = useGetActivePoolHook();
  const {data: poolSupply, fetchData: getPoolSupply} = useGetPoolSupplyHook();
  const {data: stableBalance, fetchData: getStableBalance} = useGetLendStableBalanceHook();
  const {data: wagBalance, fetchData: getWagBalance} = useGetLendWagBalanceHook();
  const {data: fees, fetchData: getFees} = useGetPoolFeeHook();

  async function getPool() {
    const response = await fetch(process.env.WAGON_API_URL + '/api/pools/pool_id/' + network + '/' + poolId);
    const data = await response.json();
    setPool(data.data);
  }

  function getNetworkId(): number {
    if(network == 'BSC' || network == 'BNB-TESTNET') {
      return Number(process.env.BNB_CHAIN_ID);
    } else if(network == 'BASE') {
      return Number(process.env.BASE_CHAIN_ID);
    }
    return 0;
  }

  // Data fetching effect
  useEffect(() => {
    if (router.isReady && poolId) {
      getPool();
      getActivePool(Number(poolId), getNetworkId());
      getPoolSupply(Number(poolId), getNetworkId());
      getFees(Number(poolId), getNetworkId());
    }
  }, [router.isReady, poolId]);

  // Balance fetching effect
  useEffect(() => {
    if (address && poolId) {
      getStableBalance(address, poolId as string, getNetworkId());
      getWagBalance(address, poolId as string, getNetworkId());
    }
  }, [address, poolId]);


  // Assets and shipments fetching effect
  useEffect(() => {
    if (pool) {
      if (pool.detail.type === "Asset Financing") {
        getShipments();
        getAssetsPool();
      }
    }
  }, [pool]);

  // Helper functions
  function getSymbol(): string {
    if (!pool) return "";
    return pool.detail.currency;
  }

  function getDecimal(): number {
    if (!pool) return 0;
    return pool.lending_contract.decimals;
  }

  async function getAssetsPool(): Promise<void> {
    if (!pool) return;
    setIsLoadingAsset(true);
    try {
      const response = await fetch(process.env.WAGON_API_URL + '/api/pools/assets/' + pool.id);
      const assets = await response.json();
      setAssets(assets.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAsset(false);
    }
  }

  async function getShipments(): Promise<void> {
    if (!pool) return;
    setIsLoadingShipment(true);
    try {
      const response = await fetch(process.env.WAGON_API_URL + '/api/pools/shipments/' + pool.id);
      const shipments = await response.json();
      setShipments(shipments.data);
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
          <Breadcrumb.Item>{pool ? pool.detail.name : ''}</Breadcrumb.Item>
      </Breadcrumb>

      <div className='flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          {pool && (
            <PoolDetailCard
              pool={pool}
            />
          )}
        </div>

        <div className='flex-1'>
          <div className='sticky top-20 space-y-4'>

            {pool && (
              <UserLendingStatistic
                pool={pool}
                stableBalance={stableBalance?.toString() || null}
                wagBalance={wagBalance?.toString() || null}
                fees={fees || null}
                activePool={activePool}
                poolSupply={poolSupply?.toString() || null}
                refresh={() => {
                  getActivePool(Number(poolId), getNetworkId());
                  getPoolSupply(Number(poolId), getNetworkId());
                  getStableBalance(address || '', poolId as string, getNetworkId());
                  getWagBalance(address || '', poolId as string, getNetworkId());
                }}
              />
            )}

            {pool && (
              <PoolOverviewCard
                pool={pool}
              />
            )}

            {pool && (
              <PoolCustody
                pool={pool}
              />
            )}
          </div>
        </div>
      </div>

      {
        pool && pool.detail.type === "Asset Financing" &&
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
                pool={pool as Pool}
              />
            </div>
          </Tabs.Item>
          <Tabs.Item title="Borrowers" icon={PiUserFill}>
            <div className='min-h-60'>
              <AboutBorrower
                content={pool ? pool.detail.borrower : ''}
              />
            </div>
          </Tabs.Item>
          {
            pool && pool.status > 1 &&
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
            pool && pool.detail.type == "Asset Financing" &&
            <Tabs.Item title="Shipments" icon={PiPackage}>
                <div className='min-h-60'>
                  <ShipmentList
                    shipments={shipments}
                  />
                </div>
            </Tabs.Item>
          }
          {
            pool && pool.detail.type == "Asset Financing" &&
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