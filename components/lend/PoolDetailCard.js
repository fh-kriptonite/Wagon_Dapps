import { MdSecurity } from "react-icons/md";

import { FaTruck } from "react-icons/fa";
import LoadingPoolDetailCard from './LoadingPoolDetailCard';

export default function PoolDetailCard(props) {

    const poolJson = props.poolJson;
    const pool = props.pool;

  return (
    <>
        {
            pool == null || poolJson == null
            ? <LoadingPoolDetailCard/>
            : <div className='card space-y-4'>
                <div className='flex-1 flex flex-col md:flex-row items-center gap-4'>
                    <div className="flex-none card relative !p-2">
                        <img src={poolJson?.image} className="h-32 w-32 p-2 object-contain" alt="Project Logo" />
                    </div>
                
                    <div className='flex flex-col md:ml-6 gap-2'>
                        <div className="grow">
                            <h2 className="text-3xl font-semibold">{poolJson?.name}</h2>
                            <h5 className="italic font-light text-gray-500">{poolJson?.sub_name}</h5>
                        </div>
                        <div className='flex gap-4 items-center'>
                            <div>
                            <div className='flex-none flex items-center gap-1 bg-blue-100 border-gray-400 border w-fit px-4 py-1 rounded-xl'>
                                <MdSecurity size={12} />
                                <p className='text-xs'>Secured <span className='font-bold'>{poolJson?.properties.type}</span></p>
                            </div>
                            </div>

                            <div className="flex gap-2">
                                <img src="/network/logo-bnb.png" className="h-10" alt="Stable coin Logo" />  
                                <img src={poolJson?.properties.currency_logo} className="h-10" alt="Stable coin Logo" />  
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaTruck size={16} className=""/>
                            <p 
                                onClick={()=>{window.open(poolJson?.properties.website, poolJson?.properties.website);}}
                                className="text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
                            >
                                {poolJson?.properties.website}
                            </p>
                        </div>
                    </div>
                </div>

                <p className='text-sm whitespace-pre-line text-justify'>
                    {poolJson?.description}
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {
                    poolJson.properties.highlights.map((highlight, index) => {
                      return(
                        <div className='card !bg-blue-100 text-slate-800' key={`highligh-${index}`}>
                          <p className='text-sm font-bold'>{highlight.title}</p>
                          <p className='text-sm mt-2'>{highlight.description}</p>
                        </div>
                      )
                    })
                  }
                </div>

            </div>
        }
    </>
  );
};