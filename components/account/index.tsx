import { Avatar, Button, Spinner } from "flowbite-react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaLongArrowAltDown } from "react-icons/fa";
import { services } from "../../services/service_lending";
import { useEffect, useState } from "react";
import PoolCard from "../lend/PoolCard";
import { getAPYService, getRewardBalance, getStakingBalance, getUserTotalRewardClaimedService } from "../../services/service_staking";
import { numberWithCommas } from "../../util/stringUtility";
import { getCoinPriceService } from "../../services/service_erc20"
import Link from "next/link";
import { useAccount } from "@particle-network/connectkit";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Pool {
    pool_id: string;
    currency: string;
    network: string;
    id?: string;
    status?: string;
    collectionTermEnd?: string;
}

interface UserPoolResponse {
    data: Pool[];
}

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

interface UserBalance {
    tvlWag: number;
    tvlIdrt: number;
    interestIdrt: number;
}

export default function AccountComponent() {
    const address = useAccount();

    const [pools, setPools] = useState<Pool[]>([]);
    const [wagPrice, setWagPrice] = useState<number>(0);
    const [idrtPrice, setIdrtPrice] = useState<number>(0);

    const [tvlWag, setTvlWag] = useState<number>(0);
    const [tvlIdrt, setTvlIdrt] = useState<number>(0);
    const [interestIdrt, setInterestIdrt] = useState<number>(0);
    const [interestIdrtInYear, setInterestIdrtInYear] = useState<number>(0);

    async function getWagPrice(): Promise<void> {
        try {
            const wagPriceData = await getCoinPriceService("WAG")
            setWagPrice(wagPriceData.data[0].usd_price)

            const idrtPriceData = await getCoinPriceService("IDRT")
            setIdrtPrice(idrtPriceData.data[0].usd_price)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(process.env.THEME_SKIN === "1") {
            getAPY();
            getWagPrice();
        }
    }, [])

    const [stakingBalance, setStakingBalance] = useState<number>(0)
    const [rewardBalance, setRewardBalance] = useState<number>(0)
    const [apy, setApy] = useState<number>(0)
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

    async function getAPY(): Promise<void> {
        if(!address) return;
        const data = await getAPYService(address);
        setApy(data)
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
            const response = await services.getUserPools(address) as unknown as UserPoolResponse;
            setPools(response.data || [])
            setIsLoadingPools(false)
        } catch (error) {
            console.log(error)
            setIsLoadingPools(false)
        }
    }

    useEffect(()=>{
        getStaking();
        getRewards();
        getUserPools();
        getStakingUserTotalRewardClaimed();
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
        labels: ['WAG TVL', 'IDR TVL', 'IDR Interest'],
        datasets: [
          {
            label: 'USD',
            data: [tvlWag * wagPrice, tvlIdrt * idrtPrice, interestIdrt * idrtPrice],
            backgroundColor: [
                '#3b82f6',
                '#fb7185',
                '#34d399',
            ],
            borderColor: [
                '#3b82f6',
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

    async function getUserBalances(): Promise<void> {
        try {
            const balances = await services.getUserBalances(pools.map(pool => ({
                ...pool,
                id: pool.pool_id || "0",
                status: "ACTIVE",
                collectionTermEnd: "0"
            })), address!)
            setTvlIdrt(balances.tvlIdrt)
            setTvlWag(balances.tvlWag)
            setInterestIdrt(balances.interestIdrt)
            setInterestIdrtInYear(balances.interestIdrt)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getUserBalances();
    }, [pools])

    return (
        <div className="max-w-7xl mx-auto space-y-4 pb-4">
            {
                process.env.THEME_SKIN === "1" &&
                <>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="card w-full h-full !bg-blue-50">
                                <div className="flex flex-col xl:flex-row justify-between items-center h-full gap-4">
                                    <div className="grow w-full">
                                        <p className="text-lg font-semibold">Wagon Staking <span className="text-xs">on ETH Network</span></p>
                                        <p className="text-sm mt-0.5 text-gray-500"><span className="font-bold">Earn</span> your stable interest now</p>
                                        <p className="text-sm mt-0.5 text-gray-500">Stake your <span className="font-bold">WAG</span> and get your <span className="font-bold">WAG</span> rewards</p>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full xl:w-1/3">
                                        <Link href="/stake">
                                            <Button color={"dark"} size={"xs"} style={{width:"100%"}}>Stake Now</Button>    
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="card w-full h-full !bg-blue-50">
                                <div className="flex flex-col xl:flex-row justify-between items-center h-full gap-4">
                                    <div className="grow w-full">
                                        <p className="text-base font-semibold">Wagon Lending <span className="text-xs"> on BSC Network</span></p>
                                        <p className="text-sm mt-0.5 text-gray-500"><span className="font-bold">Lend</span> your stable coin and <span className="font-bold">earn</span> stable interest</p>
                                        <p className="text-sm mt-0.5 text-gray-500"><span className="font-bold">Stabilize</span> your portfolio with <span className="font-bold">Real World Asset and Businesses</span></p>
                                    </div>
                                    <div className="w-full xl:w-1/3">
                                        <Link href="/lend">
                                            <Button size={"xs"} color="dark" style={{width:"100%"}}>Lend Now</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="card w-full h-full !bg-blue-50">
                                <div className="flex flex-col xl:flex-row justify-between items-center h-full gap-4">
                                    <div className="grow w-full">
                                        <p className="text-lg font-semibold">Buy Wagon Token now</p>
                                        <p className="text-sm mt-0.5 text-gray-500">On ETH network Uniswap <span className="font-bold">WAG/ETH</span></p>
                                        <p className="text-sm mt-0.5 text-gray-500">On BSC network Pancakeswap <span className="font-bold">WAG/USDT</span></p>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full xl:w-1/3">
                                        <a href="https://app.uniswap.org/swap?&inputCurrency=ETH&outputCurrency=0xd50c8a17d5c4b8e2d984933C7E37e5B92d687B8D" target={"uniswap"}>
                                            <Button size={"xs"} color="dark" style={{width:"100%"}}>
                                                <img src={"./network/logo-eth.png"} className="h-5 w-5 mr-2" alt="ETH Logo"/>
                                                Uniswap
                                            </Button>
                                        </a>
                                        <a href="https://pancakeswap.finance/swap?outputCurrency=0xd50c8a17d5c4b8e2d984933C7E37e5B92d687B8D" target={"pancakeswap"}>
                                            <Button size={"xs"} color="dark" style={{width:"100%"}}>
                                                <img src={"./network/logo-bnb.png"} className="h-5 w-5 mr-2" alt="BNB Logo"/>
                                                PancakeSwap
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="card w-full h-full !bg-blue-50">
                                <div className="flex flex-col xl:flex-row justify-between items-center h-full gap-4">
                                    <div className="grow w-full">
                                        <p className="text-base font-semibold">Account Verification</p>
                                        <p className="text-sm mt-0.5 text-gray-500"><span className="font-bold">Verify</span> your account <span className="font-bold">information</span></p>
                                        <p className="text-sm mt-0.5 text-gray-500">Lend your <span className="font-bold">FIAT</span> through our pools.</p>
                                    </div>
                                    <div className="w-full xl:w-1/3">
                                        <Link href="/account/verification">
                                            <Button size={"xs"} color="dark" style={{width:"100%"}}>Verification</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            <div className="card w-full flex flex-col xl:flex-row gap-4">
                <div className={`w-full ${ process.env.THEME_SKIN == "1" ? "xl:w-1/4" : "xl:w-2/5"}`}>
                    <div className="flex flex-col justify-between h-full gap-4">
                        <p className="text-base font-semibold">Balance</p>
                        <p className="text-4xl font-semibold mt-1">USD {numberWithCommas((stakingBalance * wagPrice) + (tvlWag * wagPrice) + (tvlIdrt * idrtPrice), 2)}</p>
                        <div className="flex justify-between">
                            <div className="flex-1">
                                <div className="flex gap-1 items-center">
                                    <div className="bg-gray-200 rounded-full p-1">
                                        <FaLongArrowAltDown color="green" size={12}/>
                                    </div>
                                    <p className="text-xs text-gray-500">Income</p>
                                </div>
                                <p className="text-lg font-semibold">USD {numberWithCommas((totalRewardClaimed * wagPrice) + (rewardBalance * wagPrice) + (interestIdrt * idrtPrice), 2)}</p>
                            </div>
                            {/* <div className="flex-1">
                                <div className="flex gap-1 items-center">
                                    <div className="bg-gray-200 rounded-full p-1">
                                        <FaLongArrowAltUp color="red" size={12}/>
                                    </div>
                                    <p className="text-xs text-gray-500">Locked</p>
                                </div>
                                <p className="text-lg font-semibold">USD {numberWithCommas((stakingBalance * wagPrice) + (tvlWag * wagPrice) + (tvlIdrt * idrtPrice), 2)}</p>
                            </div> */}
                        </div>
                    </div>
                </div>
                {
                    process.env.THEME_SKIN == "1" &&
                    <>
                        <div className="border"/>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <p className="text-base font-semibold">Staking</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mt-3">
                                <div className="w-40 relative mx-auto">
                                    <div
                                        className="absolute top-8 left-8"
                                    >
                                        <div className="bg-blue-100 h-24 w-24 flex items-center jutify-center rounded-full border-2 border-dashed border-blue-800">
                                            <div className="w-full">
                                            <p className="text-center text-sm">APY</p>
                                            <p className="text-center text-xl font-semibold">{numberWithCommas(apy, 2)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (stakingBalance > 0 || rewardBalance > 0)
                                        ? <div className="z-40 relative">
                                            <Doughnut data={data} options={options} key={"doughnut-1"}/>  
                                        </div>
                                        : <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
                                    }
                                </div>
                                <div className="grow">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-gray-500">Staked</p>
                                        <p className="text-end text-gray-500 text-xs">USD {numberWithCommas(stakingBalance * wagPrice, 2)}</p>
                                    </div>
                                    <div className="flex flex-wrap justify-between mt-1">
                                        <div className="flex flex-wrap gap-2">
                                            <Avatar img="/logo.png" rounded bordered size="xs" />
                                            <p className="text-sm">WAG</p>
                                        </div>
                                        <p className="text-sm font-semibold">{numberWithCommas(stakingBalance, 2)}</p>
                                    </div>
                                    
                                    <div className="flex justify-between items-end mt-2">
                                        <p className="text-xs text-gray-500 mt-2">Rewards</p>
                                        <p className="text-end text-gray-500 text-xs">USD {numberWithCommas(rewardBalance * wagPrice, 2)}</p>
                                    </div>
                                    <div className="flex flex-wrap justify-between mt-1">
                                        <div className="flex flex-wrap gap-2">
                                            <Avatar img="/logo.png" rounded bordered size="xs" />
                                            <p className="text-sm">WAG</p>
                                        </div>
                                        <p className="text-sm font-semibold">{numberWithCommas(rewardBalance, 2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
                <div className="border"/>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <p className="text-base font-semibold">Lending</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mt-3">
                        <div className="w-40 relative mx-auto">
                            <div
                                className="absolute top-8 left-8"
                            >
                                <div className="bg-blue-100 h-24 w-24 flex items-center jutify-center rounded-full border-2 border-dashed border-blue-800 overflow-hidden text-ellipsis">
                                    <div className="w-full">
                                    <p className="text-center text-sm">APY</p>
                                    <p className="text-center text-xl font-semibold">{numberWithCommas(tvlIdrt == 0 ? 0 : interestIdrtInYear / tvlIdrt, 2)}%</p>
                                    </div>
                                </div>
                            </div>
                            {
                                (tvlWag > 0 || tvlIdrt || interestIdrt > 0)
                                ? <div className="z-40 relative">
                                    <Doughnut data={dataLending} options={options}  key={"doughnut-2"}/>
                                </div>
                                : <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
                            }
                        </div>
                        <div className="grow">
                            <div className="flex justify-between items-end">
                                <p className="text-xs text-gray-500">TVL</p>
                                <p className="text-end text-gray-500 text-xs">USD {numberWithCommas((tvlWag * wagPrice) + (tvlIdrt * idrtPrice), 2)}</p>
                            </div>
                            {
                                process.env.THEME_SKIN == "1" &&
                                <div className="flex flex-wrap justify-between mt-1">
                                    <div className="flex flex-wrap gap-2">
                                        <Avatar img="/logo.png" rounded bordered size="xs" />
                                        <p className="text-sm">WAG</p>
                                    </div>
                                    <p className="text-sm font-semibold">{numberWithCommas(tvlWag, 2)}</p>
                                </div>
                            }
                            <div className="flex flex-wrap gap-2 justify-between mt-2">
                                <div className="flex flex-wrap gap-2">
                                    <Avatar.Group>
                                        <Avatar img="/logo-idrt.png" rounded stacked size="xs" />
                                        <Avatar img="/logo-idrx.png" rounded stacked size="xs" />
                                    </Avatar.Group>
                                    <p className="text-sm">IDR</p>
                                </div>
                                <p className="text-sm font-semibold">{numberWithCommas(tvlIdrt, 2)}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-xs text-gray-500 mt-2">Interest</p>
                                <p className="text-end text-gray-500 text-xs">USD {numberWithCommas(interestIdrt * idrtPrice, 2)}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-between mt-1">
                                <div className="flex flex-wrap gap-2">
                                    <Avatar.Group>
                                        <Avatar img="/logo-idrt.png" rounded stacked size="xs" />
                                        <Avatar img="/logo-idrx.png" rounded stacked size="xs" />
                                    </Avatar.Group>
                                    <p className="text-sm">IDR</p>
                                </div>
                                <p className="text-sm font-semibold">{numberWithCommas(interestIdrt, 2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card w-full">
                <div className="flex flex-col gap-4">
                    <p className="text-base font-semibold">Your Pools</p>
                    {
                        isLoadingPools
                        ? <div className="flex justify-center">
                            <Spinner/>
                        </div>
                        : pools.length == 0
                        ? <div className="flex flex-col items-center justify-center gap-2">
                            <FaLongArrowAltDown className="text-4xl text-gray-400"/>
                            <p className="text-sm text-gray-500">No pools found</p>
                        </div>
                        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {
                                pools.map((pool) => (
                                    <PoolCard key={pool.pool_id} poolId={pool.pool_id}/>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
} 