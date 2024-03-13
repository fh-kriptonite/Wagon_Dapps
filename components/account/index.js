import { useAccount } from "wagmi"
import { Button, Dropdown, Spinner } from "flowbite-react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaLongArrowAltDown } from "react-icons/fa";
import { getUserBalancesService, getUserPoolsService } from "../../services/service_lending";
import { useEffect, useState } from "react";
import PoolCard from "../lend/PoolCard";
import { getAPYService, getRewardalance, getStakingBalance, getUserTotalRewardClaimedService } from "../../services/service_staking";
import { numberWithCommas } from "../../util/stringUtility";
import { getCoinPriceService } from "../../services/service_erc20"
import Link from "next/link";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AccountComponent(props) {
    const { address } = useAccount();
    const [pools, setPools] = useState([]);
    const [wagPrice, setWagPrice] = useState(0);
    const [idrtPrice, setIdrtPrice] = useState(0);

    const [tvlWag, setTvlWag] = useState(0);
    const [tvlIdrt, setTvlIdrt] = useState(0);
    const [interestIdrt, setInterestIdrt] = useState(0);
    const [interestIdrtInYear, setInterestIdrtInYear] = useState(0);

    async function getWagPrice() {
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
        getAPY();
        getWagPrice();
    }, [])

    const [stakingBalance, setStakingBalance] = useState(0)
    const [rewardBalance, setRewardBalance] = useState(0)
    const [apy, setApy] = useState(0)
    const [totalRewardClaimed, setTotalRewardClaimed] = useState(0)

    async function getStaking() {
        const balance = await getStakingBalance(address);
        setStakingBalance(balance);
    }

    async function getRewards() {
        const balance = await getRewardalance(address);
        setRewardBalance(balance);
    }

    async function getAPY() {
        const data = await getAPYService();
        setApy(data)
    }

    async function getStakingUserTotalRewardClaimed() {
        const totalRewardClaimedData = await getUserTotalRewardClaimedService(address);
        setTotalRewardClaimed(totalRewardClaimedData);
    }

    const [isLoadingPools, setIsLoadingPools] = useState(false);
    async function getUserPools() {
        setIsLoadingPools(true)
        try {
            const data = await getUserPoolsService(address);
            setPools(data.data)
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

    const data = {
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

    const dataLending = {
        labels: ['WAG TVL', 'IDRT TVL', 'IDRT Interest'],
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

    const options = {
        plugins: {
          legend: {
            display: false, // This line removes the labels
          }
        },
        aspectRatio: 1, // Maintain a 1:1 aspect ratio (square)
        maintainAspectRatio: true, // Maintain aspect ratio when resizing
      };

    async function getUserBalances() {
        try {
            const [idrt, wag, interest, interestInYear] = await getUserBalancesService(pools, address)
            setTvlIdrt(idrt)
            setTvlWag(wag)
            setInterestIdrt(interest)
            setInterestIdrtInYear(interestInYear)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getUserBalances();
    }, [pools])

    return (
        <div className="max-w-7xl mx-auto space-y-4 pb-4">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <div className="card w-full h-full !bg-blue-100">
                        <div className="flex flex-col xl:flex-row justify-between items-center h-full gap-4">
                            <div className="grow">
                                <p className="text-lg font-semibold">Earn your stable interest now!</p>
                                <p className="text-sm mt-0.5 text-gray-500">Buy <span className="font-bold">WAG</span> now and start building your stable portfolio</p>
                            </div>
                            <div className="flex flex-col gap-2 w-full xl:w-1/3">
                                <a href="https://app.uniswap.org/swap?&inputCurrency=ETH&outputCurrency=0xd50c8a17d5c4b8e2d984933C7E37e5B92d687B8D" target={"uniswap"}>
                                    <Button size={"xs"} color="dark" style={{width:"100%"}}>Uniswap</Button>
                                </a>
                                <a href="https://pancakeswap.finance/swap?inputCurrency=0x66207E39bb77e6B99aaB56795C7c340C08520d83&outputCurrency=0xd50c8a17d5c4b8e2d984933C7E37e5B92d687B8D" target={"pancakeswap"}>
                                    <Button size={"xs"} color="dark" style={{width:"100%"}}>PancakeSwap</Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="card w-full h-full">
                        <div className="flex flex-col xl:flex-row justify-between items-center h-full gap-4">
                            <div className="grow w-full">
                                <p className="text-base font-semibold">Bridge</p>
                                <p className="text-sm mt-0.5 text-gray-500">Transfer your <span className="font-bold">WAG</span> across network and start gaining</p>
                            </div>
                            <div className="w-full xl:w-1/3">
                                <Link href="/bridge">
                                    <Button size={"xs"} color="dark" style={{width:"100%"}}>Start Bridge</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card w-full flex flex-col xl:flex-row gap-4">
                <div className="w-full md:w-1/4">
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
                <div className="border"/>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <p className="text-base font-semibold">Staking</p>
                        <Link href="/stake">
                            <Button color={"dark"} size={"xs"}>Stake</Button>    
                        </Link>
                    </div>
                    <div className="flex gap-10 mt-3">
                        <div className="w-40 relative">
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
                            <div className="flex justify-between mt-1 items-center">
                                <div className="flex gap-1 items-center">
                                    <img src="/logo.png" className="h-4" alt="Wagon Logo" />
                                    <p className="text-sm">WAG</p>
                                </div>
                                <p className="text-sm font-semibold">{numberWithCommas(stakingBalance, 2)}</p>
                            </div>
                            
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-xs text-gray-500 mt-2">Rewards</p>
                                <p className="text-end text-gray-500 text-xs">USD {numberWithCommas(rewardBalance * wagPrice, 2)}</p>
                            </div>
                            <div className="flex justify-between mt-1 items-center">
                                <div className="flex gap-1 items-center">
                                    <img src="/logo.png" className="h-4" alt="Wagon Logo" />
                                    <p className="text-sm">WAG</p>
                                </div>
                                <p className="text-sm font-semibold">{numberWithCommas(rewardBalance, 2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border"/>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <p className="text-base font-semibold">Lending</p>
                        <Link href="/lend">
                            <Button color={"dark"} size={"xs"}>Lend</Button>
                        </Link>
                    </div>
                    <div className="flex gap-10 mt-3">
                        <div className="w-40 relative">
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
                            <div className="flex justify-between mt-1 items-center">
                                <div className="flex gap-1 items-center">
                                    <img src="/logo.png" className="h-4" alt="Wagon Logo" />
                                    <p className="text-sm">WAG</p>
                                </div>
                                <p className="text-sm font-semibold">{numberWithCommas(tvlWag, 2)}</p>
                            </div>
                            <div className="flex justify-between mt-2 items-center">
                                <div className="flex gap-1 items-center">
                                    <img src="/logo-idrt.png" className="h-4" alt="IDRT Logo" />
                                    <p className="text-sm">IDRT</p>
                                </div>
                                <p className="text-sm font-semibold">{numberWithCommas(tvlIdrt, 2)}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-xs text-gray-500 mt-2">Interest</p>
                                <p className="text-end text-gray-500 text-xs">USD {numberWithCommas(interestIdrt * idrtPrice, 2)}</p>
                            </div>
                            <div className="flex justify-between mt-1 items-center">
                                <div className="flex gap-1 items-center">
                                    <img src="/logo-idrt.png" className="h-4" alt="IDRT Logo" />
                                    <p className="text-sm">IDRT</p>
                                </div>
                                <p className="text-sm font-semibold">{numberWithCommas(interestIdrt, 2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card w-full ">
                <p className="text-base font-semibold">Lending Portfolio</p>
                {
                    isLoadingPools
                    ? <div className="h-80 flex items-center justify-center">
                        <Spinner/>
                    </div>
                    : pools.length > 0
                        ? <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                            {
                                pools.map((pool, index)=>{
                                    return (
                                    <div key={`poolCard-${index}-${2}`} id={`poolCard-${index}`}>
                                        <PoolCard poolId={pool.pool_id}/>
                                    </div>
                                    )
                                })
                            }
                        </div>
                        : <div className="h-80 flex items-center justify-center">
                            <p className="mt-5 text-sm text-center">No pools</p>
                        </div>
                }
            </div>
        </div>
    )
  }