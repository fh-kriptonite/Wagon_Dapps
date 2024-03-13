import { useEffect, useState } from "react";
import { erc20ABI, useContractReads } from "wagmi";
import { numberWithCommas } from "../../util/stringUtility";
import { getLendingOverviewService } from "../../services/service_lending";
import { getCoinPriceService } from "../../services/service_erc20"

export default function OverviewCard(props) {

    const [totalValueLocked, setTotalValueLocked] = useState(0)
    const [totalLoanOrigination, setTotalLoanOrigination] = useState(0)
    const [currentLoanOutstanding, setCurrentLoanOutstanding] = useState(0)

    async function getLendingOverview() {
        const lendingOverview = await getLendingOverviewService();
        const responsePrice = await getCoinPriceService("IDRT");
        const idrtPrice = responsePrice.data[0].usd_price;
        
        setTotalValueLocked(parseFloat(lendingOverview.tvl) * idrtPrice / 100)
        setTotalLoanOrigination(parseFloat(lendingOverview.totalLoanOrigination) * idrtPrice / 100)
        setCurrentLoanOutstanding(parseFloat(lendingOverview.currentLoansOutstanding) * idrtPrice / 100)
    }

    useEffect(()=>{
        getLendingOverview();
    }, [])

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

            {/* <div className="">
                <p className="text-sm">WAG Price: <span className="font-medium">
                    ~
                </span></p>
                <p className="text-sm">WAG Market Cap: <span className="font-medium">
                    ~
                </span></p>
                <p className="text-sm">Circulating Supply: <span className="font-medium">
                    ~
                </span></p>
            </div> */}
        </div>
    )
  }