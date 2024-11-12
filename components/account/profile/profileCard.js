import { useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { HiMiniBanknotes } from "react-icons/hi2";
import { RiBankFill } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

export default function UnverifiedProfileCard(props) {
    
    const profile = props.profile;

    function getStatus() {
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

    function getStatusColor() {
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
        <div className="card w-full divide-y">
            <div className="flex gap-4 pb-4 items-center">
                <Jazzicon diameter={60} seed={jsNumberForAddress(profile.wallet_address)}/>
                <div>
                    <div className="flex gap-4 items-center mb-1">
                        <h4 className="">{profile.full_name}</h4>
                        <div className={`flex gap-1 items-center ${getStatusColor()} w-fit px-4 py-1 rounded-full text-white`}>
                            <p className="text-xs">{getStatus()}</p>
                            {
                                profile?.status == 1 &&
                                <MdVerified size={12}/>
                            }
                        </div>
                    </div>
                    <p className="text-sm font-bold mb-1">{profile.wallet_address}</p>
                    <div className="flex gap-2">
                        <p className="text-sm">Email :</p>
                        <p className="text-sm">{profile.email}</p>
                    </div>
                </div>
            </div>

            <div className="py-10 w-full">
                <div className="w-fit">
                    <p className="text-lg mb-4 font-bold">By Verifying your profile information, you have unlocked:</p>
                    <div className="flex gap-4">
                        <HiMiniBanknotes className="w-6 h-6 mb-1 text-gray-900"/>
                        <div>
                            <p className="text-sm font-bold">Effortless FIAT Lending</p>
                            <p className="text-xs mb-4">Transfer funds from your bank to contribute to the Wagon lending pool.</p>    
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <RiBankFill className="w-6 h-6 mb-1 text-gray-900"/>
                        <div>
                            <p className="text-sm font-bold">Easy offramp</p>
                            <p className="text-xs">Offramp your stable coin easily.</p>    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
