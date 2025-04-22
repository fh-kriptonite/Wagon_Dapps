import { useEffect, useState } from "react";
import { numberWithCommas } from '../../util/stringUtility';
import { calculateApy, formatTime } from '../../util/lendingUtility';
import CountdownTimer from '../../components/general/CountdownTimer';
import { Progress } from 'flowbite-react';
import { FaChartLine, FaClock, FaMoneyBillWave, FaPercentage } from "react-icons/fa";

interface PoolJson {
    properties: {
        repayment_structure: string;
        payment_freuency: string;
    };
}

interface Pool {
    status: string;
    stabletoPairRate: string;
    loanTerm: string;
    collectionTermEnd: string;
}

interface ActivePool {
    [0]: string;
}

interface PoolOverviewCardProps {
    poolId: string;
    poolJson: PoolJson | null;
    pool: Pool | null;
    symbol: string;
    decimal: number;
    activePool: ActivePool | null;
    poolMaxSupply: string | null;
    poolSupply: string | null;
}

export default function PoolOverviewCard({ 
    poolId, 
    poolJson, 
    pool, 
    symbol, 
    decimal, 
    activePool, 
    poolMaxSupply, 
    poolSupply 
}: PoolOverviewCardProps) {
    const [apy, setApy] = useState(0);

    useEffect(() => {
        if(pool != null) {
            setApy(calculateApy(pool));
        }
    }, [pool])

    function getCollectedPrincipalDecimal(): number {
        if(activePool == null) return 0;
        return parseFloat(activePool[0]) / Math.pow(10, decimal);
    }

    function getPoolMaxSupplyDecimal(): number {
        if(poolMaxSupply == null) return 0;
        return parseFloat(poolMaxSupply) / Math.pow(10, decimal);
    }

    function getPoolSupplyDecimal(): number {
        if(poolSupply == null) return 0;
        return parseFloat(poolSupply) / Math.pow(10, decimal);
    }

    function getPoolProgress(): number {
        if(pool == null) return 0;
        if(getPoolMaxSupplyDecimal() == 0) return 0;

        if(parseFloat(pool.status) >= 2) {
            return getCollectedPrincipalDecimal() / getPoolMaxSupplyDecimal() * 100
        } else {
            return getPoolSupplyDecimal() / getPoolMaxSupplyDecimal() * 100
        }
    }

    function getPoolProgressSupply(): string {
        if(pool == null) return "0";
        if(parseFloat(pool.status) >= 2) {
            return numberWithCommas(getCollectedPrincipalDecimal())
        } else {
            if(poolSupply == null) return "0";
            return numberWithCommas(getPoolSupplyDecimal())
        }
    }

    function getCollectedWag(): string {
        if(pool == null) return "0";
        if(parseFloat(pool.status) >= 2) {
            return numberWithCommas(getCollectedPrincipalDecimal() * parseFloat(pool.stabletoPairRate) / Math.pow(10,18))
        } else {
            if(poolSupply == null) return "0";
            return numberWithCommas(getPoolSupplyDecimal() * parseFloat(pool.stabletoPairRate) / Math.pow(10,18))
        }
    }

    function getPoolMaxWag(): number {
        if(poolMaxSupply == null || pool == null) return 0;
        return parseFloat(poolMaxSupply) * parseFloat(pool.stabletoPairRate) / Math.pow(10,18) / Math.pow(10,decimal);
    }

    function showWagPair(): boolean {
        if(!pool) return false;
        if(pool.stabletoPairRate == "0") return false;
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
                                {getPoolProgressSupply()} {symbol}
                            </span>
                            <span className="truncate">
                                {numberWithCommas(getPoolMaxSupplyDecimal())} {symbol}
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
                                    {formatTime(parseFloat(pool?.loanTerm))}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaChartLine className="text-blue-600" size={14}/>
                                    <p className="text-xs text-gray-600 font-medium">Repayment Structure</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {poolJson?.properties.repayment_structure}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaMoneyBillWave className="text-blue-600" size={14}/>
                                    <p className="text-xs text-gray-600 font-medium">Payment Frequency</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {poolJson?.properties.payment_freuency}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    {pool?.status == "1" && (
                        <>
                            <div className="border-t border-gray-200"/>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <CountdownTimer targetEpoch={parseInt(pool?.collectionTermEnd)}/>
                            </div>
                        </>
                    )}
                </div>
            }
        </>
    );
} 