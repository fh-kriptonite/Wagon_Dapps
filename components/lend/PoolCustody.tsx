import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { Pool } from "./types";
import { HiOutlineShieldCheck, HiOutlineUser, HiOutlineDocumentText, HiOutlineStar, HiOutlineCube } from "react-icons/hi2";
import { FaExternalLinkAlt } from "react-icons/fa";
import { shortenAddress } from "@/util/stringUtility";

interface PoolCustodyProps {
  pool: Pool | null;
}

export default function PoolCustody({ pool }: PoolCustodyProps) {
  if(pool == null)
    return (
      <div className='card space-y-6'>
          <h6 className="!font-semibold">Asset Custody & Security</h6>

          <div className="flex items-center justify-center text-blue-600 font-bold text-2xl !my-6">
            <div className="h-9 w-1/2 bg-gray-300 rounded-full"/>
          </div>
          <div className="space-y-1">
            <div className='flex justify-between'>
              <p className='text-sm'>Custodian</p>
              <div className="h-4 w-1/2 bg-gray-300 rounded-full"/>
            </div>
            <div className='flex justify-between'>
              <p className='text-sm'>Assets</p>
              <div className="h-4 w-1/2 bg-gray-300 rounded-full mt-2"/>
            </div>
          </div>
        </div>
    );

  if(pool.detail.custodian == null) 
    return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <HiOutlineShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pool Custody</h3>
            <p className="text-sm text-gray-500">Managed by {pool.detail.custodian}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center text-blue-600 font-bold text-2xl">
        <IoShieldCheckmarkSharp className="w-6 h-6 mr-2" /> SECURED
      </div>
      
      {
        pool.assets.length > 0 &&
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HiOutlineCube className="w-5 h-5 text-gray-600" />
            <p className="text-sm font-medium text-gray-900">Assets</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
            {pool.assets.map((asset, index) => (
              <div 
                key={`custody-${index}`}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <HiOutlineCube className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-900">{asset.asset}</p>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
} 