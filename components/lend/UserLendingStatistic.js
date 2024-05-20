import { useRouter } from 'next/router';
import ButtonConnect from '../../components/general/ButtonConnect';
import { useEffect, useState } from "react";

import { numberWithCommas } from '../../util/stringUtility';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import LoadingUserLendingStatistic from './LoadingUserLendingStatistic';
import useGetLendStableBalanceHook from './utils/useGetLendStableBalanceHook';
import useGetLendWagBalanceHook from './utils/useGetLendWagBalanceHook';
import useGetPoolFeeHook from './utils/useGetPoolFeeHook';
import LendToPoolButton from './LendToPoolButton';
import TimelinePool from './TimelinePool';

export default function UserLendingStatistic(props) {
    const { isConnected, address } = useWeb3ModalAccount();
    const router = useRouter();
    const { poolId } = router.query;

    const pool = props.pool;
    const poolJson = props.poolJson;
    const symbol = props.symbol;
    const decimal = props.decimal;

    const {data: stableBalance, fetchData: getStableBalance} = useGetLendStableBalanceHook();
    const {data: wagBalance, fetchData: getWagBalance} = useGetLendWagBalanceHook();
    const {data: fees, fetchData: getFees} = useGetPoolFeeHook();
    
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

    useEffect(()=>{
        if(pool != null) {
            getStableBalance(address, poolId);
            getWagBalance(address, poolId)
            getFees(poolId);
        }
    }, [pool])
    
    useEffect(()=>{
        if(pool != null) {
            getStableBalance(address, poolId);
            getWagBalance(address, poolId)
        }
    }, [address])

  return (
    <>
        {
            pool == null
            ? <LoadingUserLendingStatistic/>
            : <div className='card space-y-4 flex-1'>
                <h6 className="!font-semibold">Your Lending Statistics</h6>
                
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
                    <div className='flex-1 flex items-center gap-2'>
                    <img src="/logo.png" className="h-8" alt="IDRT Logo" />
                    <div>
                        <p className='text-sm font-light'>Your Wagon Balance</p>
                        <p className='text-base font-semibold'>
                            { getWagString() } WAG
                        </p>
                    </div>
                    </div>
                </div>

                {
                    getPoolStatus() == 1 &&
                    <>
                        {
                        !isConnected
                            ? <ButtonConnect/>
                            : <LendToPoolButton 
                                {...props}
                                fees={fees}
                                refreshUser={()=>{
                                    getStableBalance(address, poolId);
                                    getWagBalance(address, poolId)
                                }}
                            />
                        }
                    </>
                }

                {
                    pool?.status > 1 &&
                    <TimelinePool {...props} stableBalance={stableBalance} fees={fees} wagBalance={wagBalance}/>
                }
            </div>
        }
    </>
  );
};