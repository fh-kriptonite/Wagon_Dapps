import { IoShieldCheckmarkSharp } from "react-icons/io5";

export default function PoolCustody(props) {
  const poolJson = props.poolJson;

    if(poolJson == null)
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
      )

    if(poolJson.properties.custody == null) 
      return <></>

    return (
    <>
      <div className='card space-y-2'>
          <h6 className="!font-semibold">Asset Custody & Security</h6>

          <div className="flex items-center justify-center text-blue-600 font-bold text-2xl !my-6">
            <IoShieldCheckmarkSharp className="w-6 h-6 mr-2" /> SECURED
          </div>
          <div className="space-y-1">
            <div className='flex justify-between gap-4'>
              <p className='text-sm'>Custodian</p>
              <p className='text-sm text-end font-bold'>{poolJson.properties.custody.custodian}</p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='text-sm'>Assets</p>
              <div>
                {
                  (poolJson.properties.custody.assets).map((asset, index) =>{
                    return (
                      <p key={"custody-"+index} className='text-sm text-end font-bold'>{asset}</p>
                    )
                  })
                }
              </div>
            </div>
          </div>
      </div>
    </>
  );
};