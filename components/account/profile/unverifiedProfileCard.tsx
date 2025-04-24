import { Button } from "flowbite-react";
import { HiMiniBanknotes } from "react-icons/hi2";
import { RiBankFill } from "react-icons/ri";

interface UnverifiedProfileCardProps {
    showForm: () => void;
}

export default function UnverifiedProfileCard({ showForm }: UnverifiedProfileCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-initial w-full lg:w-1/3 mx-auto">
                    <img 
                        src={"/profile.png"} 
                        className="w-full max-w-xs mx-auto rounded-lg shadow-sm" 
                        alt="Profile"
                    />
                </div>
                <div className="flex-1 max-w-2xl mx-auto">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Verify your profile</h4>
                    <p className="text-sm text-gray-600 mb-8">
                        Please submit the required documents below to complete your profile verification and unlock the following services:
                    </p>
                    
                    <div className="space-y-6 mb-8">
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <HiMiniBanknotes className="w-5 h-5 text-blue-600"/>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Effortless FIAT Lending</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Transfer funds from your bank to contribute to the Wagon lending pool.
                                </p>    
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <RiBankFill className="w-5 h-5 text-blue-600"/>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Easy offramp</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Offramp your stable coin easily.
                                </p>    
                            </div>
                        </div>
                    </div>
                    
                    <Button 
                        color="dark"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={showForm}
                    >
                        Verify Profile
                    </Button>
                </div>
            </div>
        </div>
    );
} 