import React from 'react';
import ButtonConnect from './ButtonConnect';
import { HiOutlineWallet } from "react-icons/hi2";

interface DisconnectedProps {
    // Add any props if needed in the future
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            THEME_SKIN: string;
        }
    }
}

export default function Disconnected(_props: DisconnectedProps) {
    return (
        <div className="min-h-screen flex items-center justify-center -my-28">
            <div className="text-center p-8 max-w-2xl">
                
                {/* Wallet Icon */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 inline-block mb-6">
                    {Number(process.env.THEME_SKIN) === 2 ? (
                        <img 
                            src="/logo-waresix-square.png" 
                            className="h-24 mx-auto rounded-full shadow-lg" 
                            alt="Logo" 
                        />
                    ) : (
                        <img 
                            src="/logo.png" 
                            className="h-16 mx-auto" 
                            alt="Logo" 
                        />
                    )}
                </div>

                {/* Text Content */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Login to your account
                </h2>
                <p className="text-gray-600 mb-8">
                    Please connect your wallet to access your dashboard and manage your assets.
                </p>

                {/* Connect Button */}
                <div className="flex justify-center">
                    <ButtonConnect />
                </div>
            </div>
        </div>
    );
} 