import { numberWithCommas } from "@/util/stringUtility";

interface BankAccount {
    bankCode: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    deleted: boolean;
}

interface ExchangeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    exchangeDetails: {
        amount: number;
    } | null;
    selectedBankAccount: BankAccount | null;
}

export default function ExchangeDialog({ isOpen, onClose, exchangeDetails, selectedBankAccount }: ExchangeDialogProps) {
    if (!isOpen || !exchangeDetails) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">Exchange Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <p className="text-gray-500">Amount</p>
                            <p className="font-medium">{numberWithCommas(exchangeDetails.amount)} IDRX</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-500">Bank Account</p>
                            <p className="font-medium">{selectedBankAccount?.bankAccountName}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-500">Status</p>
                            <p className="font-medium text-green-600">Processing</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
} 