import { useRouter } from 'next/router';
import ButtonConnect from '../../components/general/ButtonConnect';
import { useState } from "react";
import { FaWallet } from "react-icons/fa";

import { numberWithCommas } from '../../util/stringUtility';
import LoadingUserLendingStatistic from './LoadingUserLendingStatistic';
import LendToPoolButton from './LendToPoolButton';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import LendFiatToPoolButton from './fiat/LendFiatToPoolButton';
import { Pool, PoolFee } from './types';

interface UserLendingStatisticProps {
    pool: Pool | null;
    stableBalance: string | null;
    wagBalance: string | null;
    fees: PoolFee | null;
    poolSupply: string | null;
    refresh: () => void;
}

export default function UserLendingStatistic(props: UserLendingStatisticProps) {
    const { connectedAddress: address } = useConnectedAddress();
    const router = useRouter();
    const { poolId } = router.query;

    const pool = props.pool;
    
    const stableBalance = props.stableBalance;
    const wagBalance = props.wagBalance;
    const fees = props.fees;
    
    function getStableString() {
        if(stableBalance == null) return 0;
        if(pool == null) return 0;
        return numberWithCommas(parseFloat(stableBalance) / Math.pow(10, pool.lending_contract.decimals))
    }

    function getWagString() {
        if(wagBalance == null) return 0;
        return numberWithCommas(parseFloat(wagBalance) / 1e18)
    }

    function getPoolStatus() {
        if(pool == null) return 0;
        return pool.status;
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
        if(pool.stable_to_pair_rate == 0) return false;
        return true;
    }

    function showLendFiatToPoolButton() {
        if(!pool) return false;
        if(pool.lending_contract.address == process.env.IDRX_ADDRESS_BSC) return true;
        if(pool.lending_contract.address == process.env.IDRX_ADDRESS_BASE) return true;
        return false;
    }

    return (
        <>
            {
                pool == null
                ? <LoadingUserLendingStatistic/>
                : <div className='card space-y-4 flex-1'>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h6 className="text-lg font-semibold text-gray-900">Your Lending Statistics</h6>
                    </div>
                    
                    {/* Balance Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {/* Stable Coin Balance */}
                        <div className='flex items-center gap-3'>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <img 
                                    src={pool.detail.currency_logo} 
                                    onLoad={handleImageLoaded}
                                    onError={handleImageError} 
                                    className="h-8 w-8 object-contain" 
                                    alt="Stable coin Logo"
                                    style={{ display: loadingImage || errorImage ? 'none' : 'block' }}
                                />
                                {loadingImage && <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />}
                                {errorImage && <FaWallet className="h-8 w-8 text-gray-400" />}
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-600'>Your Lending Balance</p>
                                <p className='text-xl font-bold text-gray-900'>
                                    {getStableString()} {pool.detail.currency}
                                </p>
                            </div>
                        </div>
                        
                        {/* WAG Balance */}
                        {showWagPair() && (
                            <div className='flex items-center gap-3'>
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <img 
                                        src="/logo.png" 
                                        className="h-8 w-8 object-contain" 
                                        alt="WAG Logo" 
                                    />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>Your Wagon Balance</p>
                                    <p className='text-xl font-bold text-gray-900'>
                                        {getWagString()} WAG
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {getPoolStatus() == 1 && (
                        <div className="space-y-4">
                            {!address ? (
                                <ButtonConnect />
                            ) : (
                                <div className="flex flex-wrap gap-4">
                                    <div className='flex-1'>
                                        <LendToPoolButton 
                                            {...props}
                                            pool={pool!}
                                            poolSupply={props.poolSupply!}
                                            fees={fees}
                                            poolId={poolId as string}
                                            refreshUser={()=>{
                                                props.refresh();
                                            }}
                                        />
                                    </div>
                                    { showLendFiatToPoolButton() && (
                                        <div className='flex-1'>
                                            <LendFiatToPoolButton 
                                                {...props}
                                                pool={pool!}
                                                poolSupply={BigInt(props.poolSupply || "0")}
                                                fees={fees}
                                                poolId={poolId as string}
                                                refreshUser={()=>{
                                                    props.refresh();
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            }
        </>
    );
} 