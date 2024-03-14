import { Progress } from 'flowbite-react';
import { MdSecurity } from "react-icons/md";
import { useEffect, useState } from "react";

import { numberWithCommas } from '../../util/stringUtility';
import { calculateApy, formatTime } from '../../util/lendingUtility';
import CountdownTimer from '../../components/general/CountdownTimer';
import { FaTruck } from "react-icons/fa";

export default function PoolDetailCard(props) {

    const poolDetailErc1155 = props.poolDetailErc1155;
    const poolDetail = props.poolDetail;
    const isLoading = props.isLoading;
    const symbol = props.symbol;

    const tokenSupply = props.tokenSupply;
    const tokenMaxSupply = props.tokenMaxSupply;

    const collectedPrincipal = props.collectedPrincipal;

    const [apy, setApy] = useState(0);

    useEffect(()=>{
        if(poolDetail != null) {
            setApy(calculateApy(poolDetail));
        }
    },[poolDetail])

  return (
    <>
        {
            isLoading
            ? <div className='card space-y-4 sticky animate-pulse top-20'>
                <div className='flex-1 flex flex-col md:flex-row items-center gap-4'>
                    <div className="flex-none card !p-2 !bg-gray-300">
                    <div className="h-32 w-32 flex items-center justify-center"> 
                        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                        </svg>
                    </div>
                    </div>
                
                    <div className='flex flex-col md:ml-10 gap-4'>
                        <div className="grow">
                            <div className="bg-gray-300 h-5 w-64 rounded-full"></div>
                            <div className="bg-gray-300 h-3 w-32 rounded-full mt-2"></div>
                        </div>
                        <div className='flex gap-4'>
                        <div className='flex-none h-3 w-40 flex items-center gap-1 bg-gray-300 px-4 py-1 rounded-xl'/>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-300 rounded-full"/>
                    <div className="h-3 w-full bg-gray-300 rounded-full"/>
                    <div className="h-3 w-full bg-gray-300 rounded-full"/>
                    <div className="h-3 w-full bg-gray-300 rounded-full"/>
                    <div className="h-3 w-full bg-gray-300 rounded-full"/>
                    <div className="h-3 w-1/2 bg-gray-300 rounded-full"/>
                </div>

                <div className="space-y-2">
                    <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                    <div className="h-3 w-2/6 bg-gray-300 rounded-full"/>
                </div>

                <div>
                    <div className='flex border-t justify-between py-4'>
                    <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                    <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                    </div>
                    <div className='flex border-t justify-between py-4'>
                    <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                    <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                    </div>
                </div>

                </div>
            : <div className='card space-y-4 sticky top-20'>
                <div className='flex-1 flex flex-col md:flex-row items-center gap-4'>
                    <div className="flex-none card relative !p-2">
                        <img src={poolDetailErc1155?.image} className="h-32 w-32 p-2 object-contain" alt="Project Logo" />
                    </div>
                
                    <div className='flex flex-col md:ml-6 gap-4'>
                        <div className="grow">
                            <h2 className="text-3xl font-semibold">{poolDetailErc1155?.name}</h2>
                            <h5 className="italic font-light text-gray-500">{poolDetailErc1155?.sub_name}</h5>
                        </div>
                        <div className='flex gap-4 items-center'>
                            <div>
                            <div className='flex-none flex items-center gap-1 bg-blue-100 border-gray-400 border w-fit px-4 py-1 rounded-xl'>
                                <MdSecurity size={12} />
                                <p className='text-xs'>Secured by <span className='font-bold'>{poolDetailErc1155?.properties.secured_by}</span></p>
                            </div>
                            </div>

                            <div className="flex gap-2">
                                <img src="/network/logo-bnb.png" className="h-10" alt="Stable coin Logo" />  
                                <img src={poolDetailErc1155?.properties.currency_logo} className="h-10" alt="Stable coin Logo" />  
                            </div>
                        </div>
                    </div>
                </div>

                <p className='text-sm whitespace-pre-line text-justify'>
                    {poolDetailErc1155?.description}
                </p>

                <div className="flex items-center gap-1">
                    <FaTruck size={16} className=""/>
                    <p 
                        onClick={()=>{window.open(poolDetailErc1155?.properties.website, poolDetailErc1155?.properties.website);}}
                        className="text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
                    >
                        {poolDetailErc1155?.properties.website}
                    </p>
                </div>

                <div className="border-t"/>

                <div>
                    <p className="text-sm font-semibold text-gray-700">Progress ({
                    (poolDetail?.status > 2)
                    ? collectedPrincipal / tokenMaxSupply * 100
                    : tokenSupply / tokenMaxSupply * 100
                    }%)</p>
                
                    <div className="mt-2">
                    <Progress progress={
                        (poolDetail?.status > 2)
                        ? collectedPrincipal/tokenMaxSupply * 100
                        : tokenSupply/tokenMaxSupply * 100
                        } color="dark"/>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-semibold text-gray-700">
                        {
                        (poolDetail?.status > 2)
                        ? numberWithCommas(collectedPrincipal)
                        : numberWithCommas(tokenSupply)
                        } {symbol}</p>
                    <p className="text-sm font-semibold text-gray-700">{numberWithCommas(tokenMaxSupply)} {symbol}</p>
                    </div>
                </div>

                <div className="border-t"/>

                <div className="space-y-1">
                    <div className='flex justify-between'>
                    <p className='text-sm'>Fixed APY</p>
                    <p className='text-sm font-bold'>{numberWithCommas(apy, 2)}%</p>
                    </div>
                    <div className='flex justify-between'>
                    <p className='text-sm'>Loan term</p>
                    <p className='text-sm font-bold'>{formatTime(parseFloat(poolDetail?.loanTerm))}</p>
                    </div>
                    <div className='flex justify-between'>
                    <p className='text-sm'>Liquidity</p>
                    <p className='text-sm font-bold'>{poolDetailErc1155?.properties.payment_freuency}</p>
                    </div>
                </div>

                {
                    poolDetail?.status == 1 &&
                    <>
                        <div className="border-t"/>
                        <CountdownTimer targetEpoch={parseInt(poolDetail?.collectionTermEnd)}/>
                    </>
                }

                </div>
        }
    </>
  );
};