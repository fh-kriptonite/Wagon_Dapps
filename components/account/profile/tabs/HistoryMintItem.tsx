import { formatDate, numberWithCommas, shortenAddress } from '@/util/stringUtility';
import { Button } from 'flowbite-react';

interface HistoryMintItemProps {
    item: {
        id: string;
        merchantOrderId: string;
        paymentAmount: number;
        paymentStatus: string;
        createdAt: string;
        networkName: string;
        destinationWalletAddress: string;
        reference: string;
        userMintStatus: string;
    };
}

export const HistoryMintItem = ({ item }: HistoryMintItemProps) => {
    const handlePayment = () => {
        window.open(`https://app-prod.duitku.com/redirect_checkout?reference=${item.reference}`, '_blank');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 text-green-800';
            case 'WAITING_FOR_PAYMENT':
                return 'bg-yellow-100 text-yellow-800';
            case 'EXPIRED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getMintStatusColor = (status: string) => {
        switch (status) {
            case 'NOT_AVAILABLE':
                return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800';
            case 'MINTED':
                return 'bg-green-100 text-green-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'REFUND':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getMintStatusLabel = (status: string) => {
        switch (status) {
            case 'NOT_AVAILABLE':
                return 'Waiting for Payment';
            case 'PROCESSING':
                return 'Processing';
            case 'MINTED':
                return 'Minted';
            case 'FAILED':
                return 'Failed';
            case 'REJECTED':
                return 'Rejected';
            case 'REFUND':
                return 'Refunded';
            default:
                return status;
        }
    };

    return (
        <div className="bg-white p-6">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-2 w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                            <div className="flex items-center gap-2">
                                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.paymentStatus)}`}>
                                    {item.paymentStatus.replace(/_/g, ' ')}
                                </div>
                                {item.paymentStatus !== 'WAITING_FOR_PAYMENT' && (
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getMintStatusColor(item.userMintStatus)}`}>
                                        {getMintStatusLabel(item.userMintStatus)}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatDate(item.createdAt)}
                            </div>
                        </div>
                        <div className="flex justify-between md:items-center gap-2">
                            <p className="text-2xl font-semibold text-gray-900">
                                {numberWithCommas(item.paymentAmount)} IDR
                            </p>
                            {item.paymentStatus === 'WAITING_FOR_PAYMENT' && (
                                <div className="hidden md:block">
                                    <Button
                                        color="blue"
                                        onClick={handlePayment}
                                    >
                                        Go to Payment
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</p>
                        <p className="text-sm text-gray-900 font-mono">{item.merchantOrderId}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Network</p>
                        <p className="text-sm text-gray-900">{item.networkName}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</p>
                        <p className="text-sm text-gray-900 font-mono">{shortenAddress(item.destinationWalletAddress, 6)}</p>
                    </div>
                </div>

                {/* Payment Button - Mobile only */}
                {item.paymentStatus === 'WAITING_FOR_PAYMENT' && (
                    <div className="md:hidden pt-4 border-t border-gray-100">
                        <Button
                            color="blue"
                            onClick={handlePayment}
                            className="w-full"
                        >
                            Go to Payment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}; 