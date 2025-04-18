import { Tabs } from "flowbite-react";
import { HiMiniBanknotes, HiUserCircle, HiShieldCheck, HiEnvelope, HiIdentification } from "react-icons/hi2";
import { MdVerified, MdAccountBalance } from "react-icons/md";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import ProfileTab from "./tabs/ProfileTab";
import OnrampTab from "./tabs/OnrampTab";
import OfframpTab from "./tabs/OfframpTab";

interface Profile {
    status: number;
    wallet_address: string;
    full_name: string;
    email: string;
    address?: string;
    document_type?: string;
    document_id?: string;
}

interface ProfileCardProps {
    profile: Profile | null;
}

function isVerified(status: number): boolean {
    if(status == null) return false;
    return status === 1;
}

export default function UnverifiedProfileCard({ profile }: ProfileCardProps) {
    function getStatus(): string {
        if(profile == null) return "";

        switch(profile.status) {
            case 0:
                return "Waiting for verification"
            case 1:
                return "Verified"
            case 2:
                return "Failed to verify"
            default:
                return "";
        }
    }

    function getStatusColor(): string {
        if(profile == null) return "";
        
        switch(profile.status) {
            case 0:
                return "bg-yellow-100 text-yellow-800"
            case 1:
                return "bg-green-100 text-green-800"
            case 2:
                return "bg-red-100 text-red-800"
            default:
                return "";
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border">
            {/* Profile Header */}
            <div className="p-4 md:p-8 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative hidden md:block">
                            <div className=" w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                                <Jazzicon diameter={48} seed={jsNumberForAddress(profile?.wallet_address || "")} />
                            </div>
                            {profile?.status === 1 && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                    <MdVerified className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                                <h3 className="text-lg md:text-2xl font-semibold text-gray-900">{profile?.full_name}</h3>
                                <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor()}`}>
                                    <HiShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>{getStatus()}</span>
                                </div>
                            </div>
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                                    <HiEnvelope className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="break-all">{profile?.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                                    <HiIdentification className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="font-mono break-all">{profile?.wallet_address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="p-3 md:p-6">
                <Tabs variant="underline" className="border-b border-gray-200">
                    <Tabs.Item 
                        active 
                        title={
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <HiUserCircle className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="text-xs md:text-sm">Profile</span>
                            </div>
                        }
                    >
                        <div className="mt-4 md:mt-6">
                            <ProfileTab 
                                status={profile?.status || 0}
                                wallet_address={profile?.wallet_address}
                                email={profile?.email}
                                full_name={profile?.full_name}
                                address={profile?.address}
                                document_type={profile?.document_type}
                                document_id={profile?.document_id}
                            />
                        </div>
                    </Tabs.Item>

                    <Tabs.Item 
                        title={
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <HiMiniBanknotes className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="text-xs md:text-sm">Onramp</span>
                            </div>
                        }
                    >
                        <div className="mt-4 md:mt-6">
                            <OnrampTab onramp_enabled={isVerified(profile?.status || 0)} />
                        </div>
                    </Tabs.Item>

                    <Tabs.Item 
                        title={
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <MdAccountBalance className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="text-xs md:text-sm">Offramp</span>
                            </div>
                        }
                    >
                        <div className="mt-4 md:mt-6">
                            <OfframpTab offramp_enabled={isVerified(profile?.status || 0)} />
                        </div>
                    </Tabs.Item>
                </Tabs>
            </div>
        </div>
    );
} 