import { BiTransferAlt } from "react-icons/bi"
import BridgeNetworkCard from "./BridgeNetworkCard"
import { useEffect, useState } from "react"
import { Button } from "flowbite-react";
import { getDestinationGasFeeService } from "../../services/service_bridge.js"
import { useAccount, useNetwork, useSwitchNetwork, useClient, useContractWrite, useWaitForTransaction } from "wagmi";
import { tokenToUsd, allowanceErc20Service } from "../../services/service_erc20.js"
import { numberWithCommas } from "../../util/stringUtility.js";
import SwitchNetworkDialog from "./dialog/SwitchNetworkDialog.js";
import AllowanceDialog from "./dialog/allowanceDialog.js";
import BRIDGE_ABI from "../../public/ABI/bridge.json";
import ERC20_ABI from "../../public/ABI/erc20.json";
import ApproveDialog from "./dialog/ApproveDialog.js";
import BridgeDialog from "./dialog/BridgeDialog.js";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";

export default function BridgeCard(props) {

    const { address } = useAccount();
    
    const { chain } = useNetwork();
    const { provider } = useClient();
    const { chains, error, isLoading : isLoadingSwitching, pendingChainId, switchNetwork } = useSwitchNetwork({
        onSuccess(data) {
            setIsOpenLoadingSwitchNetwork(false)
            checkAllowance(data);
        },
        onError(data) {
            setIsOpenLoadingSwitchNetwork(false)
        }
    })

    const [number, setNumber] = useState(null);
    const [network1, setNetwork1] = useState(null);
    const [network2, setNetwork2] = useState(null);
    const [destinationGas, setDestinationGas] = useState(null);
    const [destinationGasUSD, setDestinationGasUSD] = useState(null);
    const [isLoadingGas, setIsLoadingGas] = useState(false);

    const [isOpenLoadingSwitchNetwork, setIsOpenLoadingSwitchNetwork] = useState(false);
    const [isOpenLoadingAllowance, setIsOpenLoadingAllowance] = useState(false);

    async function getGasOnDestination() {
        try {
            setIsLoadingGas(true)
            const gas = await getDestinationGasFeeService(
                network2.lzEndpointId, 
                network1.OFTAddress, 
                address, 
                network1.rpc, 
                network1.chainId, 
                number
            )
            setDestinationGas(gas);
            const gasInUsd = await tokenToUsd(gas, network1.priceUrl, network1.chainId)
            setDestinationGasUSD(gasInUsd);
            setIsLoadingGas(false)
        } catch (error) {
            console.log(error);
            setIsLoadingGas(false)
        }
    }

    useEffect(()=>{
        if(network1 != null && network2 != null && number != null) {
            getGasOnDestination();
        }
    }, [network1, network2, number])

    async function transferBridge() {
        try {
            // check if the network is correct
            if(chain.id != network1.chainId) {
                setIsOpenLoadingSwitchNetwork(true);
                switchNetwork?.(network1.chainId)
            }
            else {
                checkAllowance(null);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function checkAllowance(data) {
        setIsOpenLoadingAllowance(true);
        let currentChain = chain;
        if(data != null) currentChain = data;
        // check if the network is the main chain
        if(currentChain.id == process.env.BRIDGE_LOCAL_CHAIN_ID) {
            try {
                const allowance = await allowanceErc20Service(network1.wagAddress, address, network1.OFTAddress, network1.rpc, network1.chainId)
                if(allowance < parseFloat(number)) {
                    // call approve
                    approve();
                    setIsOpenLoadingAllowance(false);
                } else {
                    // call transfer
                    bridgeTransfer();
                    setIsOpenLoadingAllowance(false);
                }
            } catch (error) {
                console.log(error);
                setIsOpenLoadingAllowance(false);
            }
        } else {
            // call transfer
            bridgeTransfer();
            setIsOpenLoadingAllowance(false);
        }
    }

    const { data: dataApprove, isLoading: isLoadingApprove, write } = useContractWrite({
        address: "0xd50c8a17d5c4b8e2d984933C7E37e5B92d687B8D",
        abi: ERC20_ABI,
        functionName: 'approve',
        args:[
                network1?.OFTAddress, 
                (number == null) 
                    ? (number)
                    : (number * Math.pow(10,18)).toString()
            ]
    })

    const {isLoading : isLoadingWaitApprove} 
    = useWaitForTransaction({
      hash: dataApprove?.hash,
      onSuccess(data) {
        bridgeTransfer();
      }
    })

    async function approve() {
        write()
    }

    // SEPOLIA BRIDGE TRANSFER
    const { data: dataBridgeSepolia, isLoading: isLoadingBridgeSepolia, write : writeBridgeSepolia } = useContractWrite({
        address: "0x2a0304bb9Dd8F50ec04c483ddAA8d586EAe0A2ff",
        abi: BRIDGE_ABI,
        functionName: 'sendFrom',
        args: [
            address,
            network2?.lzEndpointId,
            ethers.utils.defaultAbiCoder.encode(["address"], [address]),
            parseEther(`${number == null ? 0 : number}`).toString(),
            parseEther(`${number == null ? 0 : number}`).toString(),
            [
                address, 
                "0x0000000000000000000000000000000000000000", 
                ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000])
            ],
        ],
        overrides:{
            value: (destinationGas == null ? parseEther("0") : parseEther(destinationGas.toString()))
        }
    })

    const {isLoading : isLoadingWaitBridgeSepolia} 
    = useWaitForTransaction({
      hash: dataBridgeSepolia?.hash,
      onSuccess(data) {
        
      }
    })


    // BNB TESTNET BRIDGE TRANSFER
    const { data: dataBridgeBnbTestnet, isLoading: isLoadingBridgeBnbTestnet, write : writeBridgeBnbTestnet } = useContractWrite({
        address: "0x995910F3727c94068436d22291098B8AeC1CBa78",
        abi: BRIDGE_ABI,
        functionName: 'sendFrom',
        args: [
            address,
            network2?.lzEndpointId,
            ethers.utils.defaultAbiCoder.encode(["address"], [address]),
            parseEther(`${number == null ? 0 : number}`).toString(),
            parseEther(`${number == null ? 0 : number}`).toString(),
            [
                address, 
                "0x0000000000000000000000000000000000000000", 
                ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000])
            ],
        ],
        overrides:{
            value: (destinationGas == null ? parseEther("0") : parseEther(destinationGas.toString()))
        }
    })

    const {isLoading : isLoadingWaitBridgeBnbTestnet} 
    = useWaitForTransaction({
      hash: dataBridgeBnbTestnet?.hash,
      onSuccess(data) {
        
      }
    })

    // BNB MAINNET BRIDGE TRANSFER
    const { data: dataBridgeBnbMainnet, isLoading: isLoadingBridgeBnbMainnet, write : writeBridgeBnbMainnet } = useContractWrite({
        address: "0xd50c8a17d5c4b8e2d984933C7E37e5B92d687B8D",
        abi: BRIDGE_ABI,
        functionName: 'sendFrom',
        args: [
            address,
            network2?.lzEndpointId,
            ethers.utils.defaultAbiCoder.encode(["address"], [address]),
            parseEther(`${number == null ? 0 : number}`).toString(),
            parseEther(`${number == null ? 0 : number}`).toString(),
            [
                address, 
                "0x0000000000000000000000000000000000000000", 
                ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000])
            ],
        ],
        overrides:{
            value: (destinationGas == null ? parseEther("0") : parseEther(destinationGas.toString()))
        }
    })

    const {isLoading : isLoadingWaitBridgeBnbMainnet} 
    = useWaitForTransaction({
      hash: dataBridgeBnbMainnet?.hash,
      onSuccess(data) {
        
      }
    })

    // ETH MAINNET BRIDGE TRANSFER
    const { data: dataBridgeEthMainnet, isLoading: isLoadingBridgeEthMainnet, write : writeBridgeEthMainnet } = useContractWrite({
        address: "0x282640F02822f017D76c824da2a73d2e121d0A5F",
        abi: BRIDGE_ABI,
        functionName: 'sendFrom',
        args: [
            address,
            network2?.lzEndpointId,
            ethers.utils.defaultAbiCoder.encode(["address"], [address]),
            parseEther(`${number == null ? 0 : number}`).toString(),
            parseEther(`${number == null ? 0 : number}`).toString(),
            [
                address, 
                "0x0000000000000000000000000000000000000000", 
                ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000])
            ],
        ],
        overrides:{
            value: (destinationGas == null ? parseEther("0") : parseEther(destinationGas.toString()))
        }
    })

    const {isLoading : isLoadingWaitBridgeEthMainnet} 
    = useWaitForTransaction({
      hash: dataBridgeEthMainnet?.hash,
      onSuccess(data) {
        
      }
    })

    function bridgeTransfer() {
        if(chain.id == 1) {
            writeBridgeEthMainnet();
        } else if (chain.id == 56) {
            writeBridgeBnbMainnet();
        } else if(chain.id == 11155111) {
            writeBridgeSepolia();
        } else if (chain.id == 97) {
            writeBridgeBnbTestnet();
        } else {
            console.log(error)
        }
    }

    return (
        <>
            <div className="card max-w-md mx-auto">

                <p className="text-sm font-bold">Bridge</p>

                <BridgeNetworkCard number={number} setNumber={(number)=>{setNumber(number)}} otherNetwork={network2} network={network1} setNetwork={(network)=>{setNetwork1(network)}} primary={true}/>

                <div className="my-6">
                    <BiTransferAlt style = {{transform: 'rotate(90deg)' }} 
                        className='w-6 h-6 text-gray-500 mx-auto hover:cursor-pointer'
                        onClick={()=>{
                            const tempNetwork = network1;
                            setNetwork1(network2)
                            setNetwork2(tempNetwork)
                        }}
                    />
                </div>

                <BridgeNetworkCard number={number} setNumber={(number)=>{setNumber(number)}} otherNetwork={network1} network={network2} setNetwork={(network)=>{setNetwork2(network)}} primary={false}/>

                <div className="space-y-2 px-4 my-6">
                    <div className="flex justify-between">
                        <p className="text-xs">Gas on destination</p>
                        <p className="text-xs font-semibold">{destinationGasUSD == null || isLoadingGas ? "--" : numberWithCommas(destinationGasUSD, 2)} USD</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xs">You will receive</p>
                        <p className="text-xs font-semibold">{number == null ? "--" : number} WAG</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xs">Fee</p>
                        <p className="text-xs font-semibold">--</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xs">Slippage tolerance</p>
                        <p className="text-xs font-semibold">0.50%</p>
                    </div>
                </div>

                <div className="mt-4 w-full">
                    {
                        <Button color="dark" style={{width:"100%"}}
                            disabled={isLoadingSwitching || number == null || network1 == null || network2 == null}
                            onClick={()=>{
                                transferBridge();
                            }}
                        >
                            {
                                isLoadingSwitching
                                ? "Loading..."
                                : "TRANSFER"
                            }
                        </Button>
                    }
                </div>

            </div>

            <div className="flex gap-1 justify-center items-center mt-2">
                <p className="text-xs">Powered By</p>
                <img src="/network/logo-layerzero.png" className="h-12" alt="LayerZero Logo"/>
            </div>


            <SwitchNetworkDialog 
                number={number} network1={network1} network2={network2} isOpen={isOpenLoadingSwitchNetwork}/>

            <AllowanceDialog 
                number={number} network1={network1} network2={network2} isOpen={isOpenLoadingAllowance}/>

            <ApproveDialog 
                number={number} network1={network1} network2={network2} isOpen={isLoadingApprove || isLoadingWaitApprove}/>

            <BridgeDialog 
                number={number} network1={network1} network2={network2} isOpen={
                    isLoadingBridgeSepolia || 
                    isLoadingBridgeBnbTestnet || 
                    isLoadingWaitBridgeSepolia || 
                    isLoadingWaitBridgeBnbTestnet ||
                    isLoadingBridgeEthMainnet || 
                    isLoadingBridgeBnbMainnet || 
                    isLoadingWaitBridgeEthMainnet ||
                    isLoadingWaitBridgeBnbMainnet
                }/>
        </>
        
    )
  }