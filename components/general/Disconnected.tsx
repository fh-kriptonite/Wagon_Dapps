import React from 'react';
import ButtonConnect from './ButtonConnect';

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
        <div className='h-full flex'>
            <div className='m-auto text-center'>
                {Number(process.env.THEME_SKIN) === 2 ? (
                    <img 
                        src="/logo-waresix-square.png" 
                        className="h-32 mx-auto rounded-full" 
                        alt="Logo" 
                    />
                ) : (
                    <img 
                        src="/logo.png" 
                        className="h-16 mx-auto" 
                        alt="Logo" 
                    />
                )}
                <h5 className="text-xl font-bold mt-5">
                    Please, connect your wallet
                </h5>
                <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                    Please connect your wallet to see your staking dashboard.
                </p>
                <ButtonConnect />
            </div>
        </div>
    );
} 