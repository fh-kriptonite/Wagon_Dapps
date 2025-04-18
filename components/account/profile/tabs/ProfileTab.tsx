import { MdSecurity, MdPerson, MdEmail, MdLocationOn, MdDescription, MdBadge, MdEdit } from "react-icons/md";
import { Button } from "flowbite-react";

interface ProfileTabProps {
    status: number;
    wallet_address?: string;
    email?: string;
    full_name?: string;
    address?: string;
    document_type?: string;
    document_id?: string;
    onUpdateProfile?: () => void;
}

export default function ProfileTab({ 
    status,
    wallet_address,
    email,
    full_name,
    address,
    document_type,
    document_id,
    onUpdateProfile
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

    const getStatusColor = () => {
        switch(status) {
            case 0:
                return "bg-orange-400";
            case 1:
                return "bg-green-500";
            case 2:
                return "bg-red-600";
            default:
                return "bg-gray-400";
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

    return (
        <div className="py-4">
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
                    <Button
                        color="blue"
                        onClick={onUpdateProfile}
                        className="flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <MdEdit className="w-4 h-4 md:w-5 md:h-5" />
                        Update Profile
                    </Button>
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