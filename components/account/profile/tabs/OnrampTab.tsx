import { HiArrowPath, HiExclamationCircle, HiCurrencyDollar, HiInformationCircle, HiClock } from "react-icons/hi2";
import { useState } from "react";
import { numberWithCommas } from "@/util/stringUtility";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import axios from "axios";
import PaymentDialog from "./PaymentDialog";
import { HistoryDialog } from "./HistoryDialog";
import { Button } from "flowbite-react";

interface OnrampTabProps {
    onramp_enabled?: boolean;
}

interface OnrampResponse {
    amount: string;
    id: number;
    merchantCode: string;
    merchantOrderId: string;
    paymentUrl: string;
    reference: string;
    statusCode: string;
    statusMessage: string;
    wallet_address: string;
}

export default function OnrampTab({ onramp_enabled }: OnrampTabProps) {
    const [amount, setAmount] = useState<string>("");
    const [convertedAmount, setConvertedAmount] = useState<string>("");
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
    const [showHistoryDialog, setShowHistoryDialog] = useState<boolean>(false);
    const [paymentDetails, setPaymentDetails] = useState<OnrampResponse | null>(null);
    const { connectedAddress } = useConnectedAddress();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmount(value);
        if (value) {
            setConvertedAmount(numberWithCommas(value, 0));
        } else {
            setConvertedAmount("");
        }
    };

    const handleExchange = async () => {
        if (!amount || !onramp_enabled) return;
        
        setIsConverting(true);
        try {
            const response = await axios.post(`${process.env.RAMP_API_URL}/api/ramp/onramp`, {
                amount: parseInt(amount),
                wallet_address: connectedAddress
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.error) {
                throw response.data.error;
            }

            setPaymentDetails(response.data.data);

            // setPaymentDetails(response);
            setShowPaymentDialog(true);

        } catch (error) {
            console.error("Exchange failed:", error);
        } finally {
            setIsConverting(false);
        }
    };

    const handleShowHistory = async () => {
        setShowHistoryDialog(true);
    };

    return (
        <div className="py-4">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 md:p-8 mb-6 md:mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-white p-2 md:p-3 rounded-xl shadow-sm">
                            <HiCurrencyDollar className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">IDR to IDRX Exchange</h2>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                Convert Indonesian Rupiah to IDRX tokens instantly
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                        <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${
                            onramp_enabled 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {onramp_enabled ? 'Exchange Enabled' : 'Verification Required'}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                            <HiInformationCircle className="w-3 h-3 md:w-4 md:h-4" />
                            <span>1 IDR = 1 IDRX</span>
                        </div>
                    </div>
                </div>
            </div>

            {!onramp_enabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                        <HiExclamationCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                        <p className="text-xs md:text-sm font-medium text-yellow-800">
                            Please complete your verification to enable IDR to IDRX exchange.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-4 md:p-8">
                    <div className="space-y-6 md:space-y-8">
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                                Amount in IDR
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Enter amount"
                                    disabled={!onramp_enabled}
                                    className={`w-full px-3 md:px-4 py-2.5 md:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg ${
                                        !onramp_enabled ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'
                                    }`}
                                />
                                <div className="absolute right-3 md:right-4 top-2.5 md:top-3.5 text-xs md:text-sm text-gray-500 font-medium">
                                    IDR
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Minimum amount at 20.000 IDR
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <div className="bg-gray-100 p-2 md:p-3 rounded-full">
                                <HiArrowPath className="w-5 h-5 md:w-7 md:h-7 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                                You will receive
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={convertedAmount}
                                    readOnly
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-base md:text-lg"
                                />
                                <div className="absolute right-3 md:right-4 top-2.5 md:top-3.5 text-xs md:text-sm text-gray-500 font-medium">
                                    IDRX
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                            <Button
                                color='blue'
                                onClick={handleExchange}
                                disabled={!amount || isConverting || !onramp_enabled}
                                className={`w-full md:flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                            >
                                {isConverting ? 'Processing...' : 'Exchange Now'}
                            </Button>
                            <Button
                                color='gray'
                                onClick={handleShowHistory}
                                className="w-full md:w-auto flex items-center justify-center gap-2"
                            >
                                <HiClock className="w-4 h-4 md:w-5 md:h-5" />
                                History
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                        <h6 className="font-medium text-sm md:text-base text-gray-900 mb-3 md:mb-4">Exchange Details</h6>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-gray-600">Exchange Rate</span>
                                <span className="text-xs md:text-sm font-medium">1 IDR = 1 IDRX</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-gray-600">Processing Time</span>
                                <span className="text-xs md:text-sm font-medium">1-2 Business Days</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-gray-600">Account Status</span>
                                <span className={`text-xs md:text-sm font-medium ${
                                    onramp_enabled ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                    {onramp_enabled ? 'Verified' : 'Pending Verification'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 md:p-6">
                        <h6 className="font-medium text-sm md:text-base text-blue-900 mb-2">Need Help?</h6>
                        <p className="text-xs md:text-sm text-blue-700">
                            If you have any questions about the exchange process, please contact our support team.
                        </p>
                    </div>
                </div>
            </div>

            <PaymentDialog
                isOpen={showPaymentDialog}
                onClose={() => setShowPaymentDialog(false)}
                paymentDetails={paymentDetails}
            />

            <HistoryDialog
                isOpen={showHistoryDialog}
                onClose={() => setShowHistoryDialog(false)}
                txType="MINT"
            />
        </div>
    );
} 