import { numberWithCommas } from "../../util/stringUtility";
import { useEffect } from "react";
import { useRouter } from 'next/router';
import { Progress } from "flowbite-react";
import CountdownTimer from "../general/CountdownTimer";
import { calculateApy, formatTime, getTokenDecimals } from "../../util/lendingUtility";
import useGetLendingPoolHook from "./utils/useGetLendingPoolHook";
import useGetActivePoolHook from "./utils/useGetActivePoolHook";
import useGetPoolJsonHook from "./utils/useGetPoolJsonHook";
import useGetPoolMaxSupplyHook from "./utils/useGetPoolMaxSupplyHook";
import useGetPoolSupplyHook from "./utils/useGetPoolSupplyHook copy";

export default function PoolCard(props) {
  const router = useRouter();

  const poolId = props.poolId;

  const {data: pool, fetchData: getPool} = useGetLendingPoolHook();
  const {data: activePool, fetchData: getActivePool} = useGetActivePoolHook();
  const {isLoading: isLoadingPoolJson, data: poolJson, fetchData: getPoolJson} = useGetPoolJsonHook();
  const {data: poolMaxSupply, fetchData: getPoolMaxSupply} = useGetPoolMaxSupplyHook();
  const {data: poolSupply, fetchData: getPoolSupply} = useGetPoolSupplyHook();

  useEffect(()=>{
    if (poolId != null) {
      getPoolJson(poolId)
      getPool(poolId);
      getActivePool(poolId);
      getPoolMaxSupply(poolId);
      getPoolSupply(poolId);
    }
  }, [])

  function getCollectedPrincipalDecimal() {
    if(activePool == null) return 0;
    return parseFloat(activePool[0]) / Math.pow(10, getDecimal());
  }

  function getPoolMaxSupplyDecimal() {
    if(poolMaxSupply == null) return 0;
    return parseFloat(poolMaxSupply) / Math.pow(10, getDecimal());
  }

  function getPoolStatus() {
    if(pool == null) return 0;
    return parseFloat(pool.status)
  }

  function getPoolProgress() {
    if(getPoolStatus() >= 2) {
      return getCollectedPrincipalDecimal() / getPoolMaxSupplyDecimal() * 100
    } else {
      return parseFloat(poolSupply) / getPoolMaxSupplyDecimal() * 100
    }
  }

  function getSymbol() {
    if(poolJson == null) return "";
    return poolJson.properties.currency;
  }

  function getDecimal() {
    if(poolJson == null) return 0;
    return getTokenDecimals(poolJson.properties.currency);
  }

  function getPoolProgressSupply() {
    if(getPoolStatus() >= 2) {
      return numberWithCommas(getCollectedPrincipalDecimal())
    } else {
      return numberWithCommas(parseFloat(poolSupply))
    }
  }

  function getApy() {
    if(pool == null) return 0;
    return calculateApy(pool);
  }

  return (
    <>
      {  
        poolJson == null || isLoadingPoolJson
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
              <img src={poolJson?.image} className="h-24 w-24 p-2 object-contain" alt="Wagon Logo" />
            </div>
            <div className="flex gap-2">
              <img src="/network/logo-bnb.png" className="h-10" alt="Stable coin Logo" />  
              <img src={poolJson?.properties.currency_logo} className="h-10" alt="Stable coin Logo" />  
              <div className="bg-green-500 h-10 w-10 rounded-xl text-white flex items-center justify-center">
                <p className="text-base font-bold">{poolJson?.properties.rating}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="font-semibold">{poolJson?.name}</h5>
            <p className="text-base text-gray-500">{poolJson?.sub_name}</p>
          </div>

          <div className="border-t my-4"/>

          <p className="text-2xl font-bold">{numberWithCommas(getPoolMaxSupplyDecimal())} {getSymbol()}</p>

          <p className="text-sm mt-2 font-semibold text-gray-700">
            Progress ({ getPoolProgress() }%)</p>
          
          <div className="mt-2">
            <Progress progress={ getPoolProgress() } color="dark"/>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-semibold text-gray-700">
              { getPoolProgressSupply() } {getSymbol()}
            </p>
            <p className="text-sm font-semibold text-gray-700">
              {numberWithCommas(getPoolMaxSupplyDecimal())} {getSymbol()}
            </p>
          </div>

          <div className="border-t my-4"/>

          <div className="text-center">
            <div className="h-full flex justify-between items-center">
              <p className="text-sm">Fixed APY</p>
              <p className="text-sm font-semibold">{numberWithCommas(getApy(), 2)}%</p>
            </div>
          </div>
          
          <div className="text-center mt-1">
            <div className="h-full flex justify-between items-center">
              <p className="text-sm">Loan Term</p>
              <p className="text-sm font-semibold">{formatTime(parseFloat(pool?.loanTerm))}</p>
            </div>
          </div>
          
          {
            getPoolStatus() == 1 &&
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