import { Progress } from 'flowbite-react';
import { MdSecurity } from "react-icons/md";
import { useEffect, useState } from "react";

import { numberWithCommas } from '../../util/stringUtility';
import { calculateApy, formatTime } from '../../util/lendingUtility';
import CountdownTimer from '../../components/general/CountdownTimer';
import { FaTruck } from "react-icons/fa";
import LoadingPoolDetailCard from './LoadingPoolDetailCard';

export default function PoolDetailCard(props) {

    const poolId = props.poolId;
    const poolJson = props.poolJson;
    const pool = props.pool;
    const symbol = props.symbol;
    const decimal = props.decimal;

    const activePool = props.activePool;
    const poolMaxSupply = props.poolMaxSupply;
    const poolSupply = props.poolSupply;

    const [apy, setApy] = useState(0);

    useEffect(()=>{
        if(pool != null) {
            setApy(calculateApy(pool));
        }
    },[pool])

    function getCollectedPrincipalDecimal() {
        if(activePool == null) return 0;
        return parseFloat(activePool[0]) / Math.pow(10, decimal);
      }

    function getPoolMaxSupplyDecimal() {
        if(poolMaxSupply == null) return 0;
        return parseFloat(poolMaxSupply) / Math.pow(10, decimal);
    }

    function getPoolSupplyDecimal() {
        if(poolSupply == null) return 0;
        return parseFloat(poolSupply) / Math.pow(10, decimal);
    }

    function getPoolProgress() {
        if(pool == null) return 0;
        if(getPoolMaxSupplyDecimal() == 0) return 0;

        if(parseFloat(pool.status) >= 2) {
          return getCollectedPrincipalDecimal() / getPoolMaxSupplyDecimal() * 100
        } else {
          return getPoolSupplyDecimal() / getPoolMaxSupplyDecimal() * 100
        }
    }

    function getPoolProgressSupply() {
        if(pool == null) return 0;
        if(parseFloat(pool.status) >= 2) {
            return numberWithCommas(getCollectedPrincipalDecimal())
        } else {
            if(poolSupply == null) return 0;
            return numberWithCommas(getPoolSupplyDecimal())
        }
    }

    function getCollectedWag() {
        if(pool == null) return 0;
        if(parseFloat(pool.status) >= 2) {
            return numberWithCommas(getCollectedPrincipalDecimal() * parseFloat(pool.stabletoPairRate) / Math.pow(10,18) )
        } else {
            if(poolSupply == null) return 0;
            return numberWithCommas(getPoolSupplyDecimal() * parseFloat(pool.stabletoPairRate) / Math.pow(10,18) )
        }
    }

    function getPoolMaxWag() {
        if(poolMaxSupply == null) return 0;
        return parseFloat(poolMaxSupply) * parseFloat(pool.stabletoPairRate) / Math.pow(10,18) / Math.pow(10,decimal);
    }

  return (
    <>
        {
            pool == null || poolJson == null
            ? <LoadingPoolDetailCard/>
            : <div className='card space-y-4 sticky top-20'>
                <div className='flex-1 flex flex-col md:flex-row items-center gap-4'>
                    <div className="flex-none card relative !p-2">
                        <img src={poolJson?.image} className="h-32 w-32 p-2 object-contain" alt="Project Logo" />
                    </div>
                
                    <div className='flex flex-col md:ml-6 gap-4'>
                        <div className="grow">
                            <h2 className="text-3xl font-semibold">{poolJson?.name}</h2>
                            <h5 className="italic font-light text-gray-500">{poolJson?.sub_name}</h5>
                        </div>
                        <div className='flex gap-4 items-center'>
                            <div>
                            <div className='flex-none flex items-center gap-1 bg-blue-100 border-gray-400 border w-fit px-4 py-1 rounded-xl'>
                                <MdSecurity size={12} />
                                <p className='text-xs'>Secured by <span className='font-bold'>{poolJson?.properties.secured_by}</span></p>
                            </div>
                            </div>

                            <div className="flex gap-2">
                                <img src="/network/logo-bnb.png" className="h-10" alt="Stable coin Logo" />  
                                <img src={poolJson?.properties.currency_logo} className="h-10" alt="Stable coin Logo" />  
                            </div>
                        </div>
                    </div>
                </div>

                <p className='text-sm whitespace-pre-line text-justify'>
                    {poolJson?.description}
                </p>

                <div className="flex items-center gap-1">
                    <FaTruck size={16} className=""/>
                    <p 
                        onClick={()=>{window.open(poolJson?.properties.website, poolJson?.properties.website);}}
                        className="text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
                    >
                        {poolJson?.properties.website}
                    </p>
                </div>

                <div className="border-t"/>

                <div>
                    <p className="text-sm font-semibold text-gray-700">
                        Progress ({getPoolProgress()}%)
                    </p>
                
                    <div className="mt-1">
                        <Progress progress={ getPoolProgress() } color="dark"/>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-semibold text-gray-700">
                            {getPoolProgressSupply()} {symbol}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                            {numberWithCommas(getPoolMaxSupplyDecimal())} {symbol}
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-semibold text-gray-700">
                            {getCollectedWag()} WAG
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                            {numberWithCommas(getPoolMaxWag())} WAG
                        </p>
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
                    <p className='text-sm font-bold'>{formatTime(parseFloat(pool?.loanTerm))}</p>
                    </div>
                    <div className='flex justify-between'>
                    <p className='text-sm'>Liquidity</p>
                    <p className='text-sm font-bold'>{poolJson?.properties.payment_freuency}</p>
                    </div>
                </div>

                {
                    pool?.status == 1 &&
                    <>
                        <div className="border-t"/>
                        <CountdownTimer targetEpoch={parseInt(pool?.collectionTermEnd)}/>
                    </>
                }

                </div>
        }
    </>
  );
};