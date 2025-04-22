import { HiArrowRight } from "react-icons/hi2";
import { numberWithCommas, shortenAddress } from "@/util/stringUtility";
import { Button, List } from "flowbite-react";
import { ImCross } from "react-icons/im";
import { MdOpenInNew } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";

interface PaymentDialogProps {
    accountName: string;
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

export default function PaymentDialog({accountName, isOpen, onClose, paymentDetails }: PaymentDialogProps) {
    if (!isOpen || !paymentDetails) return null;

    const handleProceedToPayment = () => {
        if (paymentDetails.paymentUrl) {
            window.open(paymentDetails.paymentUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
                <div className='flex justify-between items-center mb-6'>
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                        Payment Details
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <ImCross className="w-4 h-4"/>
                    </button>
                </div>

                <p className="text-base font-medium text-gray-900 mb-4">
                    Follow the payment link to transfer the fund
                </p>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className='mb-3'>
                        <p className='text-sm text-gray-600'>Transfer Amount</p>
                        <p className='mt-1 text-lg font-semibold text-gray-900'>
                            Rp {numberWithCommas(paymentDetails.amount, 2)}
                        </p>
                    </div>

                    <hr className="my-3 h-px bg-gray-200 border-0" />

                    <div className='mb-3'>
                        <p className='text-sm text-gray-600'>Account Name</p>
                        <p className='mt-1 text-lg font-semibold text-gray-900'>
                            {accountName}
                        </p>
                        <div className='flex gap-2 items-center mt-2'>
                            <IoIosWarning className="text-amber-500 w-4 h-4"/>
                            <p className='text-xs text-gray-600'>Bank account name must match your account</p>
                        </div>
                    </div>

                    <hr className="my-3 h-px bg-gray-200 border-0" />

                    <div className='mb-3'>
                      <p className='text-sm text-gray-600'>Wallet Address</p>
                      <p className='mt-1 text-lg font-semibold text-gray-900'>{shortenAddress(paymentDetails?.wallet_address, 8)}</p>
                    </div>

                    <hr className="my-3 h-px bg-gray-200 border-0" />

                    <div className=''>
                        <p className='text-sm text-gray-600'>Payment Link</p>
                        <a 
                            href={paymentDetails.paymentUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <p className='text-sm truncate'>{paymentDetails.paymentUrl}</p>
                            <MdOpenInNew className="w-4 h-4"/>
                        </a>
                    </div>
                </div>

                <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <List className='space-y-2'>
                        <List.Item className="text-xs text-gray-600">
                            Some of the transfer amount will be cut for onramp and gas fee.
                        </List.Item>
                        <List.Item className="text-xs text-gray-600">
                            If the transfer amount or bank account name doesn't match, please contact our Customer Support immediately for a refund (processed within 15 working days).
                        </List.Item>
                        <List.Item className="text-xs text-gray-600">
                            Please note that Wagon needs approximately 1-2 business days to process your payment and update your lending status.
                        </List.Item>
                    </List>

                    <hr className="my-4 h-px bg-gray-200 border-0" />

                    <div className="flex items-center gap-2">
                        <p className='text-xs text-gray-600'>
                            Contact Customer Support:
                        </p>
                        <a 
                            className='text-blue-600 hover:text-blue-700 transition-colors' 
                            target="_blank"
                            rel="noopener noreferrer"
                            href='https://t.me/wagon_network'
                        >
                            @wagon_network
                        </a>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <Button
                        color="dark"
                        onClick={handleProceedToPayment}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2"
                    >
                        Proceed to Payment
                        <HiArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                        color="light"
                        onClick={onClose}
                        className="w-full hover:bg-gray-50 transition-colors"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
} 