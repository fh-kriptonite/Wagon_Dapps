import { useState, useEffect } from "react";
import OverviewCard from "./OverviewCard";
import PoolCard from "./PoolCard";
import { MdOpenInNew } from "react-icons/md";

import { getPoolsService } from "../../services/service_lending";

export default function LendHome(props) {
  const [selectedStatus, setSelectedStatus] = useState(1)
  const [pools, setPools] = useState([])

  async function getPools() {
    try {
      const data = await getPoolsService(selectedStatus)
      setPools(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getPools();
  }, [])

  useEffect(()=>{
    getPools();
  },[selectedStatus]);

  return (
    <div className='container mx-auto px-4 md:px-10 max-w-7xl'>
      <OverviewCard/>
      
      <h2 className="mt-10 font-semibold">Wagon Lending Pools</h2>
        
      <div className="flex items-center gap-1 text-blue-500 hover:text-blue-800 hover:cursor-pointer mt-2 w-full md:w-fit"
        onClick={()=>{window.open(process.env.BNB_EXPLORER + "address/" + process.env.LENDING_ADDRESS_BNB, '_blank');}}
      >
        <p className="text-sm truncate overflow-hidden">{process.env.LENDING_ADDRESS_BNB}</p>
        <MdOpenInNew size={16} className=""/>
      </div>
      
      <p className="text-sm mt-2">Lend to pools managed by Wagon Network DAO, where borrowers and loans are reviewed and approved by WAG stakers.</p>

      <div className="flex gap-4 justify-item-center mt-4">
        <p className={`text-base mt-2 hover:cursor-pointer px-4 hover:text-slate-800 ${selectedStatus == 1 ? "text-gray-800" : "text-gray-400"}`}
          onClick={()=>{
            setSelectedStatus(1)
          }}
        >Open</p>
        <p className={`text-base mt-2 hover:cursor-pointer px-4 hover:text-slate-800 ${selectedStatus == 2 ? "text-gray-800" : "text-gray-400"}`}
          onClick={()=>{
            setSelectedStatus(2)
          }}
        >Active</p>
        <p className={`text-base mt-2 hover:cursor-pointer px-4 hover:text-slate-800 ${selectedStatus == 3 ? "text-gray-800" : "text-gray-400"}`}
          onClick={()=>{
            setSelectedStatus(3)
          }}
        >Close</p>
      </div>

      {
        pools.length > 0
        ? <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 mb-6">
            {
              pools.map((pool, index)=>{
                return (
                  <div key={`poolCard-${pool.pool_id}-${selectedStatus}`} id={`poolCard-${pool.pool_id}-${selectedStatus}`}>
                    <PoolCard poolId={pool.pool_id}/>
                  </div>
                )
              })
            }
          </div>
        : <div className="h-80 flex items-center justify-center">
            <p className="mt-5 text-sm text-center">No pools</p>
        </div>
      }
    </div>
  )
}