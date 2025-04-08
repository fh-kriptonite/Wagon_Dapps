import { numberWithCommas } from "../../util/stringUtility";
import { useEffect } from "react";
import { useRouter } from 'next/router';
import { Badge, Progress, Spinner } from "flowbite-react";
import { formatTime } from "../../util/lendingUtility";
import { MdSecurity } from "react-icons/md";
import useGetOffchainPoolJsonHook from "./utils/useGetOffchainPoolJsonHook";

interface Pool {
  status: string | number;
  [key: string]: any;
}

interface PoolJson {
  name: string;
  sub_name: string;
  image: string;
  properties: {
    principal: number;
    APY: number;
    term: string;
    currency: string;
    rating: number;
    type: string;
  };
}

interface PoolCardOffChainProps {
  pool: Pool;
  poolId: string;
}

export default function PoolCardOffChain({ pool, poolId }: PoolCardOffChainProps) {
  const router = useRouter();
  const {isLoading: isLoadingPoolJson, data: poolJson, fetchData: getPoolJson} = useGetOffchainPoolJsonHook();

  useEffect(()=>{
    if (poolId != null) {
      getPoolJson(poolId)
    }
  }, [poolId])

  function getPrincipal(): number {
    if(poolJson == null) return 0;
    return (poolJson as PoolJson).properties.principal;
  }
  
  function getApy(): number {
    if(poolJson == null) return 0;
    return (poolJson as PoolJson).properties.APY;
  }

  function getLoanTerm(): string {
    if(poolJson == null) return "0";
    return (poolJson as PoolJson).properties.term;
  }

  function getPoolStatus(): number {
    return typeof pool.status === 'string' ? parseInt(pool.status) : pool.status;
  }

  function getSymbol(): string {
    if(poolJson == null) return "";
    return (poolJson as PoolJson).properties.currency;
  }

  function getBadgeColor(): string {
    if(getPoolStatus() === 1) return "success"
    if(getPoolStatus() === 2) return "success"
    if(getPoolStatus() === 3) return "success"

    return "dark"
  }

  function getBadgeString(): string {
    if(getPoolStatus() === 1) return "Open To Lend"
    if(getPoolStatus() === 2) return "Ongoing Lend"
    if(getPoolStatus() === 3) return "Done"

    return "Disabled"
  }

  function getBadgePulseColor(): string {
    if(getPoolStatus() === 1) return "bg-green-400"
    if(getPoolStatus() === 2) return "bg-green-400"
    if(getPoolStatus() === 3) return "bg-green-400"

    return "bg-gray-400"
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
                <Progress progress={0} color="dark"/>
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

            </div>
        : <div className="card hover:cursor-pointer hover:ring-2 border border-blue-200 overflow-hidden !p-0" 
          onClick={()=>{
            router.push(`/lend/offchain/${poolId}`)
          }}
        >
          <div className="bg-blue-200 w-full text-sm font-semibold text-center p-2 text-blue-900">
            Institutional Investment
          </div>

          <div className="p-4">
            <div className="flex items-start gap-4 justify-between">
              <div className="card !p-0">
                <img src={(poolJson as PoolJson).image} className="h-24 w-24 p-2 object-contain" alt="Wagon Logo" />
              </div>
              <div className="space-y-2">
                <Badge color={getBadgeColor()} size={"sm"} style={{width:"fit-content", marginLeft:"auto", borderRadius:"10px"}}>
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-3 w-3">
                      <span className={`${getBadgePulseColor()} animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
                      <span className={`${getBadgePulseColor()} relative inline-flex rounded-full h-3 w-3`}></span>
                    </span>
                    {getBadgeString()}
                  </div>
                </Badge>
                <div className="flex gap-2 justify-end items-center">
                  <div className='flex-none flex items-center gap-1 bg-gray-200 h-fit w-fit px-4 py-1 rounded-xl'>
                      <p className='text-xs'><span className='font-bold'>Off Chain</span></p>
                  </div>
                  <div className="bg-green-500 h-8 w-8 rounded-xl text-white flex items-center justify-center">
                    <p className="text-base font-bold">{(poolJson as PoolJson).properties.rating}</p>
                  </div>
                </div>

                <div className='flex-none flex items-center gap-1 bg-blue-100 border-gray-400 border w-fit px-4 py-1 rounded-xl'>
                    <MdSecurity size={12} />
                    <p className='text-xs'><span className='font-bold'>{(poolJson as PoolJson).properties.type}</span></p>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <h5 className="font-semibold">{(poolJson as PoolJson).name}</h5>
              <p className="text-base text-gray-500">{(poolJson as PoolJson).sub_name}</p>
            </div>

            <div className="border-t my-2"/>

            <p className="text-2xl font-bold">{numberWithCommas(getPrincipal())} {getSymbol()}</p>

            <p className="text-sm mt-1 font-semibold text-gray-700">
              Progress ({ numberWithCommas(100, 2) }%)</p>
            
            <div className="mt-2">
              <Progress progress={100} color="dark"/>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-sm font-semibold text-gray-700">
                { numberWithCommas(getPrincipal()) } {getSymbol()}
              </p>
              <p className="text-sm font-semibold text-gray-700">
                {numberWithCommas(getPrincipal())} {getSymbol()}
              </p>
            </div>

            <div className="border-t my-2"/>

            <div className="text-center">
              <div className="h-full flex justify-between items-center">
                <p className="text-sm">Fixed APY</p>
                <p className="text-sm font-semibold">{numberWithCommas(getApy(), 2)}%</p>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
} 