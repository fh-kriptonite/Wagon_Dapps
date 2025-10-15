import React, { useEffect, useState } from "react";
import { numberWithCommas } from "../../util/stringUtility";
import { services } from "../../services/service_lending";
import { getCoinPriceService } from "../../services/service_erc20";
import { HiLockClosed, HiCurrencyDollar, HiDocumentText } from "react-icons/hi2";

interface OverviewCardProps {
    // Add any props here if needed
}

interface CoinPriceResponse {
    data: {
        usd_price: number;
    };
}

export default function OverviewCard(props: OverviewCardProps) {
    const [totalValueLocked, setTotalValueLocked] = useState<number>(0);
    const [totalLoanOrigination, setTotalLoanOrigination] = useState<number>(0);
    const [currentLoanOutstanding, setCurrentLoanOutstanding] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function getLendingOverview() {
        setIsLoading(true);

        try {
            if (!process.env.WAGON_API_URL) {
                console.warn('WAGON_API_URL environment variable is not configured, using default values for lending overview');
                setTotalValueLocked(0);
                setTotalLoanOrigination(0);
                setCurrentLoanOutstanding(0);
                return;
            }

            const url = `${process.env.WAGON_API_URL}/api/pools/overview`;
            console.log('Fetching lending overview from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error('Failed to fetch lending overview:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: url
                });
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const responseJson = await response.json();
            console.log('Lending overview data:', responseJson);
            
            const data = responseJson.data;
            
            if (data) {
                setTotalValueLocked(Number(data.lending_tvl) || 0);
                setTotalLoanOrigination(Number(data.total_loans_originated) || 0);
                setCurrentLoanOutstanding(Number(data.current_loans_outstanding) || 0);
            } else {
                console.warn('Invalid lending overview data structure, using default values');
                setTotalValueLocked(0);
                setTotalLoanOrigination(0);
                setCurrentLoanOutstanding(0);
            }
        } catch (error) {
            console.error('Error getting lending overview:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            
            // Set default values on error to prevent UI issues
            console.warn('Using default values for lending overview due to API error');
            setTotalValueLocked(0);
            setTotalLoanOrigination(0);
            setCurrentLoanOutstanding(0);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getLendingOverview();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Value Locked Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <HiLockClosed className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Total Value Locked</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                    IDR {numberWithCommas(totalValueLocked, 0)}
                </p>
            </div>

            {/* Total Loan Originations Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-50 p-2 rounded-lg">
                        <HiCurrencyDollar className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Total Loan Originations</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                    IDR {numberWithCommas(totalLoanOrigination, 0)}
                </p>
            </div>

            {/* Current Loans Outstanding Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-50 p-2 rounded-lg">
                        <HiDocumentText className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">Current Loans Outstanding</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                    IDR {numberWithCommas(currentLoanOutstanding, 0)}
                </p>
            </div>
        </div>
    );
} 