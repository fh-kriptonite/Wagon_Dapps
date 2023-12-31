import { Web3Button, Web3NetworkSwitch } from '@web3modal/react'
import { BsCoin, BsBank2 } from 'react-icons/bs'
import {MdHowToVote, MdOutlineQueryStats} from 'react-icons/md'
import {FaCoins} from 'react-icons/fa'
import {AiFillDatabase} from 'react-icons/ai'

import Link from 'next/link'
import { useNetwork } from 'wagmi'

export default function Sidebar(props) {
    const { chain } = useNetwork()

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            
                            <Link href='/'>
                                <img src="/logo-title.png" className="ml-2 md:mr-24 h-8 sm:h-10 hover:cursor-pointer" alt="Wagon Logo" />
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ml-3 gap-2">
                                <div className='hidden md:block'>
                                    <Web3NetworkSwitch/>
                                </div>
                                <Web3Button icon="show" label="Connect Wallet" balance="hide" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    {
                        // base goerli
                        chain?.id == 84531 &&
                        <ul className="space-y-2 font-medium pb-2 border-b border-gray-200 dark:border-gray-700">
                            <li>
                                <Link href="/faucet">
                                    <div className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                                        <BsCoin className='w-6 h-6 text-gray-500 '/>
                                        <span className="flex-1 ml-3 whitespace-nowrap">Faucet</span>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    }
                    <ul className="pt-2 mt-2 space-y-2 font-medium">
                        <li>
                            <Link href="/">
                                <div className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                                    <FaCoins className='w-6 h-6 text-gray-500'/>
                                    <span className="ml-3">Stake</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/lend">
                                <div className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                                    <BsBank2 className='w-6 h-6 text-gray-500'/>
                                    <span className="ml-3">Lend</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dataNetwork">
                                <div className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                                    <AiFillDatabase className='w-6 h-6 text-gray-500'/>
                                    <span className="ml-3">Data Network</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dataAnalytics">
                                <div className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                                    <MdOutlineQueryStats className='w-6 h-6 text-gray-500'/>
                                    <span className="ml-3">Data Analytics</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/governance">
                                <div className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                                    <MdHowToVote className='w-6 h-6 text-gray-500'/>
                                    <span className="ml-3">Governance</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                    <div id="dropdown-cta" className="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900" role="alert">
                        <div className="flex items-center mb-3">
                            <span className="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Beta</span>
                        </div>
                        <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">
                            Expect potential bugs, frequent updates, and features subject to change. User discretion is advised as we refine and enhance the application.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    )
  }