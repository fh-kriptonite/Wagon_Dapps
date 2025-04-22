import React, { useState, useEffect } from 'react';
import { BsBank2 } from 'react-icons/bs';
import { MdHowToVote, MdOutlineQueryStats, MdDashboard } from 'react-icons/md';
import { BiTransferAlt } from "react-icons/bi";
import { FaCoins, FaBook, FaQuestionCircle } from 'react-icons/fa';
import { AiFillDatabase } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
import { ConnectButton, useDisconnect } from '@particle-network/connectkit';
import { Dropdown } from 'flowbite-react';
import { shortenAddress } from '@/util/stringUtility';
import { useAccount } from '@particle-network/connectkit';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            THEME_SKIN: string;
        }
    }
}

interface SidebarProps {
    // Add any props here if needed
}

export default function Sidebar(props: SidebarProps) {
    const router = useRouter();
    const { asPath } = router;
    const currentPath = router.pathname;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [connectionComponent, setConnectionComponent] = useState<React.ReactNode>(<ConnectButton label="Login"/>);

    const { disconnect } = useDisconnect();
    const { isConnected } = useAccount();
    const { connectedAddress, userInfo } = useConnectedAddress();

    async function disconnectWallet() {
        try {
            await disconnect();
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    }

    useEffect(() => {
        const updateConnectionStatus = async () => {
            if (!isConnected) {
                setConnectionComponent(<ConnectButton label="Login"/>);
                return;
            }

            if (userInfo) {
                setConnectionComponent(<ConnectButton label="Login"/>);
                return;
            }

            setConnectionComponent(
                <Dropdown
                    label={shortenAddress(connectedAddress || '', 6)}
                    color="dark"
                    size="lg"
                >
                    <Dropdown.Item onClick={disconnectWallet}>
                        Disconnect
                    </Dropdown.Item>
                </Dropdown>
            );
        };
        updateConnectionStatus();
    }, [isConnected, userInfo, connectedAddress]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const NavItem = ({ href, icon: Icon, label, isActive }: { href: string, icon: any, label: string, isActive: boolean }) => (
        <Link href={href}>
            <div className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-50"
            }`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                <span className="ml-3 font-medium">{label}</span>
            </div>
        </Link>
    );

    return (
        <>
            {/* Mobile Header */}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button 
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg hover:bg-gray-50 md:hidden"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            
                            <Link href='/' className="ml-3">
                                {Number(process.env.THEME_SKIN) === 2 ? (
                                    <>
                                        <img src="/logo-title-waresix.png" className="h-6 hidden md:block" alt="Logo" />
                                        <img src="/logo-waresix-square.png" className="h-8 md:hidden" alt="Logo" />
                                    </>
                                ) : (
                                    <>
                                        <img src="/logo-title.png" className="h-8 hidden md:block" alt="Logo" />
                                        <img src="/logo_pad.png" className="h-8 md:hidden" alt="Logo" />
                                    </>
                                )}
                            </Link>
                        </div>
                        <div className="flex items-center">
                            {connectionComponent}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform duration-300 ease-in-out bg-white border-r border-gray-100
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0`}
            >    
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        {/* Main Navigation */}
                        <div className="space-y-1">
                            <NavItem 
                                href="/" 
                                icon={MdDashboard} 
                                label="Account" 
                                isActive={currentPath === '/'} 
                            />
                            <NavItem 
                                href="/account/profile" 
                                icon={CgProfile} 
                                label="Profile" 
                                isActive={currentPath === '/account/profile'} 
                            />
                        </div>

                        {/* Features Section */}
                        <div className="mt-8">
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Features
                            </h3>
                            <div className="mt-3 space-y-1">
                                {Number(process.env.THEME_SKIN) === 1 && (
                                    <>
                                        <NavItem 
                                            href="/bridge" 
                                            icon={BiTransferAlt} 
                                            label="Bridge" 
                                            isActive={currentPath === '/bridge'} 
                                        />
                                        <NavItem 
                                            href="/stake" 
                                            icon={FaCoins} 
                                            label="Stake" 
                                            isActive={currentPath === '/stake'} 
                                        />
                                    </>
                                )}
                                <NavItem 
                                    href="/lend" 
                                    icon={BsBank2} 
                                    label="Lend" 
                                    isActive={currentPath === '/lend' || asPath.includes("/lend")} 
                                />
                                {Number(process.env.THEME_SKIN) === 1 && (
                                    <>
                                        <NavItem 
                                            href="/dataNetwork" 
                                            icon={AiFillDatabase} 
                                            label="Data Network" 
                                            isActive={currentPath === '/dataNetwork'} 
                                        />
                                        <NavItem 
                                            href="/dataAnalytics" 
                                            icon={MdOutlineQueryStats} 
                                            label="Data Analytics" 
                                            isActive={currentPath === '/dataAnalytics'} 
                                        />
                                        <NavItem 
                                            href="/governance" 
                                            icon={MdHowToVote} 
                                            label="Governance" 
                                            isActive={currentPath === '/governance'} 
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Resources Section */}
                        {Number(process.env.THEME_SKIN) === 1 && (
                            <div className="mt-8">
                                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Resources
                                </h3>
                                <div className="mt-3 space-y-1">
                                    <div 
                                        className="flex items-center p-3 text-gray-600 rounded-xl hover:bg-gray-50 cursor-pointer"
                                        onClick={() => window.open("https://docs.wagon.network/", '_docs')}
                                    >
                                        <FaBook className="w-5 h-5 text-gray-500" />
                                        <span className="ml-3 font-medium">Docs</span>
                                    </div>
                                    <div 
                                        className="flex items-center p-3 text-gray-600 rounded-xl hover:bg-gray-50 cursor-pointer"
                                        onClick={() => window.open("https://wagon.network/faq/", '_faq')}
                                    >
                                        <FaQuestionCircle className="w-5 h-5 text-gray-500" />
                                        <span className="ml-3 font-medium">FAQ</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Alerts Section */}
                    <div className="p-4 space-y-3 border-t border-gray-100">
                        <div className="p-3 rounded-xl bg-yellow-50">
                            <p className="text-xs text-yellow-800">
                                In certain countries, VPN connection is required to interact with BSC Network and successfully make a transaction.
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50">
                            <div className="flex items-center mb-1">
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                                    Beta
                                </span>
                            </div>
                            <p className="text-xs text-blue-800">
                                Expect potential bugs, frequent updates, and features subject to change. User discretion is advised.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
} 