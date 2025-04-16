import { useEffect, useState } from "react";
import VerificationForm from "./verificationForm";
import ProfileCard from "./profileCard";
import UnverifiedProfileCard from "./unverifiedProfileCard";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import axios from "axios";
import LoadingCard from "./loadingCard";

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
        <div className="container mx-auto">  
            <div className="flex flex-col gap-4">
                <div className="flex-1">
                    <div className="p-4 rounded-lg bg-blue-50 text-blue-900 sticky top-20">
                        <h4 className="font-semibold">Account Profile</h4>
                        <p className="mt-2 text-sm">Verify your account profile to unlock <span className="font-bold">lend with local FIAT service</span>.</p>
                    </div>
                </div>

                <div className="flex-1">
                    {
                        isLoading
                        ? <LoadingCard/>
                        : showVerificationForm
                            ? <VerificationForm closeForm={handleCloseForm} refreshAccount={()=>{getAccount()}}/>
                            : profile == null
                                ? <UnverifiedProfileCard showForm={handleShowForm}/>
                                : <ProfileCard profile={profile}/>
                    }
                </div>
            </div>
        </div>
    );
} 