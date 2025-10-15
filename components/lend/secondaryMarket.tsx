import ButtonConnect from '../general/ButtonConnect';

import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import { Pool, PoolFee } from './types';
import { Button } from 'flowbite-react';
import SellPoolButton from './SellPoolButton';
import LendToPoolButton from './LendToPoolButton';
import LendFiatToPoolButton from './fiat/LendFiatToPoolButton';

interface SecondaryMarketProps {
    pool: Pool | null;
    stableBalance: string | null;
    wagBalance: string | null;
    fees: PoolFee | null;
    poolSupply: string | null;
    poolAvailable: number;
    refresh: () => void;
    poolId: string;
    refreshUser: () => void;
}

export default function SecondaryMarket(props: SecondaryMarketProps) {
    const { pool, stableBalance, fees, poolSupply, poolAvailable, poolId, refreshUser } = props;

    const address = useConnectedAddress();

    function disableBuyButton() {
        if(poolAvailable == 0) return true;
        return false;
    }

    return (
        <>
        {pool?.status == 2 && (
            <div className="space-y-4">
                {!address ? (
                    <ButtonConnect />
                ) : (
                    <>
                        <div className="flex flex-wrap gap-4">
                            <div className='flex-1'>
                                {/* <Button 
                                    color="dark" 
                                    size="sm" 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
                                    // disabled={disableBuyButton()}
                                    onClick={()=>{}}
                                >
                                    Buy on Market
                                </Button> */}
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
                            <div className='flex-1'>
                                <SellPoolButton
                                    pool={pool}
                                    poolSupply={poolSupply || "0"}
                                    refreshUser={refreshUser}
                                    fees={fees}
                                    poolId={poolId}
                                    stableBalance={stableBalance}
                                />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
                                <div className='flex items-center gap-3 mb-3'>
                                    <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className='text-sm font-semibold text-gray-800'>Listed on Market</h3>
                                        <p className='text-xs text-gray-500'>Your tokens are available on the secondary market</p>
                                    </div>
                                </div>
                                
                                <div className='space-y-3'>
                                    <div className='flex items-center justify-between p-3 bg-white rounded-md border border-gray-100'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center'>
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                            </div>
                                            <span className='text-sm font-medium text-gray-700'>Token Amount</span>
                                        </div>
                                        <span className='text-sm font-semibold text-gray-900'>100 Tokens</span>
                                    </div>
                                    
                                    <div className='flex items-center justify-between p-3 bg-white rounded-md border border-gray-100'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center'>
                                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <span className='text-sm font-medium text-gray-700'>Total Value</span>
                                        </div>
                                        <span className='text-sm font-semibold text-gray-900'>100 {pool?.detail.currency}</span>
                                    </div>
                                </div>
                                
                                <div className='mt-3 pt-3 border-t border-gray-200'>
                                    <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>
                                        <span>Status: <span className='text-green-600 font-medium'>Active</span></span>
                                        <span>Listed: <span className='font-medium'>Just now</span></span>
                                    </div>
                                    
                                    <Button 
                                        color="failure" 
                                        size="xs" 
                                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => {
                                            // TODO: Implement cancel listing functionality
                                            console.log('Cancel listing clicked');
                                        }}
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel Listing
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )}
        </>
    );
} 