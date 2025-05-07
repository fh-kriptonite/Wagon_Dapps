import { Avatar, Spinner } from "flowbite-react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaLongArrowAltDown } from "react-icons/fa";
import { services } from "../../services/service_lending";
import { useEffect, useState } from "react";
import PoolCard from "../lend/PoolCard";
import { getAPYService, getRewardBalance, getStakingBalance, getUserTotalRewardClaimedService } from "../../services/service_staking";
import { numberWithCommas } from "../../util/stringUtility";
import { getCoinPriceService, getErc20BalanceService } from "../../services/service_erc20"
import Link from "next/link";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { HiArrowRight } from "react-icons/hi2";
import { HiLockClosed } from "react-icons/hi2";
import { HiShieldCheck } from "react-icons/hi2";
import { HiBanknotes } from "react-icons/hi2";
import { HiCurrencyDollar } from "react-icons/hi2";
import { HiArrowUpTray } from "react-icons/hi2";
import { HiArrowDownTray } from "react-icons/hi2";
import { UserPool } from "../lend/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        cutout: number;
    }[];
}

interface ChartOptions {
    plugins: {
        legend: {
            display: boolean;
        }
    };
    aspectRatio: number;
    maintainAspectRatio: boolean;
}

export default function AccountComponent() {
   
    const { connectedAddress: address } = useConnectedAddress();

    const [userPools, setUserPools] = useState<UserPool[]>([]);
    const [wagPrice, setWagPrice] = useState<number>(0);

    const [tvlIdr, setTvlIdr] = useState<number>(0);

    const [apy, setApy] = useState<number>(0)

    async function getCoinPrice(coinName: string): Promise<void> {
        try {
            const coinPriceData = await getCoinPriceService(coinName)
            if(coinName === "WAG") {
                setWagPrice(coinPriceData.data.usd_price)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getAPY(): Promise<void> {
        if(!address) return;
        const data = await getAPYService(address);
        setApy(data)
    }

    useEffect(()=>{
        if(process.env.THEME_SKIN === "1") {
            getAPY();
            getCoinPrice("WAG");
        }
    }, [])

    const [stakingBalance, setStakingBalance] = useState<number>(0)
    const [rewardBalance, setRewardBalance] = useState<number>(0)
    const [totalRewardClaimed, setTotalRewardClaimed] = useState<number>(0)

    async function getStaking(): Promise<void> {
        if(!address) return;
        const balance = await getStakingBalance(address);
        setStakingBalance(Number(balance) / 1e18);
    }

    async function getRewards(): Promise<void> {
        if(!address) return;
        const balance = await getRewardBalance(address);
        setRewardBalance(Number(balance) / 1e18);
    }

    async function getStakingUserTotalRewardClaimed(): Promise<void> {
        if(!address) return;
        const totalRewardClaimedData = await getUserTotalRewardClaimedService(address);
        setTotalRewardClaimed(parseFloat(totalRewardClaimedData.toString()) / 1e18);
    }

    const [isLoadingPools, setIsLoadingPools] = useState<boolean>(false);
    async function getUserPools(): Promise<void> {
        if(!address) return;
        setIsLoadingPools(true)
        try {
            const data = await services.getUserPools(address) as unknown as UserPool[];
            setUserPools(data || [])
            setIsLoadingPools(false)
        } catch (error) {
            console.log(error)
            setIsLoadingPools(false)
        }
    }

    useEffect(()=>{
        if(address) {
            getStaking();
            getRewards();
            getStakingUserTotalRewardClaimed();
            getUserPools();
            getUserBalances();
        }
    }, [address])

    const data: ChartData = {
        labels: ['Staked', 'Rewards'],
        datasets: [
          {
            label: 'WAG Balance',
            data: [stakingBalance, rewardBalance],
            backgroundColor: [
                '#3b82f6',
                '#34d399'
            ],
            borderColor: [
                '#3b82f6',
                '#34d399'
            ],
            cutout: 55
          },
        ],
    };

    const dataLending: ChartData = {
        labels: ['IDR TVL', 'IDR Interest'],
        datasets: [
          {
            label: 'IDR',
            data: [tvlIdr],
            backgroundColor: [
                '#fb7185',
                '#34d399',
            ],
            borderColor: [
                '#fb7185',
                '#34d399',
            ],
            cutout: 55
          },
        ],
    };

    const options: ChartOptions = {
        plugins: {
          legend: {
            display: false,
          }
        },
        aspectRatio: 1,
        maintainAspectRatio: true,
    };

    async function getUserTvl(): Promise<void> {
        try {
            const tvlBalances = await services.getUserTvlBalances(userPools);
            setTvlIdr(tvlBalances.tvlIdr)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getUserTvl();
    }, [userPools])

    const [idrxBscBalance, setIdrxBscBalance] = useState<number>(0)
    const [idrxBaseBalance, setIdrxBaseBalance] = useState<number>(0)

    async function getUserBalances(): Promise<void> {
        const idrxBscBalance = await getErc20BalanceService(Number(process.env.BNB_CHAIN_ID), address as string, process.env.IDRX_ADDRESS_BSC as string);
        const idrxBaseBalance = await getErc20BalanceService(Number(process.env.BASE_CHAIN_ID), address as string, process.env.IDRX_ADDRESS_BASE as string);
        setIdrxBscBalance(idrxBscBalance)
        setIdrxBaseBalance(idrxBaseBalance)
    }

    function userBalances(): string {
        return numberWithCommas(idrxBscBalance + idrxBaseBalance, 2)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-4 pb-4">
            {/* Header Section */}
            <div className="flex-1">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <HiShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold">Account Overview</h2>
                                <p className="text-blue-100 mt-2 text-sm md:text-base">
                                    View your staking and lending portfolio
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                process.env.THEME_SKIN === "1" &&
                <>
                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Staking Card */}
                        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <HiArrowTrendingUp className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Staking</h3>
                                    <p className="text-xs text-gray-600">Earn rewards by staking WAG</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Stake WAG tokens</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Earn daily rewards</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Flexible staking options</span>
                                </div>
                            </div>
                            <Link href="/stake">
                                <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                                    Start Staking
                                    <HiArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                        {/* Lending Card */}
                        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <HiBanknotes className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Lending</h3>
                                    <p className="text-xs text-gray-600">Lend assets and earn interest</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Lend stablecoins</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Earn stable interest</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Backed by real assets</span>
                                </div>
                            </div>
                            <Link href="/lend">
                                <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                                    Start Lending
                                    <HiArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                        {/* Buy WAG Card */}
                        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <HiCurrencyDollar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Buy WAG</h3>
                                    <p className="text-xs text-gray-600">Purchase WAG tokens</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Available on multiple DEXs</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Cross-chain support</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span>Best liquidity options</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a href="https://app.uniswap.org/swap?&inputCurrency=ETH&outputCurrency=0xd50c8a17d5c4b8e2d984933C7E37e5B92d687B8D" target="_blank" className="flex-1">
                                    <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                                        <img src={"./network/logo-eth.png"} className="h-4 w-4" alt="ETH Logo"/>
                                        Uniswap
                                    </button>
                                </a>
                                <a href="https://pancakeswap.finance/swap?outputCurrency=0xd50c8a17d5c4b8e2d984933C7E37e5B92d687B8D" target="_blank" className="flex-1">
                                    <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                                        <img src={"./network/logo-bnb.png"} className="h-4 w-4" alt="BNB Logo"/>
                                        PancakeSwap
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            }
            <div className="bg-white rounded-xl shadow-sm p-6 w-full flex flex-col xl:flex-row gap-4">
                <div className={`w-full ${ process.env.THEME_SKIN == "1" ? "xl:w-1/4" : "xl:w-2/5"}`}>
                    <div className="flex flex-col justify-between h-full gap-4">
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-base font-semibold">Available Balance IDR</p>
                            <p className="text-4xl font-semibold mt-1">{userBalances()}</p>
                            <div className="flex flex-col justify-between mt-4 gap-2">
                                {
                                    idrxBscBalance > 0 &&
                                    <div className="flex-1 flex justify-between gap-4">
                                        <div className="flex gap-1 items-center">
                                            <div className="bg-gray-200 rounded-full p-1">
                                                <FaLongArrowAltDown color="green" size={12}/>
                                            </div>
                                            <p className="text-xs text-gray-500">IDRX BSC</p>
                                        </div>
                                        <p className="text-sm">IDR {numberWithCommas(idrxBscBalance, 2)}</p>
                                    </div>
                                }
                                {
                                    idrxBaseBalance > 0 &&
                                    <div className="flex-1 flex justify-between gap-4">
                                        <div className="flex gap-1 items-center">
                                        <div className="bg-gray-200 rounded-full p-1">
                                            <FaLongArrowAltDown color="green" size={12}/>
                                        </div>
                                        <p className="text-xs text-gray-500">IDRX BASE</p>
                                    </div>
                                        <p className="text-sm">IDR {numberWithCommas(idrxBaseBalance, 2)}</p>
                                    </div>
                                }
                            </div>
                        </div>
                        
                        {/* Onramp/Offramp Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/account/profile?tab=onramp" className="w-full">
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <HiArrowDownTray className="w-4 h-4" />
                                    <span className="text-sm font-medium">Deposit IDR</span>
                                </button>
                            </Link>
                            <Link href="/account/profile?tab=offramp" className="w-full">
                                <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <HiArrowUpTray className="w-4 h-4" />
                                    <span className="text-sm font-medium">Cash Out</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                {
                    process.env.THEME_SKIN == "1" &&
                    <>
                        <div className="flex-1">
                            <div className="bg-white rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-2 rounded-lg">
                                            <HiLockClosed className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Staking</h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-xs font-medium text-blue-700">APY {numberWithCommas(apy, 2)}%</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Chart Section */}
                                    <div className="w-40 relative mx-auto">
                                        {
                                            (stakingBalance > 0 || rewardBalance > 0)
                                            ? <div className="z-40 relative">
                                                <Doughnut data={data} options={options} key={"doughnut-1"}/>  
                                            </div>
                                            : <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                                                <p className="text-sm text-gray-400">No staking data</p>
                                            </div>
                                        }
                                    </div>

                                    {/* Details Section */}
                                    <div className="flex-1 space-y-4">
                                        {/* Staked Amount */}
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-xs font-medium text-gray-500">Staked Amount</p>
                                                <p className="text-xs text-gray-500">USD {numberWithCommas(stakingBalance * wagPrice, 2)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar img="/logo.png" rounded bordered size="xs" />
                                                    <span className="text-sm font-medium text-gray-900">WAG</span>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">{numberWithCommas(stakingBalance, 2)}</p>
                                            </div>
                                        </div>

                                        {/* Rewards */}
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-xs font-medium text-gray-500">Rewards</p>
                                                <p className="text-xs text-gray-500">USD {numberWithCommas(rewardBalance * wagPrice, 2)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar img="/logo.png" rounded bordered size="xs" />
                                                    <span className="text-sm font-medium">WAG</span>
                                                </div>
                                                <p className="text-lg font-semibold">{numberWithCommas(rewardBalance, 2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
                <div className="flex-1">
                    <div className="bg-white rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <HiBanknotes className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">Lending</h3>
                            </div>
                            {/* <div className="flex items-center gap-1.5 bg-green-100 px-2 py-1 rounded-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className="text-xs font-medium text-green-700">APY {numberWithCommas(tvlIdr == 0 ? 0 : interestIdrInYear / tvlIdr, 2)}%</span>
                            </div> */}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Chart Section */}
                            <div className="w-40 relative mx-auto">
                                {
                                    (tvlIdr)
                                    ? <div className="z-40 relative">
                                        <Doughnut data={dataLending} options={options} key={"doughnut-2"}/>
                                    </div>
                                    : <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                                        <p className="text-sm text-gray-400">No lending data</p>
                                    </div>
                                }
                            </div>

                            {/* Details Section */}
                            <div className="flex-1 space-y-4">
                                {/* Number of Pools invested*/}
                                <div className="bg-green-50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs font-medium text-gray-500">Total Pools Invested</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar.Group>
                                                    <Avatar img="/logo-idrt.png" rounded stacked size="xs" />
                                                    <Avatar img="/logo-idrx.png" rounded stacked size="xs" />
                                                </Avatar.Group>
                                                <span className="text-sm font-medium">Pools</span>
                                            </div>
                                            <p className="text-lg font-semibold">{userPools.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* TVL Section */}
                                <div className="bg-green-50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs font-medium text-gray-500">Total Value Locked</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar.Group>
                                                    <Avatar img="/logo-idrt.png" rounded stacked size="xs" />
                                                    <Avatar img="/logo-idrx.png" rounded stacked size="xs" />
                                                </Avatar.Group>
                                                <span className="text-sm font-medium">IDR</span>
                                            </div>
                                            <p className="text-lg font-semibold">{numberWithCommas(tvlIdr, 2)}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <HiBanknotes className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Your Pools</h3>
                        </div>
                    </div>
                    {
                        isLoadingPools
                        ? <div className="flex justify-center py-8">
                            <Spinner size="lg" color="blue" />
                        </div>
                        : userPools.length == 0
                        ? <div className="flex flex-col items-center justify-center gap-4 py-8">
                            <div className="bg-blue-50 p-4 rounded-full">
                                <FaLongArrowAltDown className="text-2xl text-blue-600" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">No pools found</p>
                                <p className="text-xs text-gray-500 mt-1">Start by lending to your first pool</p>
                            </div>
                        </div>
                        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {
                                userPools.map((userPool) => (
                                    <div key={userPool.id}>
                                        <PoolCard poolId={userPool.pool.pool_id} pool={userPool.pool}/>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}