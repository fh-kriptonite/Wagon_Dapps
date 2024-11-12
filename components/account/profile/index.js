import { useEffect, useState } from "react";
import VerificationForm from "./verificationForm";
import ProfileCard from "./profileCard";
import UnverifiedProfileCard from "./unverifiedProfileCard";
import { useAccount } from "@particle-network/connectkit";
import axios from "axios";
import { Spinner } from "flowbite-react";
import LoadingCard from "./loadingCard";

export default function ProfileComponent(props) {
    const account = useAccount();

    const [profile, setProfile] = useState(null);
    const [showVerificationForm, setShowVerficationForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function handleShowForm() {
        setShowVerficationForm(true);
    }

    function handleCloseForm() {
        setShowVerficationForm(false);
    }

    async function getAccount() {
        setIsLoading(true);

        if (account == null) return;

        try {
            // Request Account
            const response = await axios.get(`/api/account/getAccount?wallet_address=${account}`);

            // Handle success response
            console.log(response)
            if(response.error) {
                throw response.error
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
        getAccount()
    },[account])

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
