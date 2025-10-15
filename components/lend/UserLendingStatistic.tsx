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
import SecondaryMarket from './secondaryMarket';
import { Progress } from 'flowbite-react';

interface ActivePool {
    [0]: string;
}

interface UserLendingStatisticProps {
    pool: Pool | null;
    stableBalance: string | null;
    wagBalance: string | null;
    fees: PoolFee | null;
    activePool: ActivePool | null;
    poolSupply: string | null;
    refresh: () => void;
}

export default function UserLendingStatistic(props: UserLendingStatisticProps) {
    const { connectedAddress: address } = useConnectedAddress();
    const router = useRouter();
    const { poolId } = router.query;

    const pool = props.pool;
    const activePool = props.activePool;
    const poolSupply = props.poolSupply;
    
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


    function getDecimal(): number {
        if(pool == null) return 0;
        return pool.lending_contract.decimals;
    }

    function getCollectedPrincipalDecimal(): number {
        if(activePool == null) return 0;
        return parseFloat(activePool[0]) / Math.pow(10, getDecimal());
    }

    function getPoolMaxSupplyDecimal(): number {
        if(pool == null) return 0;
        return parseFloat(pool.target_loan) / Math.pow(10, getDecimal());
    }

    function getPoolSupplyDecimal(): number {
        if(poolSupply == null) return 0;
        return parseFloat(poolSupply) / Math.pow(10, getDecimal());
    }

    function getPoolProgress(): number {
        if(pool == null) return 0;

        if(pool?.contract.network_id == 0) {return 100}

        if(getPoolMaxSupplyDecimal() == 0) return 0;

        if(pool.status >= 2) {
            return getCollectedPrincipalDecimal() / getPoolMaxSupplyDecimal() * 100
        } else {
            return getPoolSupplyDecimal() / getPoolMaxSupplyDecimal() * 100
        }
    }

    function getPoolAvailable(): number {
        if(pool == null) return 0;

        if(pool?.contract.network_id == 0) {return parseFloat(pool.target_loan)}

        if(pool.status >= 2) {
            return getPoolMaxSupplyDecimal() - getCollectedPrincipalDecimal()
        } else {
            if(poolSupply == null) return 0;
            return getPoolSupplyDecimal()
        }
    }

    function getCollectedWag(): string {
        if(pool == null) return "0";
        if(pool.status >= 2) {
            return numberWithCommas(getCollectedPrincipalDecimal() * pool.stable_to_pair_rate / Math.pow(10,18))
        } else {
            if(poolSupply == null) return "0";
            return numberWithCommas(getPoolSupplyDecimal() * pool.stable_to_pair_rate / Math.pow(10,18))
        }
    }

    function getPoolMaxWag(): number {
        if(pool == null) return 0;
        return parseFloat(pool.target_loan) * pool.stable_to_pair_rate / Math.pow(10,18) / Math.pow(10,getDecimal());
    }

    return (
        <>
            {
                pool == null
                ? <LoadingUserLendingStatistic/>
                : <div className='card space-y-4 flex-1'>
                    {/* Progress Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-600">Pool Filled</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {numberWithCommas(getPoolProgress(), 2)}%
                            </p>
                        </div>
                        
                        <Progress 
                            progress={getPoolProgress()} 
                            color="blue"
                            size="lg"
                        />

                        <div className="flex justify-between text-xs md:text-sm text-gray-500">
                            <span className="truncate">
                                Available on market:
                            </span>
                            <span className="truncate">
                                {numberWithCommas(getPoolAvailable())} tokens left
                            </span>
                        </div>
                        
                        {showWagPair() && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                    <p className="text-xs text-gray-600">Current WAG</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {getCollectedWag()} WAG
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                    <p className="text-xs text-gray-600">Target WAG</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {numberWithCommas(getPoolMaxWag())} WAG
                                    </p>
                                </div>
                            </div>
                        )}
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
                                <p className='text-sm font-medium text-gray-600'>Your Balance</p>
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
                    
                    {/* <SecondaryMarket
                        pool={pool}
                        stableBalance={stableBalance}
                        wagBalance={wagBalance}
                        fees={fees}
                        poolSupply={props.poolSupply}
                        poolAvailable={getPoolAvailable()}
                        refresh={props.refresh}
                        poolId={poolId as string}
                        refreshUser={()=>{
                            props.refresh();
                        }}
                    /> */}
                </div>
            }
        </>
    );
} 