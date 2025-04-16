import { Tabs } from "flowbite-react";
import { HiMiniBanknotes, HiUserCircle } from "react-icons/hi2";
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
    onramp_enabled?: boolean;
    offramp_enabled?: boolean;
}

interface ProfileCardProps {
    profile: Profile | null;
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
                return "bg-orange-400"
            case 1:
                return "bg-green-500"
            case 2:
                return "bg-red-600"
            default:
                return "";
        }
    }

    return (
        <div className="card w-full">
            <div className="flex gap-4 pb-4 items-center">
                <Jazzicon diameter={60} seed={jsNumberForAddress(profile?.wallet_address || "")}/>
                <div className="w-full">
                    <div className="flex gap-4 items-center mb-1">
                        <h4 className="">{profile?.full_name}</h4>
                        <div className={`flex gap-1 items-center ${getStatusColor()} w-fit px-4 py-1 rounded-full text-white`}>
                            <p className="text-xs">{getStatus()}</p>
                            {
                                profile?.status === 1 &&
                                <MdVerified size={12}/>
                            }
                        </div>
                    </div>
                    <p 
                        className="text-sm font-bold mb-1 overflow-hidden text-ellipsis whitespace-nowrap"
                        title={profile?.wallet_address}
                    >
                        {profile?.wallet_address}
                    </p>
                    <div className="flex gap-2">
                        <p className="text-sm">Email :</p>
                        <p className="text-sm">{profile?.email}</p>
                    </div>
                </div>
            </div>

            <Tabs variant="underline">
                <Tabs.Item active title="Profile" icon={HiUserCircle}>
                    <ProfileTab 
                        status={profile?.status || 0}
                        wallet_address={profile?.wallet_address}
                        email={profile?.email}
                        full_name={profile?.full_name}
                        address={profile?.address}
                        document_type={profile?.document_type}
                        document_id={profile?.document_id}
                    />
                </Tabs.Item>

                <Tabs.Item title="Onramp" icon={HiMiniBanknotes}>
                    <OnrampTab onramp_enabled={profile?.onramp_enabled} />
                </Tabs.Item>

                <Tabs.Item title="Offramp" icon={MdAccountBalance}>
                    <OfframpTab offramp_enabled={profile?.offramp_enabled} />
                </Tabs.Item>
            </Tabs>
        </div>
    );
} 