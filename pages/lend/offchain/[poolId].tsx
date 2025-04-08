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

import useGetOffchainPoolJsonHook from '../../../components/lend/utils/useGetOffchainPoolJsonHook';
import PoolOverviewCardOffchain from '../../../components/lend/PoolOverviewCardOffchain';
import PoolCustody from '../../../components/lend/PoolCustody';
import { Asset, PoolJson, Shipment } from '../../../components/lend/types';

export default function Pool() {
  const router = useRouter();
  const { poolId } = router.query;

  const {data: poolJson, fetchData: getPoolJson} = useGetOffchainPoolJsonHook();

  useEffect(() => {
    if (poolId && typeof poolId === 'string') {
      getPoolJson(poolId);
    }
  }, [poolId]);
  
  useEffect(() => {
    if(poolJson != null) {
      const typedPoolJson = poolJson as unknown as PoolJson;
      if(typedPoolJson.properties.type === "Asset Leasing") {
        getShipments();
        getAssetsPool();
      }
    }
  }, [poolJson]);

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

  const typedPoolJson = poolJson as unknown as PoolJson | null;

  return (
    <div className='container mx-auto px-4 md:px-10 space-y-6 pb-4 max-w-7xl'>
      <Head>
        {
          Number(process.env.THEME_SKIN) === 1
          ? <title>Lend-{poolId} | Wagon Network</title>
          : Number(process.env.THEME_SKIN) === 2
            ? <title>Waresix ABS | Lend-{poolId}</title>
            : <title>Lend-{poolId}</title>
        }
      </Head>
      <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/lend">Pool Explorer</Breadcrumb.Item>
          <Breadcrumb.Item>{typedPoolJson?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className='flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          {typedPoolJson && (
            <PoolDetailCard
              poolJson={typedPoolJson}
            />
          )}
        </div>

        <div className='flex-1'>
          <div className='sticky top-20 space-y-4'>
            {typedPoolJson && (
              <PoolOverviewCardOffchain
                poolJson={typedPoolJson}
              />
            )}
            {typedPoolJson && (
              <PoolCustody
                poolJson={typedPoolJson}
              />
            )}
          </div>
        </div>
      </div>

      {
        typedPoolJson?.properties.type === "Asset Leasing" &&
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
                  content={typedPoolJson?.properties.borrower || ''}
                />
              </div>
          </Tabs.Item>
          <Tabs.Item title="Lenders" icon={IoIosBusiness}>
              <div className='min-h-60'>
                <AboutBorrower
                  content={typedPoolJson?.properties.lender || ''}
                />
              </div>
          </Tabs.Item>
          {
            typedPoolJson?.properties.type === "Asset Leasing" &&
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