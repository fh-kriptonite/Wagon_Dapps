import { numberWithCommas } from '../../util/stringUtility';
import { translateStatus } from '../../util/lendingUtility';
import { useEffect, useState } from 'react';

export default function PoolOverviewCard(props) {
    const isLoading = props.isLoading;
    const decimal = props.decimal;
    const poolDetail = props.poolDetail;
    const symbol = props.symbol;

    const [principal, setPrincipal] = useState(0);
    const [interest, setInterest] = useState(0);

    useEffect(()=>{
        if(poolDetail != null) {
          setPrincipal(poolDetail?.targetLoan / Math.pow(10,decimal));
          setInterest(poolDetail?.targetInterestPerPayment * poolDetail?.paymentFrequency / Math.pow(10,decimal));
        }
    },[poolDetail])

    return (
    <>
        {
            isLoading
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
            : <div className='card space-y-6'>
                <h6 className="!font-semibold">Overview</h6>
                <div>
                  <div className='flex'>
                    <div className='flex-1 p-4 border rounded-tl-lg'>
                      <p className='text-sm font-light'>Principal</p>
                      <p className='text-xl font-semibold mt-1'>{numberWithCommas(principal)} {symbol}</p>
                    </div>
                    <div className='flex-1 p-4 border border-l-0 rounded-tr-lg'>
                      <p className='text-sm font-light'>Interest</p>
                      <p className='text-xl font-semibold mt-1'>{numberWithCommas(interest)} {symbol}</p>
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='flex-1 p-4 border border-t-0 rounded-bl-lg'>
                      <p className='text-sm font-light'>Total</p>
                      <p className='text-xl font-semibold mt-1'>{numberWithCommas(principal + interest)} {symbol}</p>
                    </div>
                    <div className='flex-1 p-4 border border-t-0 border-l-0 rounded-br-lg'>
                      <p className='text-sm font-light'>Pool status</p>
                      <p className='text-xl font-semibold mt-1'>{translateStatus(poolDetail?.status)}</p>
                    </div>
                  </div>
                </div>
            </div>
        }
    </>
  );
};