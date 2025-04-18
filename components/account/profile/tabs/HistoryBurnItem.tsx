import { formatDate, numberWithCommas, shortenAddress } from '@/util/stringUtility';

interface HistoryBurnItemProps {
    item: {
        id: string;
        custRefNumber: string;
        amount: string;
        burnStatus: string;
        combined_createdAt: string;
        networkName: string;
        fromAddress: string;
        bankName: string;
        bankAccountNumber: string;
        bankAccountName: string;
        burnTxHash: string;
        txHash: string;
        requester: string;
    };
}

export const HistoryBurnItem = ({ item }: HistoryBurnItemProps) => {
    const getBurnStatusColor = (status: string) => {
        switch (status) {
            case 'REQUESTED':
                return 'bg-yellow-100 text-yellow-800';
            case 'IN_PROCESS':
                return 'bg-blue-100 text-blue-800';
            case 'SUCCESS':
                return 'bg-green-100 text-green-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBurnStatusLabel = (status: string) => {
        switch (status) {
            case 'REQUESTED':
                return 'Requested';
            case 'IN_PROCESS':
                return 'In Process';
            case 'SUCCESS':
                return 'Success';
            case 'FAILED':
                return 'Failed';
            default:
                return status;
        }
    };

    return (
        <div className="bg-white p-6">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                            <span className={`px-2.5 w-fit py-1 rounded-full text-xs font-medium ${getBurnStatusColor(item.burnStatus)}`}>
                                {getBurnStatusLabel(item.burnStatus)}
                            </span>
                            <span className="text-xs text-gray-500">
                                {formatDate(item.combined_createdAt)}
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                            {numberWithCommas(parseInt(item.amount))} IDRX
                        </p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</p>
                        <p className="text-sm text-gray-900 font-mono">{item.custRefNumber}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Network</p>
                        <p className="text-sm text-gray-900">{item.networkName}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</p>
                        <p className="text-sm text-gray-900 font-mono">{shortenAddress(item.fromAddress, 6)}</p>
                    </div>
                </div>

                {/* Bank Details Section */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</p>
                        <p className="text-sm text-gray-900">{item.bankName}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</p>
                        <p className="text-sm text-gray-900 font-mono">{item.bankAccountNumber}</p>
                    </div>
                </div>

                {/* Transaction Hash Section */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</p>
                        <p className="text-sm text-gray-900 font-mono break-all">{item.txHash || item.burnTxHash}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 