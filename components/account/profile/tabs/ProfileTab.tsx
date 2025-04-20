import { MdSecurity, MdPerson, MdEmail, MdLocationOn, MdDescription, MdBadge, MdEdit, MdAccountBalance, MdDelete, MdSettings } from "react-icons/md";
import axios from "axios";
import { useEffect, useState } from "react";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import { Button, Alert } from "flowbite-react";
import BankAccountForm from "./BankAccountForm";

interface BankAccount {
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    id: number;
}

interface ProfileTabProps {
    status: number;
    wallet_address?: string;
    email?: string;
    full_name?: string;
    address?: string;
    document_type?: string;
    document_id?: string;
    bank_accounts?: Array<BankAccount>;
    onUpdateProfile?: () => void;
}

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText = "Delete",
    cancelText = "Cancel"
}: ConfirmationDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-gray-600">{message}</p>
                    <div className="flex justify-end gap-3">
                        <Button
                            color="gray"
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            color="failure"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ProfileTab({ 
    status,
    wallet_address,
    email,
    full_name,
    address,
    document_type,
    document_id
}: ProfileTabProps) {
    const getStatusText = () => {
        switch(status) {
            case 0:
                return "Waiting for verification";
            case 1:
                return "Verified";
            case 2:
                return "Failed to verify";
            default:
                return "Unknown";
        }
    };

    const getStatusDescription = () => {
        switch(status) {
            case 0:
                return "Your profile is pending verification. Please complete the verification process to access all features.";
            case 1:
                return "Your profile has been verified. You now have access to all platform features.";
            case 2:
                return "Verification failed. Please check your submitted information and try again.";
            default:
                return "Unknown status. Please contact support for assistance.";
        }
    };

    const { connectedAddress } = useConnectedAddress();
    const [bankAccounts, setBankAccounts] = useState<Array<BankAccount>>([]);
    const [showBankForm, setShowBankForm] = useState(false);
    const [isManagingAccounts, setIsManagingAccounts] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(null);
    const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'success' | 'failure' }>({
        show: false,
        message: '',
        type: 'success'
    });

    const getBankAccount = async () => {
        try {
            const response = await axios.get(`${process.env.RAMP_API_URL}/api/ramp/get_bank`, {
                params: {
                    wallet_address: connectedAddress,
                }
            });

            if (response.data.status === 'success') {
                setBankAccounts(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAccount = async (bankAccountId: number) => {
        try {
            const response = await axios.delete(`${process.env.RAMP_API_URL}/api/ramp/delete_bank/${bankAccountId}`, {
                data: {
                    wallet_address: connectedAddress
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 'success') {
                setBankAccounts(bankAccounts.filter(account => account.id !== bankAccountId));
                setAlert({
                    show: true,
                    message: 'Bank account deleted successfully',
                    type: 'success'
                });
            } else {
                setAlert({
                    show: true,
                    message: 'Failed to delete bank account',
                    type: 'failure'
                });
            }
        } catch (error) {
            console.error(error);
            setAlert({
                show: true,
                message: 'An error occurred while deleting the bank account',
                type: 'failure'
            });
        }
    };

    const handleDeleteClick = (account: BankAccount) => {
        setAccountToDelete(account);
        setShowDeleteDialog(true);
    };

    useEffect(() => {
        getBankAccount();
    }, [connectedAddress]);

    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <div className="py-4">
            {/* Alert */}
            {alert.show && (
                <div className="fixed top-4 right-4 z-[9999]">
                    <Alert
                        color={alert.type === 'success' ? 'success' : 'failure'}
                        onDismiss={() => setAlert({ ...alert, show: false })}
                        className="max-w-md"
                    >
                        <span className="font-medium">
                            {alert.message}
                        </span>
                    </Alert>
                </div>
            )}

            {/* Status Banner */}
            <div className={`mb-6 md:mb-8 p-4 md:p-6 rounded-2xl ${
                status === 1 
                    ? 'bg-green-50 border border-green-100' 
                    : status === 0
                    ? 'bg-yellow-50 border border-yellow-100'
                    : 'bg-red-50 border border-red-100'
            }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className={`p-2 md:p-3 rounded-xl ${
                            status === 1 
                                ? 'bg-green-100' 
                                : status === 0
                                ? 'bg-yellow-100'
                                : 'bg-red-100'
                        }`}>
                            <MdSecurity className={`w-5 h-5 md:w-6 md:h-6 ${
                                status === 1 
                                    ? 'text-green-600' 
                                    : status === 0
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                            }`} />
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-semibold text-gray-900">{getStatusText()}</h3>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">{getStatusDescription()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 md:space-y-6">
                {/* Personal Information Card */}
                <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <MdPerson className="w-5 h-5 md:w-6 md:h-6 text-blue-600"/>
                        </div>
                        <h5 className="font-semibold text-base md:text-lg">Personal Information</h5>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0 border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <MdPerson className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Full Name</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-gray-900 pl-11 md:pl-0">{full_name || 'Not provided'}</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0 border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <MdEmail className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Email Address</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-gray-900 pl-11 md:pl-0">{email || 'Not provided'}</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0 border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <MdBadge className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Wallet Address</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-gray-900 break-all pl-11 md:pl-0">{wallet_address || 'Not provided'}</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <MdLocationOn className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Physical Address</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-gray-900 pl-11 md:pl-0">{address || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Document Information Card */}
                <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <MdDescription className="w-5 h-5 md:w-6 md:h-6 text-purple-600"/>
                        </div>
                        <h5 className="font-semibold text-base md:text-lg">Document Information</h5>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0 border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <MdDescription className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Document Type</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-gray-900 pl-11 md:pl-0">{document_type || 'Not provided'}</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <MdBadge className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Document ID</p>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-gray-900 pl-11 md:pl-0">{document_id || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Bank Accounts Card */}
                <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <MdAccountBalance className="w-5 h-5 md:w-6 md:h-6 text-green-600"/>
                            </div>
                            <h5 className="font-semibold text-base md:text-lg">Bank Accounts</h5>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                color="blue"
                                onClick={() => setShowBankForm(true)}
                                className="flex items-center gap-2"
                            >
                                <MdEdit className="w-4 h-4" />
                                Add Account
                            </Button>
                            {bankAccounts.length > 0 && (
                                <Button
                                    color={isManagingAccounts ? "blue" : "gray"}
                                    onClick={() => setIsManagingAccounts(!isManagingAccounts)}
                                    className="flex items-center gap-2"
                                >
                                    <MdSettings className="w-4 h-4" />
                                    {isManagingAccounts ? "Done" : "Manage"}
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {bankAccounts && bankAccounts.length > 0 ? (
                            bankAccounts.map((account, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg">
                                                        <MdAccountBalance className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                                    </div>
                                                    <p className="text-xs md:text-sm font-medium text-gray-500">Bank Name</p>
                                                </div>
                                                <p className="text-xs md:text-sm font-medium text-gray-900 pl-11 md:pl-0">{account.bankName || 'Not provided'}</p>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg">
                                                        <MdBadge className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                                    </div>
                                                    <p className="text-xs md:text-sm font-medium text-gray-500">Account Number</p>
                                                </div>
                                                <p className="text-xs md:text-sm font-medium text-gray-900 font-mono pl-11 md:pl-0">{account.bankAccountNumber || 'Not provided'}</p>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg">
                                                        <MdPerson className="w-4 h-4 md:w-5 md:h-5 text-gray-600"/>
                                                    </div>
                                                    <p className="text-xs md:text-sm font-medium text-gray-500">Account Name</p>
                                                </div>
                                                <p className="text-xs md:text-sm font-medium text-gray-900 pl-11 md:pl-0">{account.bankAccountName || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        {isManagingAccounts && (
                                            <Button
                                                color="failure"
                                                size="xs"
                                                onClick={() => handleDeleteClick(account)}
                                                className="ml-4"
                                            >
                                                <MdDelete className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500">No bank accounts added</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <ConfirmationDialog
                    isOpen={showDeleteDialog}
                    onClose={() => {
                        setShowDeleteDialog(false);
                        setAccountToDelete(null);
                    }}
                    onConfirm={() => accountToDelete && handleDeleteAccount(accountToDelete.id)}
                    title="Delete Bank Account"
                    message={`Are you sure you want to delete the bank account ${accountToDelete?.bankAccountNumber}? This action cannot be undone.`}
                />

                {/* Bank Account Form Dialog */}
                {showBankForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">Add Bank Account</h3>
                                    <button
                                        onClick={() => setShowBankForm(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <BankAccountForm onSuccess={() => {
                                    setShowBankForm(false);
                                    getBankAccount();
                                }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Help Section */}
            <div className="mt-8 bg-blue-50 rounded-xl border border-blue-100 p-6">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <MdSecurity className="w-6 h-6 text-blue-600"/>
                    </div>
                    <div>
                        <h6 className="font-medium text-blue-900">Need Help?</h6>
                        <p className="text-sm text-blue-700 mt-1">
                            If you have any questions about your profile or verification status, please contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 