import { useEffect, useState } from "react";
import { numberWithCommas } from '../../util/stringUtility';
import { calculateApy, formatTime } from '../../util/lendingUtility';
import CountdownTimer from '../../components/general/CountdownTimer';
import { Progress } from 'flowbite-react';
import { FaChartLine, FaClock, FaMoneyBillWave, FaPercentage } from "react-icons/fa";
import { Pool } from "./types";

interface ActivePool {
    [0]: string;
}

interface PoolOverviewCardProps {
    pool: Pool | null;
    activePool: ActivePool | null;
    poolSupply: string | null;
}

export default function PoolOverviewCard({ 
    pool, 
    activePool, 
    poolSupply 
}: PoolOverviewCardProps) {
    const [apy, setApy] = useState(0);

    useEffect(() => {
        if(pool != null) {
            setApy(calculateApy(pool));
        }
    }, [pool])

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

    function getPoolProgressSupply(): string {
        if(pool == null) return "0";

        if(pool?.contract.network_id == 0) {return numberWithCommas(pool.target_loan)}

        if(pool.status >= 2) {
            return numberWithCommas(getCollectedPrincipalDecimal())
        } else {
            if(poolSupply == null) return "0";
            return numberWithCommas(getPoolSupplyDecimal())
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

    function showWagPair(): boolean {
        if(!pool) return false;
        if(pool.stable_to_pair_rate == 0) return false;
        return true;
    }

    return (
        <>
            {
                pool == null
                ? <div className='card space-y-6'>
                    <h6 className="text-lg font-semibold text-gray-900">Overview</h6>
                    <div className="grid grid-cols-2 gap-4">
                        <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                            <div className="h-4 w-20 bg-gray-200 rounded-full mb-2"/>
                            <div className="h-6 w-full bg-gray-200 rounded-full"/>
                        </div>
                        <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                            <div className="h-4 w-20 bg-gray-200 rounded-full mb-2"/>
                            <div className="h-6 w-full bg-gray-200 rounded-full"/>
                        </div>
                        <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                            <div className="h-4 w-20 bg-gray-200 rounded-full mb-2"/>
                            <div className="h-6 w-full bg-gray-200 rounded-full"/>
                        </div>
                        <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                            <div className="h-4 w-20 bg-gray-200 rounded-full mb-2"/>
                            <div className="h-6 w-full bg-gray-200 rounded-full"/>
                        </div>
                    </div>
                </div>
                : <div className='card space-y-4'>
                    <h6 className="text-lg font-semibold text-gray-900">Overview</h6>

                    {/* Progress Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-600">Pool Progress</p>
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
                                {getPoolProgressSupply()} {pool?.detail.currency}
                            </span>
                            <span className="truncate">
                                {numberWithCommas(getPoolMaxSupplyDecimal())} {pool?.detail.currency}
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

                    <div className="border-t border-gray-200"/>

                    {/* Pool Details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaPercentage className="text-blue-600" size={14}/>
                                    <p className="text-xs text-gray-600 font-medium">Fixed APY</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {numberWithCommas(apy, 2)}%
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaClock className="text-blue-600" size={14}/>
                                    <p className="text-xs text-gray-600 font-medium">Loan Term</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatTime(pool?.loan_term)}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaChartLine className="text-blue-600" size={14}/>
                                    <p className="text-xs text-gray-600 font-medium">Repayment Structure</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {pool?.detail.repayment_structure}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaMoneyBillWave className="text-blue-600" size={14}/>
                                    <p className="text-xs text-gray-600 font-medium">Payment Frequency</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {pool?.detail.payment_frequency}
                                </p>
                            </div>
                        </div>  
                    </div>

                    {/* Countdown Timer */}
                    {pool?.status == 1 && (
                        <>
                            <div className="border-t border-gray-200"/>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <CountdownTimer targetEpoch={pool?.collection_term_end}/>
                            </div>
                        </>
                    )}
                </div>
            }
        </>
    );
} 