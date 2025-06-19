import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import { numberWithCommas } from "@/util/stringUtility";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { HiBanknotes, HiArrowRight, HiClock, HiExclamationCircle, HiInformationCircle, HiArrowPath } from "react-icons/hi2";
import BankAccountSection from "./BankAccountSection";
import useGetStableBalanceHook from "@/components/lend/utils/useGetStableBalanceHook";
import { Button, Alert } from "flowbite-react";
import { HistoryDialog } from "./HistoryDialog";
import ExchangeDialog from "./ExchangeDialog";
import useRedeemIDRX from "@/components/account/utils/useRedeemIDRX";
import { base } from "@particle-network/connectkit/chains";
import { bsc } from "@particle-network/connectkit/chains";

interface BankAccount {
    bankCode: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    deleted: boolean;
}

interface OfframpTabProps {
    offramp_enabled?: boolean;
}

export default function OfframpTab({ offramp_enabled }: OfframpTabProps) {
    const [amount, setAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'success' | 'failure' }>({
        show: false,
        message: '',
        type: 'success'
    });
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [showExchange, setShowExchange] = useState<boolean>(false);
    const [chainId, setChainId] = useState<number>(Number(process.env.BNB_CHAIN_ID));
    const { connectedAddress } = useConnectedAddress();
    const { data: stableBalance, fetchData: getStableBalance } = useGetStableBalanceHook();
    const { isLoading: isBurning, isWaitingApproval: isWaitingApprovalBurn, fetchData: burnIdrx } = useRedeemIDRX();

    // Memoize the getBalance function
    const getBalance = useCallback(() => {
        if (connectedAddress) {
            getStableBalance(
                Number(chainId), 
                connectedAddress, 
                getIDRXAddress()
            );
        }
    }, [connectedAddress, chainId]);

    // Memoize the getBankAccount function
    const getBankAccount = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.WAGON_API_URL}/api/ramp/get_bank`, {
                params: {
                    wallet_address: connectedAddress,
                }
            });

            if (response.data.status === 'success') {
                setBankAccounts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
        }
    }, [connectedAddress]);

    // Initial data fetch
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            if (connectedAddress && mounted) {
                await getBankAccount();
                getBalance();
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [connectedAddress]);

    // Chain ID change effect
    useEffect(() => {
        let mounted = true;

        if (mounted) {
            getBalance();
        }

        return () => {
            mounted = false;
        };
    }, [connectedAddress, chainId]);

    // Alert cleanup
    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => {
                setAlert(prev => ({ ...prev, show: false }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert.show]);

    const [exchangeDetails, setExchangeDetails] = useState<any>(null);

    function getIDRXAddress() {
        if(chainId === bsc.id) {
            return process.env.ONRAMP_IDRX_ADDRESS_BSC || "";
        } else if(chainId === base.id) {
            return process.env.ONRAMP_IDRX_ADDRESS_BASE || "";
        }
        return "";
    }

    const handleExchange = async () => {
        if (!amount || !selectedBankAccount) return;
        
        setIsLoading(true);
        try {
            // burn IDRX
            const { data: burnData, error: burnError } = await burnIdrx(
                amount, 
                selectedBankAccount.bankName,
                selectedBankAccount.bankAccountNumber,
                chainId
            );

            if(burnError) {
                console.error(burnError);
                setAlert({
                    show: true,
                    message: 'Failed to burn IDRX. Please try again.',
                    type: 'failure'
                });
                setIsLoading(false);
                return;
            }

            const response = await axios.post(`${process.env.WAGON_API_URL}/api/ramp/offramp`, {
                amount: parseInt(amount),
                txHash: burnData?.hash,
                networkChainId: chainId,
                bankAccount: selectedBankAccount.bankAccountNumber,
                bankCode: selectedBankAccount.bankCode,
                bankName: selectedBankAccount.bankName,
                bankAccountName: selectedBankAccount.bankAccountName,
                wallet_address: connectedAddress,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

            if (response.data.status === 'success') {
                setExchangeDetails(response.data.data);
                setShowExchange(true);
                setAlert({
                    show: true,
                    message: 'Exchange request submitted successfully!',
                    type: 'success'
                });
            } else {
                setAlert({
                    show: true,
                    message: 'Failed to submit exchange request. Please request help from support.',
                    type: 'failure'
                });
            }
        } catch (error) {
            console.error(error);
            setAlert({
                show: true,
                message: 'An error occurred. Please try again.',
                type: 'failure'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowHistory = async () => {
        setShowHistory(true);
    };

    return (
        <div className="py-4">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 md:p-8 mb-6 md:mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-white p-2 md:p-3 rounded-xl shadow-sm">
                            <HiBanknotes className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">IDRX to IDR Exchange</h2>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                Convert your IDRX tokens to Indonesian Rupiah
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                        <div className={`w-fit px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${
                            offramp_enabled 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {offramp_enabled ? 'Exchange Enabled' : 'Verification Required'}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                            <HiInformationCircle className="w-3 h-3 md:w-4 md:h-4" />
                            <span>1 IDRX = 1 IDR</span>
                        </div>
                    </div>
                </div>
            </div>

            {!offramp_enabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                        <HiExclamationCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                        <p className="text-xs md:text-sm font-medium text-yellow-800">
                            Please complete your verification to enable IDRX to IDR exchange.
                        </p>
                    </div>
                </div>
            )}

            {/* Alert Notification */}
            {alert.show && (
                <div className="mb-4">
                    <Alert
                        color={alert.type === 'success' ? 'success' : 'failure'}
                        onDismiss={() => setAlert(prev => ({ ...prev, show: false }))}
                    >
                        <span className="font-medium">{alert.message}</span>
                    </Alert>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-4 md:p-8">
                    <div className="space-y-6 md:space-y-8">
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                                Select Network
                            </label>
                            <div className="relative">
                                <select className="w-full px-3 md:px-4 py-2.5 md:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg"
                                    onChange={(e) => setChainId(parseInt(e.target.value))}
                                >
                                    <option value={bsc.id}>Binance Smart Chain</option>
                                    <option value={base.id}>Base Network</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                                Amount in IDRX
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    disabled={!offramp_enabled}
                                    className={`w-full px-3 md:px-4 py-2.5 md:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg ${
                                        !offramp_enabled ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'
                                    }`}
                                />
                                <div className="absolute right-3 md:right-4 top-2.5 md:top-3.5 text-xs md:text-sm text-gray-500 font-medium">
                                    IDRX
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Button
                                    size="xs"
                                    color="light"
                                    onClick={() => getBalance()}
                                >
                                    <HiArrowPath className="w-3 h-3 md:w-4 md:h-4" />
                                </Button>
                                <p className="text-xs text-gray-500">
                                    Available: {isLoading ? "~" : numberWithCommas(Number(stableBalance))} IDRX
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="bg-gray-100 p-2 md:p-3 rounded-full">
                                <HiArrowRight className="w-5 h-5 md:w-7 md:h-7 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <BankAccountSection 
                                bankAccounts={bankAccounts}
                                selectedBankAccount={selectedBankAccount}
                                setSelectedBankAccount={setSelectedBankAccount}
                            />
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                                You will receive
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={numberWithCommas(Number(amount))}
                                    readOnly
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-base md:text-lg"
                                />
                                <div className="absolute right-3 md:right-4 top-2.5 md:top-3.5 text-xs md:text-sm text-gray-500 font-medium">
                                    IDR
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                            <Button
                                color='blue'
                                onClick={handleExchange}
                                disabled={!amount || isLoading || !offramp_enabled || !selectedBankAccount}
                                className={`w-full md:flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                            >
                                {isLoading ? 'Processing...' : 'Exchange Now'}
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
                                <span className="text-xs md:text-sm font-medium">1 IDRX = 1 IDR</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-gray-600">Processing Time</span>
                                <span className="text-xs md:text-sm font-medium">1-2 Business Days</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-gray-600">Account Status</span>
                                <span className={`text-xs md:text-sm font-medium ${
                                    offramp_enabled ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                    {offramp_enabled ? 'Verified' : 'Pending Verification'}
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

            {/* Exchange Dialog */}
            <ExchangeDialog
                isOpen={showExchange}
                onClose={() => setShowExchange(false)}
                exchangeDetails={exchangeDetails}
                selectedBankAccount={selectedBankAccount}
            />

            <HistoryDialog
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                txType="BURN"
            />
        </div>
    );
} 