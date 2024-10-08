import { BsBank2 } from 'react-icons/bs'
import {MdHowToVote, MdOutlineQueryStats, MdDashboard} from 'react-icons/md'
import { BiTransferAlt } from "react-icons/bi";
import {FaCoins, FaBook, FaQuestionCircle} from 'react-icons/fa'
import {AiFillDatabase} from 'react-icons/ai'
import { useRouter } from 'next/router';
import { RiTokenSwapFill } from "react-icons/ri";

import Link from 'next/link'
import { ConnectButton } from '@particle-network/connectkit';

export default function Sidebar(props) {
    const router = useRouter();
    const { asPath } = router;

    // Access the current pathname
    const currentPath = router.pathname;

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            
                            <Link href='/'>
                                <img src="/logo-title.png" className="ml-2 md:mr-24 h-8 sm:h-10 hover:cursor-pointer" alt="Wagon Logo" />
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ml-3 gap-2">
                                <ConnectButton/>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-56 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium pb-2 border-b border-gray-200 dark:border-gray-700 text-sm">
                        <li>
                            <Link href="/">
                                <div className={`${currentPath === '/' ? "bg-gray-100" : ""} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                                    <MdDashboard className='w-5 h-5 text-gray-500'/>
                                    <span className="ml-3">Account</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                    <ul className="pt-2 mt-2 space-y-2 font-medium text-sm">
                        <li>
                            <Link href="/bridge">
                                <div className={`${currentPath === '/bridge' ? "bg-gray-100" : ""} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                                    <BiTransferAlt className='w-5 h-5 text-gray-500'/>
                                    <span className="ml-3">Bridge</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/stake">
                                <div className={`${currentPath === '/stake' ? "bg-gray-100" : ""} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                                    <FaCoins className='w-5 h-5 text-gray-500'/>
                                    <span className="ml-3">Stake</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/lend">
                                <div className={`${currentPath === '/lend' || asPath.includes("/lend") ? "bg-gray-100" : ""} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                                    <BsBank2 className='w-5 h-5 text-gray-500'/>
                                    <span className="ml-3">Lend</span>
                                </div>
                            </Link>
                        </li>
                        {/* <li>
                            <Link href="/buy">
                                <div className={`${currentPath === '/buy' || asPath.includes("/buy") ? "bg-gray-100" : ""} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                                    <RiTokenSwapFill className='w-5 h-5 text-gray-500'/>
                                    <span className="ml-3">Buy</span>
                                </div>
                            </Link>
                        </li> */}
                        <li>
                            <Link href="/dataNetwork">
                                <div className={`${currentPath === '/dataNetwork' ? "bg-gray-100" : ""} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                                    <AiFillDatabase className='w-5 h-5 text-gray-500'/>
                                    <span className="ml-3">Data Network</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dataAnalytics">
                                <div className={`${currentPath === '/dataAnalytics' ? "bg-gray-100" : ""} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                                    <MdOutlineQueryStats className='w-5 h-5 text-gray-500'/>
                                    <span className="ml-3">Data Analytics</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/governance">
                                <div className={`${currentPath === '/governance' ? "bg-gray-100" : ""} flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}>
                                    <MdHowToVote className='w-5 h-5 text-gray-500'/>
                                    <span className="ml-3">Governance</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                    <ul className="space-y-2 font-medium pt-2 border-t border-gray-200 dark:border-gray-700 text-sm mt-2">
                        <li>
                            
                            <div className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}
                                onClick={()=>{window.open("https://docs.wagon.network/", '_docs');}}
                            >
                                <FaBook className='w-5 h-5 text-gray-500'/>
                                <span className="ml-3">Docs</span>
                            </div>
                            
                            <div className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer`}
                                onClick={()=>{window.open("https://wagon.network/faq/", '_faq');}}
                            >
                                <FaQuestionCircle className='w-5 h-5 text-gray-500'/>
                                <span className="ml-3">FAQ</span>
                            </div>
                        </li>
                    </ul>
                    <div id="dropdown-cta" className="p-4 mt-2 rounded-lg bg-yellow-50 dark:bg-blue-900" role="alert">
                        <p className="text-xs text-yellow-800 dark:text-blue-400">
                            In certain countries, VPN connection is required to interact with BSC Network and successfully make a transaction. 
                        </p>
                    </div>
                    <div id="dropdown-cta" className="p-4 mt-2 rounded-lg bg-blue-50 dark:bg-blue-900" role="alert">
                        <div className="flex items-center mb-2">
                            <span className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Beta</span>
                        </div>
                        <p className="text-xs text-blue-800 dark:text-blue-400">
                            Expect potential bugs, frequent updates, and features subject to change. User discretion is advised as we refine and enhance the application.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    )
  }