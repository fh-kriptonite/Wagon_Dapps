import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import { useAccount, ConnectButton, useModal } from '@particle-network/connectkit';
import { useConfig } from './ConfigContext';
import { MdEmail } from 'react-icons/md';
import { AiFillApple, AiFillGoogleCircle } from 'react-icons/ai';
import { SiWalletconnect } from "react-icons/si";
import { FaWallet } from 'react-icons/fa';

export default function ButtonConnect() {
    const {isConnected} = useAccount();
    const { setConfigType } = useConfig();
    const { isOpen, setOpen } = useModal();
    const [showDialog, setShowDialog] = useState(false);
    
    // Get button text based on connection state
    const getButtonText = () => {
        if (isConnected) {
            return 'Connected';
        }
        return 'Log In or Sign Up';
    };

    // Handle connection method selection
    const handleConnectionMethod = async (method: 'evm' | 'social') => {
        // First set the config type
        await setConfigType(method);
        
        // Close the dialog
        setShowDialog(false);
        
        // Then open the modal
        setOpen(true);
    };

    return (
        <div className="flex flex-col gap-2">
            {isConnected ? (
                <ConnectButton />
            ) : (
                <>
                    <Button
                        color="dark"
                        className="w-full min-w-[140px]"
                        onClick={() => setShowDialog(true)}
                    >
                        {getButtonText()}
                    </Button>
                    
                    {showDialog && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            onClick={() => setShowDialog(false)}
                        >
                            <div 
                                className="bg-white rounded-lg shadow-xl mx-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-center pt-6">
                                    <img src="/logo-title.png" alt="Logo" className="h-12"/>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Left section - Social Login */}
                                        <div className="flex flex-col items-center justify-center p-12 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                             onClick={() => handleConnectionMethod('social')}>
                                            <div className="text-xl font-bold mb-2">Social Login</div>
                                            <div className="text-sm text-gray-500 text-center mb-4">
                                                Connect with your social media accounts
                                            </div>
                                            <div className="flex space-x-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <MdEmail className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                        <AiFillGoogleCircle className="w-5 h-5 text-red-600" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <AiFillApple className="w-5 h-5 text-gray-800" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Right section - Crypto Wallet */}
                                        <div className="flex flex-col items-center justify-center p-12 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                             onClick={() => handleConnectionMethod('evm')}>
                                            <div className="text-xl font-bold mb-2">Crypto Wallet</div>
                                            <div className="text-sm text-gray-500 text-center mb-4">
                                                Connect with your crypto wallet
                                            </div>
                                            <div className="flex space-x-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <SiWalletconnect className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                        <img src="/crypto-wallet/metamask.png" alt="MetaMask" className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <FaWallet className="w-5 h-5 text-gray-800" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 