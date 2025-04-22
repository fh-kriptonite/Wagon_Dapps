import { useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import BankAccountForm from "./BankAccountForm";
import Select from 'react-select';

interface BankAccount {
    bankCode: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    deleted: boolean;
}

interface BankAccountSectionProps {
    bankAccounts: BankAccount[];
    setSelectedBankAccount: (bankAccount: BankAccount) => void;
    selectedBankAccount: BankAccount | null;
}

interface BankAccountOption {
    value: string;
    label: string;
    bankAccount: BankAccount;
}

export default function BankAccountSection({ bankAccounts, setSelectedBankAccount, selectedBankAccount }: BankAccountSectionProps) {
    const [showBankForm, setShowBankForm] = useState(false);

    const handleBankRegistrationSuccess = () => {
        setShowBankForm(false);
    };

    const bankOptions: BankAccountOption[] = bankAccounts.map(account => ({
        value: account.bankAccountNumber,
        label: `${account.bankAccountName} - ${account.bankName} (${account.bankAccountNumber})`,
        bankAccount: account
    }));

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
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="w-full flex justify-between items-center gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Bank Account
                    </label>
                    {!showBankForm && (
                        <button
                            onClick={() => setShowBankForm(true)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Add Bank Account
                        </button>
                    )}
                </div>
            </div>

            {bankAccounts.length > 0 ? (
                <div className="space-y-4">
                    <Select
                        options={bankOptions}
                        value={selectedBankAccount ? bankOptions.find(opt => opt.bankAccount.bankAccountNumber === selectedBankAccount.bankAccountNumber) : null}
                        onChange={(option) => option && setSelectedBankAccount(option.bankAccount)}
                        placeholder="Select a bank account..."
                        styles={customStyles}
                        className="w-full"
                    />
                    {selectedBankAccount && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <HiCheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{selectedBankAccount.bankAccountName}</p>
                                <p className="text-sm text-gray-500">{selectedBankAccount.bankName} - {selectedBankAccount.bankAccountNumber}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <HiXCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No bank account registered</p>
                    <button
                        onClick={() => setShowBankForm(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Register Bank Account
                    </button>
                </div>
            )}

            {/* Bank Account Form Dialog */}
            {showBankForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">Register Bank Account</h3>
                                <button
                                    onClick={() => setShowBankForm(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <BankAccountForm onSuccess={handleBankRegistrationSuccess} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 