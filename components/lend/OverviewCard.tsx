import React, { useEffect, useState } from "react";
import { numberWithCommas } from "../../util/stringUtility";
import { services } from "../../services/service_lending";
import { getCoinPriceService } from "../../services/service_erc20";

interface OverviewCardProps {
    // Add any props here if needed
}

interface LendingOverview {
    tvl: bigint;
    totalLoanOrigination: bigint;
    currentLoansOutstanding: bigint;
}

interface CoinPriceResponse {
    data: Array<{
        usd_price: number;
    }>;
}

export default function OverviewCard(props: OverviewCardProps) {
    const [totalValueLocked, setTotalValueLocked] = useState<number>(0);
    const [totalLoanOrigination, setTotalLoanOrigination] = useState<number>(0);
    const [currentLoanOutstanding, setCurrentLoanOutstanding] = useState<number>(0);
    async function getLendingOverview() {
        const lendingOverview = await services.getLendingOverview();
        const responsePrice: CoinPriceResponse = await getCoinPriceService("IDRT");
        const idrtPrice = responsePrice.data[0].usd_price;
        
        setTotalValueLocked(Number(lendingOverview.tvl) * idrtPrice / 100);
        setTotalLoanOrigination(Number(lendingOverview.totalLoanOrigination) * idrtPrice / 100);
        setCurrentLoanOutstanding(Number(lendingOverview.currentLoansOutstanding) * idrtPrice / 100);
    }

    useEffect(() => {
        getLendingOverview();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-4 mb-4 rounded-lg bg-blue-50 text-blue-900">
            <div className="text-start w-full">
                <p className="text-sm">Total Value locked</p>
                <p className="text-2xl font-semibold">{numberWithCommas(totalValueLocked, 0)} USD</p>
            </div>

            <div className="text-start w-full">
                <p className="text-sm">Total Loan Originations</p>
                <p className="text-2xl font-semibold">{numberWithCommas(totalLoanOrigination, 0)} USD</p>
            </div>

            <div className="text-start w-full">
                <p className="text-sm">Current Loans Outstanding</p>
                <p className="text-2xl font-semibold">{numberWithCommas(currentLoanOutstanding, 0)} USD</p>
            </div>
        </div>
    );
} 