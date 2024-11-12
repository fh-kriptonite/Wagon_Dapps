import { useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { HiMiniBanknotes } from "react-icons/hi2";
import { RiBankFill } from "react-icons/ri";

export default function UnverifiedProfileCard(props) {

    return (
        <div className="card w-full space-y-2">
            <div className="flex gap-4 items-center my-8">
                <div className="flex-initial w-1/3">
                    <img src={"/profile.png"} className="lg:h-60 mx-auto" alt="Profile"/>
                </div>
                <div className="flex-1">
                    <h4 className="mb-2">Verify your profile</h4>
                    <p className="mb-10 text-sm">Please submit the required documents below to complete your profile verification and unlock the following services:</p>
                    <div className="flex gap-4">
                        <HiMiniBanknotes className="w-6 h-6 mb-1 text-gray-900"/>
                        <div>
                            <p className="text-sm font-bold">Effortless FIAT Lending</p>
                            <p className="text-xs mb-4">Transfer funds from your bank to contribute to the Wagon lending pool.</p>    
                        </div>
                    </div>

                    <div className="flex gap-4 mb-10">
                        <RiBankFill className="w-6 h-6 mb-1 text-gray-900"/>
                        <div>
                            <p className="text-sm font-bold">Easy offramp</p>
                            <p className="text-xs">Offramp your stable coin easily.</p>    
                        </div>
                    </div>
                    
                    <Button color="dark" className="w-full"
                        onClick={()=>{
                            props.showForm();
                        }}
                    >
                        Verify
                    </Button>
                </div>
            </div>
        </div>
    );
}
