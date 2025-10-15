import { HiEye, HiDocumentText, HiShieldCheck } from "react-icons/hi2";
import { TbArrowDownFromArc, TbArrowDownToArc } from "react-icons/tb";
import { FaTruck } from "react-icons/fa";
import { useRouter } from "next/router";

export default function TokenizationComponent() {
    const router = useRouter();

    const handleDepositClick = () => {
        router.push('/account/profile?tab=onramp');
    };

    const handleWithdrawClick = () => {
        router.push('/account/profile?tab=offramp');
    };

    const handleViewWGNXClick = () => {
        router.push('/tokenization/WGNX');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">

                {/* Header Section */}
                <div className="flex-1 mb-3 sm:mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="bg-white/10 p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm flex-shrink-0">
                                    <HiShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">Access Tokenized Assets on Wagon Network</h2>
                                    <p className="text-blue-100 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                                    Invest in tokenized real-world assets with institutional-grade security and transparency
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Balance & Portfolio Section */}
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Portfolio Overview</h3>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <HiEye className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="col-span-2 md:col-span-1 text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm sm:text-xl font-bold text-gray-900 mb-1">IDR 0</p>
                            <p className="text-xs text-gray-500">Balance</p>
                        </div>
                        <div className="col-span-2 md:col-span-1 text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm sm:text-xl font-bold text-blue-600 mb-1">IDR 0</p>
                            <p className="text-xs text-gray-500">Investment</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm sm:text-xl font-bold text-gray-900 mb-1">IDR 0</p>
                            <p className="text-xs text-gray-500">Earnings</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm sm:text-xl font-bold text-green-600 mb-1">+0%</p>
                            <p className="text-xs text-gray-500">Returns</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button 
                            onClick={handleDepositClick}
                            className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer active:scale-95"
                        >
                            <div className="text-center">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                                    <TbArrowDownToArc className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                </div>
                                <h4 className="text-xs font-medium text-gray-900 leading-tight">Deposit Balance</h4>
                            </div>
                        </button>

                        <button 
                            onClick={handleWithdrawClick}
                            className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer active:scale-95"
                        >
                            <div className="text-center">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                                    <TbArrowDownFromArc className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <h4 className="text-xs font-medium text-gray-900 leading-tight">Withdraw Balance</h4>
                            </div>
                        </button>

                        <button className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer active:scale-95">
                            <div className="text-center">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                                    <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                                </div>
                                <h4 className="text-xs font-medium text-gray-900 leading-tight">Assets Management</h4>
                            </div>
                        </button>

                        <button className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 cursor-pointer active:scale-95">
                            <div className="text-center">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                                    <HiDocumentText className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                                </div>
                                <h4 className="text-xs font-medium text-gray-900 leading-tight">Rental Reports</h4>
                            </div>
                        </button>
                    </div>
                </div>

                {/* WGNX Investment Card */}
                <div className="mb-4 sm:mb-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 leading-tight">WGNX – Wagon Asset Token</h3>
                                <p className="text-sm sm:text-base text-gray-600">Asset-backed portfolio token with monthly rental distributions.</p>
                            </div>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Asset-backed</span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Monthly</span>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">On-chain</span>
                            </div>
                        </div>

                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Assets</p>
                                <p className="text-base sm:text-lg font-bold text-blue-600 mb-1">10 Assets</p>
                                <p className="text-xs text-gray-500">Trucks, heavy equipment, etc.</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-gray-600 mb-1">AUM</p>
                                <p className="text-base sm:text-lg font-bold text-blue-600 mb-1">IDR 2,000,000,000</p>
                                <p className="text-xs text-gray-500">≈ USDC 150k</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Est. Rental Yield</p>
                                <p className="text-base sm:text-lg font-bold text-green-600 mb-1">10% p.a.</p>
                                <p className="text-xs text-gray-500">Net of costs, taxes, and principal reserve</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Next Payout</p>
                                <p className="text-base sm:text-lg font-bold text-gray-900 mb-1">15 Dec 2025</p>
                                <p className="text-xs text-gray-500">Period: 1 Nov–30 Nov</p>
                            </div>
                        </div>

                        {/* Bullets */}
                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 text-sm">Asset-Backed & Insured</p>
                                    <p className="text-gray-600 text-sm">Minted 1:1 to asset acquisition value (1 WGNX ≈ IDR 1 at mint; not a peg) with active insurance on underlying assets.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 text-sm">Monthly Distributions</p>
                                    <p className="text-gray-600 text-sm">Net rental income (after costs, taxes, and principal reserve) is distributed pro-rata to all holders based on snapshot balances for the period.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 text-sm">EOL & Realization</p>
                                    <p className="text-gray-600 text-sm">At asset disposal, only the tokens repurchased in the buyback receive principal and capital gain; repurchased tokens are then burned to align supply.</p>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                            <button 
                                onClick={handleViewWGNXClick}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                            >
                                View WGNX
                            </button>
                            <div className="flex-1 flex gap-2">
                                <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
                                    Buy WGNX
                                </button>
                                <button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
                                    Sell WGNX
                                </button>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-gray-500 italic">
                            WGNX represents beneficial rights to net rental income; not legal ownership. Historical yield is not a guarantee.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}