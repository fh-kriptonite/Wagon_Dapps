import { useEffect } from "react";
import { useRouter } from 'next/router';
import { Badge, Progress } from "flowbite-react";
import useGetPoolJsonHook from "./utils/useGetPoolJsonHook";

export default function PoolCardComingSoon(props) {
  const router = useRouter();

  const poolId = props.poolId;

  const {isLoading: isLoadingPoolJson, data: poolJson, fetchData: getPoolJson} = useGetPoolJsonHook();

  useEffect(()=>{
    if (poolId != null) {
      getPoolJson(poolId);
    }
  }, [])

  function getSymbol() {
    if(poolJson == null) return "";
    return poolJson.properties.currency;
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
        : <div className="card overflow-hidden cursor-not-allowed"
          onClick={()=>{
            // router.push(`/lend/${poolId}`)
          }}
        >
          <div className="flex items-start gap-4 justify-between">
            <div className="card !p-0 relative overflow-hidden">
              <img src={poolJson?.image} className="h-24 w-24 p-2 object-contain" alt="Wagon Logo" />
              <div className="absolute bottom-0 left-0 w-full bg-yellow-100 px-2 py-1">
                <p className="text-xs text-center text-yellow-800 font-semibold">Coming Soon</p>
              </div>
            </div>
            <div className="space-y-4">
              <Badge color={"warning"} size={"sm"} style={{width:"fit-content", marginLeft:"auto", borderRadius:"10px"}}>
                <div className="flex gap-2 items-center">
                  <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
                  </span>
                  Coming Soon
                </div>
              </Badge>
              <div className="flex gap-2">
                <img src="/network/logo-bnb.png" className="h-10" alt="Stable coin Logo" />  
                <img src={poolJson?.properties.currency_logo} className="h-10" alt="Stable coin Logo" />  
                <div className="bg-green-500 h-10 w-10 rounded-xl text-white flex items-center justify-center">
                  <p className="text-base font-bold">{poolJson?.properties.rating}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="font-semibold">{poolJson?.name}</h5>
            <p className="text-base text-gray-500">{poolJson?.sub_name}</p>
          </div>

          <div className="border-t my-4"/>

          <p className="text-2xl font-bold">Coming Soon</p>

          <p className="text-sm mt-2 font-semibold text-gray-700">
            Progress (~)</p>
          
          <div className="mt-2">
            <Progress progress={ 0 } color="dark"/>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-semibold text-gray-700">
              ~ {getSymbol()}
            </p>
            <p className="text-sm font-semibold text-gray-700">
              ~ {getSymbol()}
            </p>
          </div>

          <div className="border-t my-4"/>

          <div className="text-center">
            <div className="h-full flex justify-between items-center">
              <p className="text-sm">Fixed APY</p>
              <p className="text-sm font-semibold">~</p>
            </div>
          </div>
          
          <div className="text-center mt-1">
            <div className="h-full flex justify-between items-center">
              <p className="text-sm">Loan Term</p>
              <p className="text-sm font-semibold">~</p>
            </div>
          </div>
          
          <>
            <div className="border-t my-4"/>    
            <div className="flex justify-between itesm-center">
              <p className="text-sm">Crowdfund start in</p>
              <p className="text-sm font-semibold">Coming Soon</p>
            </div>
          </>

        </div>
      }
    </>
  )
}