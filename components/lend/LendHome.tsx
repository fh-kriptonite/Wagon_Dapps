import { useState, useEffect } from "react";
import OverviewCard from "./OverviewCard";
import PoolCard from "./PoolCard";
import { MdOpenInNew } from "react-icons/md";
import { services, Pool } from "../../services/service_lending";
import PoolCardComingSoon from "./PoolCardComingSoon";
import PoolCardOffChain from "./PoolCardOffChain";
import { HiShieldCheck, HiExclamationCircle } from "react-icons/hi2";
import { Button } from "flowbite-react";

interface LendHomeProps {
  [key: string]: any;
}

export default function LendHome(props: LendHomeProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("1")
  const [pools, setPools] = useState<Pool[]>([])

  async function getPools(): Promise<void> {
    try {
      const data = await services.getPools(selectedStatus)
      setPools(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getPools();
  },[selectedStatus]);

  const themeSkin = Number(process.env.THEME_SKIN || '0');

  return (
    <div className='container mx-auto space-y-4'>
      {/* Header Section */}
      <div className="flex-1">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 md:p-8 text-white shadow-lg">
              <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-3 md:gap-4">
                          <div className="bg-white/10 p-2 md:p-3 rounded-xl backdrop-blur-sm">
                              <HiShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                          </div>
                          <div>
                              <h2 className="text-xl md:text-3xl font-bold">Lending Pools</h2>
                              {
                                themeSkin === 1
                                ? <p className="text-blue-100 mt-1 md:mt-2 text-xs md:text-base">Lend to pools managed by Wagon Network DAO, where borrowers and loans are reviewed and approved by WAG stakers.</p>
                                : <p className="text-blue-100 mt-1 md:mt-2 text-xs md:text-base">Lend to pools managed by DAO, where borrowers and loans are reviewed and approved by votes.</p>
                              }
                          </div>
                      </div>
                      <Button 
                          color={"dark"} 
                          size={"sm"} 
                          className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm"
                          onClick={()=>{window.open(process.env.BNB_EXPLORER + "address/" + process.env.LENDING_ADDRESS_BNB, '_blank');}}
                      >
                          <MdOpenInNew className="w-4 h-4 md:w-5 md:h-5" />
                          <span className="font-medium text-sm md:text-base">Smart Contract</span>
                      </Button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                      <p className="text-xs md:text-sm text-blue-100">BSC Smart contract:</p>
                      <div 
                          className="flex items-center gap-1 font-bold hover:text-blue-800 hover:cursor-pointer w-full md:w-fit"
                          onClick={()=>{window.open(process.env.BNB_EXPLORER + "address/" + process.env.LENDING_ADDRESS_BNB, '_blank');}}
                      >
                          <p className="text-xs md:text-sm truncate overflow-hidden">{process.env.LENDING_ADDRESS_BNB}</p>
                          <MdOpenInNew size={14} className="md:w-4 md:h-4"/>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <OverviewCard/>
      
      <div className="card bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
            <button 
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                selectedStatus === "1" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSelectedStatus("1")}
            >
              <span className="font-medium">Open</span>
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                selectedStatus === "2" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSelectedStatus("2")}
            >
              <span className="font-medium">Active</span>
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                selectedStatus === "3" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSelectedStatus("3")}
            >
              <span className="font-medium">Close</span>
            </button>
          </div>

          {/* Pools Grid */}
          {
            pools.length > 0
            ? <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {
                  pools.map((pool, index) => (
                    <div 
                      key={`poolCard-${pool.pool_id}-${selectedStatus}`} 
                      id={`poolCard-${pool.pool_id}-${selectedStatus}`}
                      className="transition-all duration-200 hover:scale-[1.02]"
                    >
                      {
                        (pool.status === "0")
                        ? <PoolCardComingSoon/>
                        : (pool.network === "OFFCHAIN")
                          ? <PoolCardOffChain pool={pool} poolId={pool.pool_id}/>
                          : <PoolCard poolId={pool.pool_id}/>
                      }
                    </div>
                  ))
                }
              </div>
            : <div className="flex flex-col items-center justify-center py-12">
                <div className="flex flex-col items-center justify-center gap-2">
                    <HiExclamationCircle className="w-10 h-10 text-gray-500" />
                    <p className="text-gray-500 text-center">No pools available</p>
                    <p className="text-gray-500 text-center">Please wait for the next pool to be opened</p>
                  </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
} 