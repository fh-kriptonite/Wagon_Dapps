import { MdSecurity, MdPerson, MdEmail, MdLocationOn, MdDescription, MdBadge } from "react-icons/md";

interface ProfileTabProps {
    status: number;
    wallet_address?: string;
    email?: string;
    full_name?: string;
    address?: string;
    document_type?: string;
    document_id?: string;
}

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
            
            {/* Personal Information Section */}
            <div className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <MdPerson className="w-6 h-6 text-purple-600"/>
                    </div>
                    <h5 className="font-semibold text-lg">Personal Information</h5>
                </div>
                <div className="pl-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <MdPerson className="w-4 h-4"/>
                            <p className="text-xs">Full Name</p>
                        </div>
                        <p className="text-sm font-medium pl-6">{full_name || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <MdEmail className="w-4 h-4"/>
                            <p className="text-xs">Email Address</p>
                        </div>
                        <p className="text-sm font-medium pl-6">{email || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <MdBadge className="w-4 h-4"/>
                            <p className="text-xs">Wallet Address</p>
                        </div>
                        <p className="text-sm font-medium pl-6 break-all">{wallet_address || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <MdLocationOn className="w-4 h-4"/>
                            <p className="text-xs">Physical Address</p>
                        </div>
                        <p className="text-sm font-medium pl-6">{address || 'Not provided'}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* Document Information Section */}
            <div className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <MdDescription className="w-6 h-6 text-green-600"/>
                    </div>
                    <h5 className="font-semibold text-lg">Document Information</h5>
                </div>
                <div className="pl-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <MdDescription className="w-4 h-4"/>
                            <p className="text-xs">Document Type</p>
                        </div>
                        <p className="text-sm font-medium pl-6">{document_type || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <MdBadge className="w-4 h-4"/>
                            <p className="text-xs">Document ID</p>
                        </div>
                        <p className="text-sm font-medium pl-6">{document_id || 'Not provided'}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* KYC Status Section */}
            <div className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <MdSecurity className="w-6 h-6 text-blue-600"/>
                    </div>
                    <h5 className="font-semibold text-lg">Verification Status</h5>
                </div>
                <div className="pl-12">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                        <p className="text-sm font-medium">
                            {getStatusText()}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 pl-6 border-l-2 border-gray-100">
                        {getStatusDescription()}
                    </p>
                </div>
            </div>

        </div>
    );
} 