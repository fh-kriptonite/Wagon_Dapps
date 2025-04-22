import { useEffect, useState } from "react";
import VerificationForm from "./verificationForm";
import ProfileCard from "./profileCard";
import UnverifiedProfileCard from "./unverifiedProfileCard";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import axios from "axios";
import LoadingCard from "./loadingCard";
import { HiShieldCheck, HiLockClosed, HiArrowRight } from "react-icons/hi2";

interface Profile {
  status: number;
  wallet_address: string;
  full_name: string;
  email: string;
  address: string;
  document_type: string;
  document_id: string;
  [key: string]: any;
}

interface ApiResponse {
  data: Profile | null;
  error: string | null;
}

interface ProfileComponentProps {
  [key: string]: any;
}

export default function ProfileComponent(props: ProfileComponentProps) {
    const { connectedAddress: accountAddress } = useConnectedAddress();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [showVerificationForm, setShowVerficationForm] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    function handleShowForm(): void {
        setShowVerficationForm(true);
    }

    function handleCloseForm(): void {
        setShowVerficationForm(false);
    }

    async function getAccount(): Promise<void> {
        setIsLoading(true);

        try {
            // Request Account
            const response = await axios.get<ApiResponse>(`/api/account/getAccount?wallet_address=${accountAddress}`);

            console.log(response.data)
            // Handle success response
            if(response.data.error) {
                throw response.data.error
            }
            setProfile(response.data.data)
        } catch (error) {
            // Handle error response
            setProfile(null);
            console.error('Error getting profile:', error);
        }

        setIsLoading(false);
    }

    useEffect(()=>{
        if(accountAddress) {
            getAccount()
        }
    },[accountAddress])

    return (
        <div className="max-w-7xl mx-auto space-y-4 pb-4">
            <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                    <HiShieldCheck className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold">Account Verification</h2>
                                    <p className="text-blue-100 mt-2 text-sm md:text-base">
                                        Complete your profile verification to unlock all platform features
                                    </p>
                                </div>
                            </div>
                            {!isLoading && !showVerificationForm && profile?.status !== 1 && (
                                <button
                                    onClick={handleShowForm}
                                    className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2.5 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                                >
                                    <HiLockClosed className="w-5 h-5" />
                                    Start Verification
                                    <HiArrowRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {isLoading ? (
                        <LoadingCard />
                    ) : showVerificationForm ? (
                        <VerificationForm closeForm={handleCloseForm} refreshAccount={getAccount} />
                    ) : profile == null ? (
                        <UnverifiedProfileCard showForm={handleShowForm} />
                    ) : (
                        <ProfileCard profile={profile} />
                    )}
                </div>
            </div>
        </div>
    );
} 