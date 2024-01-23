import { useWeb3Modal } from '@web3modal/react'
import { useState } from 'react';

export default function ButtonConnect(props) {
    const { open } = useWeb3Modal()
    const [loading, setLoading] = useState(false)

    async function onOpen() {
        setLoading(true)
        await open()
        setLoading(false)
    }
    
    return (
        <button onClick={onOpen} disabled={loading} className="button-connect mx-auto !w-full">
            {loading ? 'Loading...' : "Connect Wallet"}
        </button>
    )
  }