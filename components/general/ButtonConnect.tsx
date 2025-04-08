import React from 'react';

interface ButtonConnectProps {
    onOpen?: () => void;
    loading?: boolean;
}

export default function ButtonConnect({ onOpen, loading }: ButtonConnectProps) {
    return (
        // <button onClick={onOpen} disabled={loading} className="button-connect mx-auto !w-full">
        //     {loading ? 'Loading...' : "Connect Wallet"}
        // </button>
        <></>
    );
} 