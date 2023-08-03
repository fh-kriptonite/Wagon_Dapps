import { useWeb3Modal } from '@web3modal/react'
import { useState } from 'react';

export default function Disconnected(props) {
    const { open } = useWeb3Modal()
    const [loading, setLoading] = useState(false)

    async function onOpen() {
        setLoading(true)
        await open()
        setLoading(false)
    }
    
    return (
        <div className='-my-28 h-screen flex'>
            <div className='m-auto text-center'>
                <img src="/logo.png" className="h-16 mx-auto" alt="Wagon Logo" />
                <h5 className="text-xl font-bold mt-5">
                    Please, connect your wallet
                </h5>
                <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                    Pelase connect your wallet to see your staking dashboard.
                </p>
                <button onClick={onOpen} disabled={loading} className="button-connect mx-auto">
                    {loading ? 'Loading...' : "Connect Wallet"}
                </button>
            </div>
        </div>
    )
  }