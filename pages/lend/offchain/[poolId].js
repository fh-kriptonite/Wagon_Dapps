// pages/lend/offchain/[poolid].js
import { useRouter } from 'next/router';
import { Breadcrumb, Tabs } from 'flowbite-react';
import { IoIosBusiness } from "react-icons/io";
import { PiPackage } from "react-icons/pi";
import { PiUserFill } from "react-icons/pi";
import { useEffect, useState } from "react";

import PoolDetailCard from '../../../components/lend/PoolDetailCard';
import Head from 'next/head';
import AssetReports from '../../../components/lend/AssetReports';

import { getOffchainAssetsPoolService, getOffchainShipmentsPoolService } from "../../../services/service_lending";
import ShipmentList from '../../../components/lend/ShipmentList';
import AboutBorrower from '../../../components/lend/AboutBorrower';

import useGetOffchainPoolJsonHook from '../../../components/lend/utils/useGetOffchainPoolJsonHook';
import PoolOverviewCardOffchain from '../../../components/lend/PoolOverviewCardOffchain';
import PoolCustody from '../../../components/lend/PoolCustody';

export default function Pool() {
  const router = useRouter();
  const { poolId } = router.query;

  const {data: poolJson, fetchData: getPoolJson} = useGetOffchainPoolJsonHook();

  useEffect(()=>{
    if (poolId != null) {
      getPoolJson(poolId);
    }
  }, [poolId])
  
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
          const data = await getOffchainAssetsPoolService("off%2D"+poolId);
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
          const data = await getOffchainShipmentsPoolService("off%2D"+poolId);
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
        {
          process.env.THEME_SKIN == 1
          ? <title>Lend-{poolId} | Wagon Network</title>
          : <title>Lend-{poolId}</title>
        }
      </Head>
      <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/lend">Pool Explorer</Breadcrumb.Item>
          <Breadcrumb.Item>{poolJson?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className='flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          <PoolDetailCard
            poolJson={poolJson}
          />
        </div>

        <div className='flex-1'>
          <div className='sticky top-20 space-y-4'>
            <PoolOverviewCardOffchain
              poolJson={poolJson}
            />
            <PoolCustody
              poolJson={poolJson}
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
          <Tabs.Item title="Borrowers" icon={PiUserFill}>
              <div className='min-h-60'>
                <AboutBorrower
                  content={poolJson?.properties.borrower}
                />
              </div>
          </Tabs.Item>
          <Tabs.Item title="Lenders" icon={IoIosBusiness}>
              <div className='min-h-60'>
                <AboutBorrower
                  content={poolJson?.properties.lender}
                />
              </div>
          </Tabs.Item>
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
          {/* {
            poolJson?.properties.type == "Asset Leasing" &&
            <Tabs.Item title="Assets" icon={FaTruckFront}>
                <div className='min-h-60'>
                  <AssetList
                    assets={assets}
                  />
                </div>
            </Tabs.Item>
          } */}
          
        </Tabs>
      </div>
    </div>
  );
};