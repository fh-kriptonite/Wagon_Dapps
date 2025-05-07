import { useRouter } from 'next/router';
import { Breadcrumb, Tabs } from 'flowbite-react';
import { IoIosBusiness } from "react-icons/io";
import { PiPackage } from "react-icons/pi";
import { PiUserFill } from "react-icons/pi";
import { useEffect, useState } from "react";

import PoolDetailCard from '../../../components/lend/PoolDetailCard';
import Head from 'next/head';
import AssetReports from '../../../components/lend/AssetReports';

import { services } from "../../../services/service_lending";
import ShipmentList from '../../../components/lend/ShipmentList';
import AboutBorrower from '../../../components/lend/AboutBorrower';

import PoolCustody from '../../../components/lend/PoolCustody';
import { Asset, Pool, Shipment } from '../../../components/lend/types';
import PoolOverviewCard from '@/components/lend/PoolOverviewCard';

export default function OffchainPool() {
  const router = useRouter();
  const { poolId } = router.query;
  const [pool, setPool] = useState<Pool | null>(null);

  async function getPool() {
    const response = await fetch(process.env.WAGON_API_URL + '/api/pools/' + poolId);
    const data = await response.json();
    setPool(data.data);
  }

  useEffect(() => {
    if (poolId && typeof poolId === 'string') {
      getPool();
    }
  }, [poolId]);
  
  useEffect(() => {
    if(pool != null) {
      if(pool.detail.type === "Asset Leasing") {
        getShipments();
        getAssetsPool();
      }
    }
  }, [pool]);

  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [isLoadingAsset, setIsLoadingAsset] = useState<boolean>(false);

  async function getAssetsPool() {
    if (!poolId || typeof poolId !== 'string') return;
    
    setIsLoadingAsset(true);
    try {
      const data = await services.getOffchainAssetsPool(poolId);
      setAssets(data);
      setIsLoadingAsset(false);
    } catch (error) {
      console.error(error);
      setIsLoadingAsset(false);
    }
  }

  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [isLoadingShipment, setIsLoadingShipment] = useState<boolean>(false);

  async function getShipments() {
    if (!poolId || typeof poolId !== 'string') return;
    
    setIsLoadingShipment(true);
    try {
      const data = await services.getOffchainShipmentsPool(poolId);
      setShipments(data);
      setIsLoadingShipment(false);
    } catch (error) {
      console.error(error);
      setIsLoadingShipment(false);
    }
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
          <Breadcrumb.Item>{pool?.detail.name}</Breadcrumb.Item>
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
              <PoolOverviewCard
                pool={pool}
                activePool={null}
                poolSupply={null}
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
        pool?.detail.type === "Asset Leasing" &&
        <AssetReports 
          shipments={shipments}
          assets={assets}
        />
      }

      <div className='card !pt-2'>
        <Tabs variant="underline">
          <Tabs.Item title="Borrowers" icon={PiUserFill}>
              <div className='min-h-60'>
                <AboutBorrower
                  content={pool?.detail.borrower || ''}
                />
              </div>
          </Tabs.Item>
          <Tabs.Item title="Lenders" icon={IoIosBusiness}>
              <div className='min-h-60'>
                <AboutBorrower
                  content={pool?.detail.lender || ''}
                />
              </div>
          </Tabs.Item>
          {
            pool?.detail.type === "Asset Leasing" &&
            <Tabs.Item title="Shipments" icon={PiPackage}>
                <div className='min-h-60'>
                  <ShipmentList
                    shipments={shipments}
                  />
                </div>
            </Tabs.Item>
          }
        </Tabs>
      </div>
    </div>
  );
} 