import { numberWithCommas } from "../../util/stringUtility";
import { useRouter } from 'next/router';
import { Badge, Progress } from "flowbite-react";
import { MdSecurity } from "react-icons/md";
import { HiCurrencyDollar, HiLockClosed } from "react-icons/hi2";
import { MdOutlineAccessTime } from "react-icons/md";
import { Pool } from "./types";

interface PoolCardOffChainProps {
  pool: Pool;
  poolId: string;
}

export default function PoolCardOffChain({ pool, poolId }: PoolCardOffChainProps) {
  const router = useRouter();

  function getPrincipal(): number {
    if(pool == null) return 0;
    return Number(pool.detail.principal);
  }

  function getAvailable(): number {
    return 0;
  }
  
  function getApy(): number {
    if(pool == null) return 0;
    return Number(pool.detail.apy);
  }

  function getLoanTerm(): string {
    if(pool == null) return "0";
    return pool.detail.term;
  }

  function getPoolStatus(): number {
    return typeof pool.status === 'string' ? parseInt(pool.status) : pool.status;
  }

  function getSymbol(): string {
    if(pool == null) return "";
    return pool.detail.currency;
  }

  function getBadgeColor(): string {
    if(getPoolStatus() === 1) return "success"
    if(getPoolStatus() === 2) return "success"
    if(getPoolStatus() === 3) return "success"

    return "dark"
  }

  function getBadgeString(): string {
    if(getPoolStatus() === 1) return "Open To Lend"
    if(getPoolStatus() === 2) return "Active"
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
        pool == null
        ? <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm animate-pulse">
            <div className="space-y-3 md:space-y-4">
                <div className="h-5 md:h-6 w-3/4 bg-gray-200 rounded-full"/>
                <div className="h-4 w-1/2 bg-gray-200 rounded-full"/>
                <div className="h-24 md:h-32 bg-gray-200 rounded-xl"/>
            </div>
        </div>
        : <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
            onClick={() => {
              router.push(`/lend/offchain/${pool.id}`);
            }}
          >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <img src={pool.detail.image} className="h-8 w-8 md:h-10 md:w-10 object-contain" alt="Pool Logo" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate" title={pool.detail.name}>
                    {pool.detail.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 truncate" title={pool.detail.sub_name}>
                    {pool.detail.sub_name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge color={getBadgeColor()} size="sm" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`${getBadgePulseColor()} w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse`}></span>
                    <span className="text-xs md:text-sm">{getBadgeString()}</span>
                  </div>
                </Badge>
                <Badge color="warning" size="sm" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-400"></span>
                    <span className="text-xs md:text-sm">Institutional</span>
                  </div>
                </Badge>
              </div>
            </div>

            {/* Pool Details */}
            <div className="space-y-4 md:space-y-6">
              {/* Pool Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1 md:mb-2">
                    <HiCurrencyDollar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">Pool Size</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl md:text-2xl font-bold text-gray-900 truncate" title={`${numberWithCommas(getPrincipal())} ${getSymbol()}`}>
                      {numberWithCommas(getPrincipal())}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                      {getSymbol()}
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 md:p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-1 md:mb-2">
                    <HiLockClosed className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">Expected Yield</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {numberWithCommas(getApy(), 2)}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Filled</span>
                  <span className="font-medium text-gray-900">100%</span>
                </div>
                <Progress progress={100} color="blue" size="lg" />
                <div className="flex justify-between text-xs md:text-sm text-gray-500">
                  <span>
                    Available on market:
                  </span>
                  <span className="truncate">
                    {numberWithCommas(getAvailable())} tokens left
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <MdOutlineAccessTime className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">Loan Term</span>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">
                    {getLoanTerm()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <MdSecurity className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    <span className="text-xs md:text-sm font-medium text-gray-600">Type</span>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">
                    {pool.detail.type}
                  </p>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  );
} 