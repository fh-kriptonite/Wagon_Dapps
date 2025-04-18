import { HiArrowRight } from "react-icons/hi2";
import { numberWithCommas, shortenAddress } from "@/util/stringUtility";
import { Button } from "flowbite-react";

interface PaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    paymentDetails: {
        amount: string;
        id: number;
        merchantCode: string;
        merchantOrderId: string;
        paymentUrl: string;
        reference: string;
        statusCode: string;
        statusMessage: string;
        wallet_address: string;
    } | null;
}

export default function PaymentDialog({ isOpen, onClose, paymentDetails }: PaymentDialogProps) {
    if (!isOpen || !paymentDetails) return null;

    const handleProceedToPayment = () => {
        if (paymentDetails.paymentUrl) {
            window.open(paymentDetails.paymentUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900">Payment Details</h3>
                        <p className="text-sm text-gray-500 mt-1">Please proceed to complete your payment</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Amount</span>
                            <span className="text-sm font-medium">{numberWithCommas(paymentDetails.amount, 2)} IDR</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Reference</span>
                            <span className="text-sm font-medium">{paymentDetails.reference}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Wallet Address</span>
                            <span className="text-sm font-medium">{shortenAddress(paymentDetails.wallet_address, 6)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Status</span>
                            <span className="text-sm font-medium text-green-600">{paymentDetails.statusMessage}</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            color="blue"
                            onClick={handleProceedToPayment}
                            className="w-full transition-colors flex items-center justify-center gap-2"
                        >
                            Proceed to Payment
                            <HiArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                            color="light"
                            onClick={onClose}
                            className="w-full hover:bg-gray-50 transition-colors mt-3"
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 