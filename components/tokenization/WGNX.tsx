import React from "react";
import { HiArrowLeft, HiShieldCheck, HiDocumentText, HiClock, HiCurrencyDollar, HiArrowTopRightOnSquare, HiArrowPathRoundedSquare } from "react-icons/hi2";
import { useRouter } from "next/router";

export default function WGNXPage() {
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    const handleViewAssets = () => {
        router.push('/wgnx/assets');
    };

    const handleViewReporting = () => {
        router.push('/wgnx/reporting');
    };

    const handleViewPolicy = () => {
        router.push('/wgnx/policy');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button 
                        onClick={handleBackClick}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <HiArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">WGNX – Wagon Asset Token</h1>
                        <p className="text-sm text-gray-600">Asset-backed portfolio token with monthly rental distributions</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Column - Info */}
                    <div className="space-y-6">
                        {/* Hero Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <HiShieldCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">WGNX Token</h2>
                                        <p className="text-gray-600">Wagon Asset Token</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Asset-backed</span>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Monthly</span>
                                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">On-chain</span>
                                </div>
                            </div>
                            
                            {/* Micro Disclaimer */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                <p className="text-xs text-yellow-800">
                                    <strong>Disclaimer:</strong> WGNX represents beneficial rights to net rental income; not legal ownership. Historical yield is not a guarantee.
                                </p>
                            </div>
                        </div>

                        {/* Key Metrics Row */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">NAV</p>
                                    <p className="text-lg font-bold text-blue-600 mb-1">IDR 1,950,000,000</p>
                                    <p className="text-xs text-gray-500">Net Asset Value</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">AUM (Gross)</p>
                                    <p className="text-lg font-bold text-blue-600 mb-1">IDR 2,000,000,000</p>
                                    <p className="text-xs text-gray-500">Total Assets</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">Est. Net Yield (TTM)</p>
                                    <p className="text-lg font-bold text-green-600 mb-1">8.5% p.a.</p>
                                    <p className="text-xs text-gray-500">Trailing 12 months</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">Next Payout</p>
                                    <p className="text-lg font-bold text-gray-900 mb-1">15 Dec 2025</p>
                                    <p className="text-xs text-gray-500">Monthly distribution</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">Reserve %</p>
                                    <p className="text-lg font-bold text-orange-600 mb-1">4.2%</p>
                                    <p className="text-xs text-gray-500">Risk buffer</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">Lifetime Distributed</p>
                                    <p className="text-lg font-bold text-green-600 mb-1">IDR 45,000,000</p>
                                    <p className="text-xs text-gray-500">Total payouts</p>
                                </div>
                            </div>
                        </div>

                        {/* About Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">About WGNX</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Asset-Backed & Insured</p>
                                        <p className="text-gray-600 text-sm">Minted 1:1 to acquisition value (1 WGNX ≈ Rp1 at mint; not a peg) with active insurance.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Monthly Distributions</p>
                                        <p className="text-gray-600 text-sm">Net rental income (after costs, taxes, principal provision, reserve) distributed pro-rata based on snapshot balances.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">EOL & Realization</p>
                                        <p className="text-gray-600 text-sm">Only tokens repurchased in buyback receive principal + any capital gain; those tokens are burned.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Distribution Module */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Distribution</h3>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-blue-900">Current Period</span>
                                    <span className="text-xs text-blue-700">1 Nov–30 Nov</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-blue-800">Snapshot Time</span>
                                    <span className="text-sm font-medium text-blue-900">1 Dec 00:00 WIB</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-blue-800">Status</span>
                                    <span className="text-sm font-medium text-green-600">Collecting</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-600">Last Payout (per WGNX)</span>
                                    <span className="text-sm font-medium text-gray-900">IDR 0.15</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600">Transaction Links</span>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                                        View <HiArrowTopRightOnSquare className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <button 
                                    onClick={handleViewAssets}
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-sm font-medium text-gray-900">View Assets</span>
                                    <HiArrowTopRightOnSquare className="w-4 h-4 text-gray-400" />
                                </button>
                                <button 
                                    onClick={handleViewReporting}
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-sm font-medium text-gray-900">Reporting & Payouts</span>
                                    <HiArrowTopRightOnSquare className="w-4 h-4 text-gray-400" />
                                </button>
                                <button 
                                    onClick={handleViewPolicy}
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-sm font-medium text-gray-900">Policy & Terms</span>
                                    <HiArrowTopRightOnSquare className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Swap / Actions */}
                    <div className="space-y-6">
                        {/* Swap Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Swap IDRX ↔ WGNX</h3>
                            
                            {/* From Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                                        <span>IDRX</span>
                                        <HiArrowPathRoundedSquare className="w-4 h-4" />
                                    </button>
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <span className="text-sm text-gray-500">Balance: 0 IDRX</span>
                                </div>
                            </div>

                            {/* To Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium">
                                        <span>WGNX</span>
                                    </button>
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <span className="text-sm text-gray-500">Balance: 0 WGNX</span>
                                </div>
                            </div>

                            {/* Min Received */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Min received (slippage)</span>
                                    <span className="text-sm text-gray-500">0.5%</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <span className="text-sm text-gray-600">≈ 0.00 WGNX</span>
                                </div>
                            </div>

                            {/* Fee Line */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Fee</span>
                                    <span className="text-gray-900">0.1%</span>
                                </div>
                            </div>

                            {/* Rate Note */}
                            <div className="mb-6">
                                <p className="text-xs text-gray-500">
                                    Rate: 1 WGNX ≈ Rp1 at mint (not a peg)
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                                    Connect Wallet
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                                        Buy WGNX
                                    </button>
                                    <button className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                                        Sell WGNX
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Claim IDRX */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim IDRX</h3>
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-green-900">Claimable Amount</span>
                                        <span className="text-lg font-bold text-green-600">IDR 0</span>
                                    </div>
                                    <p className="text-xs text-green-700">Net of costs, taxes, principal provision, reserve</p>
                                </div>
                                <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                                    Claim IDRX
                                </button>
                                <div className="text-center">
                                    <span className="text-xs text-gray-500">Estimated gas: ~0.001 ETH</span>
                                </div>
                            </div>
                        </div>

                        {/* Contract Links */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Addresses</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Token Address</span>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                                        0x...1234 <HiArrowTopRightOnSquare className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Distributor Address</span>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                                        0x...5678 <HiArrowTopRightOnSquare className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="text-center pt-2">
                                    <span className="text-xs text-gray-500">View on Basescan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
