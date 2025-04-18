import { useState, useEffect } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import axios from "axios";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import Select from 'react-select';

interface BankAccountFormProps {
    onSuccess: () => void;
}

interface Bank {
    bankCode: string;
    bankName: string;
    maxAmountTransfer: number;
}

interface BankOption {
    value: string;
    label: string;
    maxAmountTransfer: number;
}

export default function BankAccountForm({ onSuccess }: BankAccountFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
    const [bankOptions, setBankOptions] = useState<BankOption[]>([]);

    const {connectedAddress} = useConnectedAddress();

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await axios.get(`${process.env.RAMP_API_URL}/api/ramp/transaction/method`, {
                    params: {
                        wallet_address: connectedAddress,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data.status === 'success') {
                    setBanks(response.data.data);
                    const options = response.data.data.map((bank: Bank) => ({
                        value: bank.bankCode,
                        label: bank.bankName,
                        maxAmountTransfer: bank.maxAmountTransfer
                    }));
                    setBankOptions(options);
                } else {
                    setError('Failed to load banks list');
                }
            } catch (err) {
                setError('An error occurred while loading banks');
                console.error(err);
            }
        };

        if (connectedAddress) {
            fetchBanks();
        }
    }, [connectedAddress]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.target as HTMLFormElement);
            
            const response = await fetch(`${process.env.RAMP_API_URL}/api/ramp/add_bank`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wallet_address: connectedAddress,
                    account_number: formData.get('accountNumber'),
                    bank_code: selectedBank?.value,
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                onSuccess();
            } else {
                setError(data.message || 'Failed to register bank account');
            }
        } catch (err) {
            setError('An error occurred while registering the bank account');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderColor: '#d1d5db',
            borderRadius: '0.5rem',
            padding: '0.25rem',
            '&:hover': {
                borderColor: '#3b82f6',
            },
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3b82f6' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:hover': {
                backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6',
            },
        }),
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                    <HiXCircle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank
                </label>
                <Select
                    options={bankOptions}
                    value={selectedBank}
                    onChange={(option) => setSelectedBank(option)}
                    placeholder="Search and select a bank..."
                    isSearchable
                    styles={customStyles}
                    className="w-full"
                    required
                />
                {selectedBank && (
                    <p className="mt-1 text-sm text-gray-500">
                        Maximum transfer amount: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedBank.maxAmountTransfer)}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                </label>
                <input
                    type="text"
                    name="accountNumber"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !selectedBank}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        Register Bank Account
                        <HiCheckCircle className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    );
} 