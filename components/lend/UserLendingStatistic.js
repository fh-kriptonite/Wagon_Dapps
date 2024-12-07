import { useRouter } from 'next/router';
import ButtonConnect from '../../components/general/ButtonConnect';
import { useState } from "react";

import { numberWithCommas } from '../../util/stringUtility';
import LoadingUserLendingStatistic from './LoadingUserLendingStatistic';
import LendToPoolButton from './LendToPoolButton';
import { useAccount } from '@particle-network/connectkit';
import LendFiatToPoolButton from './fiat/LendFiatToPoolButton';

export default function UserLendingStatistic(props) {
    const address = useAccount();
    const router = useRouter();
    const { poolId } = router.query;

    const pool = props.pool;
    const poolJson = props.poolJson;
    const symbol = props.symbol;
    const decimal = props.decimal;

    const stableBalance = props.stableBalance;
    const wagBalance = props.wagBalance;
    const fees = props.fees;
    
    function getStableString() {
        if(stableBalance == null) return 0;
        if(decimal == null) return 0;
        return numberWithCommas(parseFloat(stableBalance) / Math.pow(10, decimal))
    }

    function getWagString() {
        if(wagBalance == null) return 0;
        return numberWithCommas(parseFloat(wagBalance) / 1e18)
    }

    function getPoolStatus() {
        if(pool == null) return 0;
        return parseFloat(pool.status);
    }

    const [loadingImage, setLoadingImage] = useState(true);
    const [errorImage, setErrorImage] = useState(false);

    const handleImageLoaded = () => {
        setLoadingImage(false);
    };

    const handleImageError = () => {
        setLoadingImage(false);
        setErrorImage(true);
    };

    function showWagPair() {
        if(!pool) return false;
        if(pool.stabletoPairRate == 0) return false

        return true;
    }

  return (
    <>
        {
            pool == null
            ? <LoadingUserLendingStatistic/>
            : <div className='card space-y-4 flex-1'>
                <div className="flex justify-between">
                    <h6 className="!font-semibold">Your Lending Statistics</h6>
                </div>
                
                <div className='flex gap-4 flex-col sm:flex-row'>
                    <div className='flex-1 flex items-center gap-2'>
                    <img 
                        src={poolJson?.properties.currency_logo} 
                        onLoad={handleImageLoaded}
                        onError={handleImageError} 
                        className="h-8" 
                        alt="Stable coin Logo"
                        style={{ display: loadingImage || errorImage ? 'none' : 'block' }}
                        />
                    <div>
                        <p className='text-sm font-light'>Your Lending Balance</p>
                        <p className='text-base font-semibold'>
                            { getStableString() } {symbol}
                        </p>
                    </div>
                    </div>
                    
                    {
                        showWagPair() &&
                        <div className='flex-1 flex items-center gap-2'>
                            <img src="/logo.png" className="h-8" alt="WAG Logo" />
                            <div>
                                <p className='text-sm font-light'>Your Wagon Balance</p>
                                <p className='text-base font-semibold'>
                                    { getWagString() } WAG
                                </p>
                            </div>
                        </div>
                    }
                </div>

                {
                    getPoolStatus() == 1 &&
                    <>
                        {
                        !address
                            ? <ButtonConnect/>
                            : 
                            <div className="flex gap-2 flex-col md:flex-row">
                                <div className="flex-1">
                                    <LendToPoolButton 
                                        {...props}
                                        fees={fees}
                                        poolId={poolId}
                                        refreshUser={()=>{
                                            props.refresh();
                                        }}
                                    />
                                </div>
                                {
                                    pool?.lendingCurrency == process.env.IDRX_ADDRESS &&
                                    <div className="flex-1">
                                        <LendFiatToPoolButton 
                                            {...props}
                                            fees={fees}
                                            poolId={poolId}
                                            refreshUser={()=>{
                                                props.refresh();
                                            }}
                                        />
                                    </div>
                                }
                            </div>
                        }
                    </>
                }
            </div>
        }
    </>
  );
};