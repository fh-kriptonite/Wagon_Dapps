import { numberWithCommas } from '../../util/stringUtility';
import { translateStatus } from '../../util/lendingUtility';

export default function PoolOverviewCard(props) {
    const pool = props.pool;
    const symbol = props.symbol;
    const decimal = props.decimal;

    function getPrincipal() {
      if(pool == null) return 0;
      return parseFloat(pool.targetLoan) / Math.pow(10,decimal)
    }

    function getTargetInterest() {
      if(pool == null) return 0;
      return parseFloat(pool.targetInterestPerPayment) * parseFloat(pool.paymentFrequency) / Math.pow(10,decimal)
    }

    function getPoolStatus() {
      if(pool == null) return 0;
      return pool.status
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
            : <div className='card space-y-6'>
                <h6 className="!font-semibold">Overview</h6>
                <div>
                  <div className='flex'>
                    <div className='flex-1 p-4 border rounded-tl-lg'>
                      <p className='text-sm font-light'>Principal</p>
                      <p className='text-xl font-semibold mt-1'>{numberWithCommas(getPrincipal())} {symbol}</p>
                    </div>
                    <div className='flex-1 p-4 border border-l-0 rounded-tr-lg'>
                      <p className='text-sm font-light'>Interest</p>
                      <p className='text-xl font-semibold mt-1'>{numberWithCommas(getTargetInterest())} {symbol}</p>
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='flex-1 p-4 border border-t-0 rounded-bl-lg'>
                      <p className='text-sm font-light'>Total</p>
                      <p className='text-xl font-semibold mt-1'>{numberWithCommas(getPrincipal() + getTargetInterest())} {symbol}</p>
                    </div>
                    <div className='flex-1 p-4 border border-t-0 border-l-0 rounded-br-lg'>
                      <p className='text-sm font-light'>Pool status</p>
                      <p className='text-xl font-semibold mt-1'>{translateStatus(getPoolStatus())}</p>
                    </div>
                  </div>
                </div>
            </div>
        }
    </>
  );
};