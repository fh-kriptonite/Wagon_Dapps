import { numberWithCommas } from "../../util/stringUtility";

import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import { getPoolCardDetailService } from "../../services/service_lending";
import { Progress } from "flowbite-react";
import CountdownTimer from "../general/CountdownTimer";
import { calculateApy, formatTime } from "../../util/lendingUtility";

export default function PoolCard(props) {
  const router = useRouter();

  const [pool, setPool] = useState(null);
  const [poolDetail, setPoolDetail] = useState(null);
  const [tokenSupply, setTokenSupply] = useState(0);
  const [tokenMaxSupply, setTokenMaxSupply] = useState(0);
  const [collectedPrincipal, setCollectedPrincipal] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [apy, setApy] = useState(0);

  const [isLoading, setIsloading] = useState(true);

  const poolId = props.poolId;

  async function getPoolCardDetail() {
    setIsloading(true)
    try {
      const poolCardDetail = await getPoolCardDetailService(poolId)

      setPool(poolCardDetail.pool);
      setPoolDetail(poolCardDetail.json);
  
      setSymbol(poolCardDetail.lendingCurrency.symbol)
      const decimal = poolCardDetail.lendingCurrency.decimals;
  
      setTokenSupply(parseFloat(poolCardDetail.erc1155.tokenSupply) / Math.pow(10, decimal));
      setTokenMaxSupply(parseFloat(poolCardDetail.erc1155.tokenMaxSupply) / Math.pow(10, decimal));

      setCollectedPrincipal(parseFloat(poolCardDetail.activePool.collectedPrincipal) / Math.pow(10, decimal));
      setIsloading(false)
    } catch (error) {
      console.log(error)
      setIsloading(false)
    }
  }

  useEffect(()=>{
    if (poolId != null) getPoolCardDetail();
  }, [poolId])

  useEffect(()=>{
    if(pool != null) getApy();
  }, [pool])

  function getApy() {
    setApy(calculateApy(pool));
  }

  return (
    <>
      {  
        isLoading
        ? <div className="card animate-pulse">
              <div className="flex items-start gap-4 justify-between">
                <div className="card !p-0 !bg-gray-300">
                  <div className="h-24 w-24"/>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-gray-300 rounded-xl"/>
                  <div className="h-10 w-10 bg-gray-300 rounded-xl"/>
                  <div className="h-10 w-10 bg-gray-300 rounded-xl"/>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-6 w-full bg-gray-300 rounded-full"/>
                <div className="h-4 w-1/2 bg-gray-300 rounded-full mt-2"/>
              </div>

              <div className="border-t my-4"/>

              <div className="h-6 w-1/2 bg-gray-300 rounded-full"/>
              <div className="h-4 w-1/3 bg-gray-300 rounded-full mt-2"/>

              <div className="mt-2">
                <Progress progress="0" color="dark"/>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="h-4 w-1/3 bg-gray-300 rounded-full"/>
                <div className="h-4 w-1/3 bg-gray-300 rounded-full"/>
              </div>

              <div className="border-t my-4"/>

              <div className="text-center">
                <div className="h-full flex justify-between items-center">
                  <div className="h-4 w-1/4 bg-gray-300 rounded-full"/>
                  <div className="h-4 w-1/4 bg-gray-300 rounded-full"/>
                </div>
              </div>
              
              <div className="text-center mt-1">
                <div className="h-full flex justify-between items-center">
                  <div className="h-4 w-1/4 bg-gray-300 rounded-full"/>
                  <div className="h-4 w-1/4 bg-gray-300 rounded-full"/>
                </div>
              </div>
              
              <div className="border-t my-4"/>

              <div className="h-4 w-full bg-gray-300 rounded-full"/>

            </div>
        : <div className="card hover:cursor-pointer hover:ring-2 overflow-hidden" 
          onClick={()=>{
            router.push(`/lend/${poolId}`)
          }}
        >
          <div className="flex items-start gap-4 justify-between">
            <div className="card !p-0">
              <img src={poolDetail?.image} className="h-24 w-24 p-2 object-contain" alt="Wagon Logo" />
            </div>
            <div className="flex gap-2">
              <img src="/network/logo-bnb.png" className="h-10" alt="Stable coin Logo" />  
              <img src={poolDetail?.properties.currency_logo} className="h-10" alt="Stable coin Logo" />  
              <div className="bg-green-500 h-10 w-10 rounded-xl text-white flex items-center justify-center">
                <p className="text-base font-bold">{poolDetail?.properties.rating}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="font-semibold">{poolDetail?.name}</h5>
            <p className="text-base text-gray-500">{poolDetail?.sub_name}</p>
          </div>

          <div className="border-t my-4"/>

          <p className="text-2xl font-bold">{numberWithCommas(tokenMaxSupply)} {symbol}</p>

          <p className="text-sm mt-2 font-semibold text-gray-700">Progress ({
            (pool?.status > 2)
            ? collectedPrincipal / tokenMaxSupply * 100
            : tokenSupply / tokenMaxSupply * 100
            }%)</p>
          
          <div className="mt-2">
            <Progress progress={
              (pool?.status > 2)
              ? collectedPrincipal/tokenMaxSupply * 100
              : tokenSupply/tokenMaxSupply * 100  
            } color="dark"/>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-semibold text-gray-700">{
              (pool?.status > 2)
              ? numberWithCommas(collectedPrincipal)
              : numberWithCommas(tokenSupply)
            } {symbol}</p>
            <p className="text-sm font-semibold text-gray-700">{numberWithCommas(tokenMaxSupply)} {symbol}</p>
          </div>

          <div className="border-t my-4"/>

          <div className="text-center">
            <div className="h-full flex justify-between items-center">
              <p className="text-sm">Fixed APY</p>
              <p className="text-sm font-semibold">{numberWithCommas(apy, 2)}%</p>
            </div>
          </div>
          
          <div className="text-center mt-1">
            <div className="h-full flex justify-between items-center">
              <p className="text-sm">Loan Term</p>
              <p className="text-sm font-semibold">{formatTime(parseFloat(pool?.loanTerm))}</p>
            </div>
          </div>
          
          {
            pool?.status == 1 &&
            <>
              <div className="border-t my-4"/>    
              <CountdownTimer targetEpoch={parseInt(pool?.collectionTermEnd)}/>
            </>
          }

        </div>
      }
    </>
  )
}