import { useEffect, useState } from "react";

import { numberWithCommas } from '../../util/stringUtility';
import { calculateApy, formatTime } from '../../util/lendingUtility';
import CountdownTimer from '../../components/general/CountdownTimer';
import { Progress } from 'flowbite-react';


export default function PoolOverviewCard(props) {
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

  function showWagPair() {
      if(!pool) return false;
      if(pool.stabletoPairRate == 0) return false

      return true;
  }

    return (
    <>
        {
            pool == null
            ? <div className='card space-y-6'>
                <h6 className="!font-semibold">Overview</h6>
                <div>
                  <div className='flex'>
                    <div className='flex-1 p-4 border rounded-tl-lg'>
                      <p className='text-sm font-light'>Principal</p>
                      <div className="h-6 w-full bg-gray-300 rounded-full mt-2"/>
                    </div>
                    <div className='flex-1 p-4 border border-l-0 rounded-tr-lg'>
                      <p className='text-sm font-light'>Interest</p>
                      <div className="h-6 w-full bg-gray-300 rounded-full mt-2"/>
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='flex-1 p-4 border border-t-0 rounded-bl-lg'>
                      <p className='text-sm font-light'>Total</p>
                      <div className="h-6 w-full bg-gray-300 rounded-full mt-2"/>
                    </div>
                    <div className='flex-1 p-4 border border-t-0 border-l-0 rounded-br-lg'>
                      <p className='text-sm font-light'>Pool status</p>
                      <div className="h-6 w-full bg-gray-300 rounded-full mt-2"/>
                    </div>
                  </div>
                </div>
              </div>
            : <div className='card space-y-2'>
                <h6 className="!font-semibold">Overview</h6>
                <div>
                    <p className="text-sm font-semibold text-gray-700">
                        Progress ({ numberWithCommas(getPoolProgress(), 2) }%)
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
                    
                    {
                        showWagPair() &&
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-sm font-semibold text-gray-700">
                                {getCollectedWag()} WAG
                            </p>
                            <p className="text-sm font-semibold text-gray-700">
                                {numberWithCommas(getPoolMaxWag())} WAG
                            </p>
                        </div>
                    }
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
                      <p className='text-sm'>Repayment structure</p>
                      <p className='text-sm font-bold'>{poolJson?.properties.repayment_structure}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='text-sm'>Payment Frequency</p>
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