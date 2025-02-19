import { numberWithCommas } from '../../util/stringUtility';
import { Progress } from 'flowbite-react';


export default function PoolOverviewCardOffchain(props) {
  const poolJson = props.poolJson;

  function getPrincipal() {
    if(poolJson == null) return 0;
    return poolJson.properties.principal;
  }
  
  function getApy() {
    if(poolJson == null) return 0;
    return poolJson.properties.APY;
  }

  function getLoanTerm() {
    if(poolJson == null) return 0;
    return poolJson.properties.term;
  }

  function getSymbol() {
    if(poolJson == null) return "";
    return poolJson.properties.currency;
  }

    return (
    <>
        {
            poolJson == null
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
                        Progress ({ numberWithCommas(100, 2) }%)
                    </p>
                
                    <div className="mt-1">
                        <Progress progress={ 100 } color="dark"/>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-semibold text-gray-700">
                            {numberWithCommas(getPrincipal())} {getSymbol()}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                            {numberWithCommas(getPrincipal())} {getSymbol()}
                        </p>
                    </div>
                </div>

                <div className="border-t"/>

                <div className="space-y-1">
                    <div className='flex justify-between'>
                      <p className='text-sm'>Fixed APY</p>
                      <p className='text-sm font-bold'>{numberWithCommas(getApy(), 2)}%</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='text-sm'>Loan term</p>
                      <p className='text-sm font-bold'>{getLoanTerm()}</p>
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
            </div>
        }
    </>
  );
};