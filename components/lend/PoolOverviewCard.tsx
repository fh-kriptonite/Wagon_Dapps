import { useEffect, useState } from "react";
import { numberWithCommas } from '../../util/stringUtility';
import { calculateApy, formatTime } from '../../util/lendingUtility';
import CountdownTimer from '../../components/general/CountdownTimer';
import { FaChartLine, FaClock, FaMoneyBillWave, FaPercentage } from "react-icons/fa";
import { Pool } from "./types";

interface PoolOverviewCardProps {
    pool: Pool | null;
}

export default function PoolOverviewCard({ 
    pool 
}: PoolOverviewCardProps) {
    const [apy, setApy] = useState(0);

    useEffect(() => {
        if(pool != null) {
            setApy(calculateApy(pool));
        }
    }, [pool])

    return (
        <>
            {
                pool == null
                ? <div className='card space-y-6'>
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
                    {/* Pool Details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaPercentage className="text-blue-600" size={14}/>
                                    <p className="text-xs text-gray-600 font-medium">Expected Yield</p>
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