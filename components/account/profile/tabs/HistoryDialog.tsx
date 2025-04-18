import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { HistoryMintItem } from './HistoryMintItem';
import { HistoryBurnItem } from './HistoryBurnItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';

interface HistoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    txType: 'MINT' | 'BURN';
}

export const HistoryDialog = ({ isOpen, onClose, txType }: HistoryDialogProps) => {
    const [histories, setHistories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {connectedAddress} = useConnectedAddress();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!isOpen) return;
            
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.RAMP_API_URL}/api/ramp/history`, {
                    params: {
                        wallet_address: connectedAddress,
                        txType: txType,
                        page: 1,
                        take: 10,
                    }
                });
                if (response.data.status === 'success') {
                    setHistories(response.data.data);
                } else {
                    setHistories([]);
                }
            } catch (error) {
                console.error('Error fetching history:', error);
                setHistories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-2xl bg-white p-6">
                    <div className="flex items-center justify-between mb-6">
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                            Transaction History
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 hover:bg-gray-100"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[500px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="w-8 h-8 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                            </div>
                        ) : histories.length > 0 ? (
                            <div className="space-y-4 divide-y divide-gray-200">
                                {histories.map((item) => (
                                    txType === 'MINT' ? (
                                        <HistoryMintItem key={item.id} item={item} />
                                    ) : (
                                        <HistoryBurnItem key={item.id} item={item} />
                                    )
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">
                                No transaction history found
                            </p>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}; 