import { Web3Button } from '@web3modal/react'
import Link from 'next/link'

export default function Navbar(props) {

    return (
        <nav>
            <div className="container flex items-center justify-between mx-auto py-5 px-4 md:px-10 gap-4">
                <Link href='/'>
                    <img src="/logo-title.png" className="h-8 sm:h-10 hover:cursor-pointer" alt="Wagon Logo" />
                </Link>
                
                <Web3Button icon="show" label="Connect Wallet" balance="hide" />
            </div>
        </nav>
    )
  }