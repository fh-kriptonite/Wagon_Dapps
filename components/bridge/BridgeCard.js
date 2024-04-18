import { BiTransferAlt } from "react-icons/bi"
import BridgeNetworkCard from "./BridgeNetworkCard"
import { useEffect, useState } from "react"
import { Button } from "flowbite-react";

import { numberWithCommas } from "../../util/stringUtility.js";
import SwitchNetworkDialog from "./dialog/SwitchNetworkDialog.js";
import AllowanceDialog from "./dialog/AllowanceDialog.js";
import ApproveDialog from "./dialog/ApproveDialog.js";
import BridgeDialog from "./dialog/BridgeDialog.js";

import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import useGetDestinationGasHook from "./utils/useGetDestinationGasHook.js";
import useSwitchNetworkHook from "./utils/useSwitchNetworkHook.js";
import useCheckAllowanceHook from "./utils/useCheckAllowanceHook.js";
import useApproveAllowanceHook from "./utils/useApproveAllowanceHook.js";
import useSendBridgeHook from "./utils/useSendBridgeHook.js";

import { Alert } from 'flowbite-react';

export default function BridgeCard(props) {

    const { address, chainId } = useWeb3ModalAccount();
    
    const [number, setNumber] = useState("");
    const [balance, setBalance] = useState(0);
    const [network1, setNetwork1] = useState(null);
    const [network2, setNetwork2] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const { isLoading: isLoadingGas, data: destinationGasUSD, fetchData: getGasOnDestination } = useGetDestinationGasHook();

    useEffect(()=>{
        if(network1 != null && network2 != null) {
            getGasOnDestination(network2, network1, address, 0);
        }
    }, [network1, network2])

    const { isLoading: isLoadingSwitchNetwork, fetchData: switchNetwork } = useSwitchNetworkHook();
    const { isLoading: isLoadingAllowance, fetchData: checkAllowance } = useCheckAllowanceHook();
    const { isLoading: isLoadingApproveAllowance, fetchData: approveAllowance } = useApproveAllowanceHook();
    const { isLoading: isLoadingSendBridge, fetchData: sendBridge } = useSendBridgeHook();

    async function handleNetwork() {
        // checking network
        let currentChainId = chainId;

        if(chainId != network1.chainId) {
            const resultSwitchNetwork = await switchNetwork(network1.chainId);
            if (resultSwitchNetwork.error) {
                throw resultSwitchNetwork.error
            }
            currentChainId = resultSwitchNetwork.data
        }

        return currentChainId;
    }

    async function handleAllowance(currentChainId) {
        // checking allowance
        if(currentChainId == process.env.BRIDGE_LOCAL_CHAIN_ID) {
            const resultAllowance = await checkAllowance(network1, address);
            if (resultAllowance.error) {
                throw resultAllowance.error
            }

            if(parseFloat(resultAllowance.data) < parseFloat(number)) {
                // approving allowance
                const resultApprove = await approveAllowance(network1, number)
                if (resultApprove.error) {
                    throw resultApprove.error
                }
            }
        }
    }

    async function handleTransferBridge() {
        // transfer bridge
        const resultSendBridge = await sendBridge(network1, network2, address, number)
        if (resultSendBridge.error) {
            throw resultSendBridge.error;
        }
        showAlertWithTimeout();
    }

    async function transferBridge() {
        try {
            const currentChainId = await handleNetwork();
            await handleAllowance(currentChainId);
            await handleTransferBridge();
        } catch (error) {
            console.log(error)
        }
    }

    const showAlertWithTimeout = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    return (
        <div className="relative">

            <div className="card max-w-md mx-auto">

                <p className="text-sm font-bold">Bridge</p>

                <BridgeNetworkCard 
                    number={number} 
                    setNumber={(number)=>{setNumber(number)}} 
                    otherNetwork={network2} 
                    network={network1} 
                    setNetwork={(network)=>{setNetwork1(network)}} 
                    primary={true}
                    setBalance={(balance)=>{setBalance(balance)}}
                />

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

                <BridgeNetworkCard 
                    number={number} 
                    setNumber={(number)=>{
                        setNumber(number)
                    }} 
                    otherNetwork={network1} 
                    network={network2} 
                    setNetwork={(network)=>{
                        setNetwork2(network)
                    }} 
                    primary={false}
                    setBalance={()=>{}}
                />

                <div className="space-y-2 px-4 my-6">
                    <div className="flex justify-between">
                        <p className="text-xs">Gas on destination</p>
                        <p className="text-xs font-semibold">{destinationGasUSD == null || isLoadingGas ? "--" : numberWithCommas(destinationGasUSD, 2)} USD</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xs">You will receive</p>
                        <p className="text-xs font-semibold">{number == 0 ? "--" : number} WAG</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xs">Fee</p>
                        <p className="text-xs font-semibold">Free</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xs">Slippage tolerance</p>
                        <p className="text-xs font-semibold">0.05%</p>
                    </div>
                </div>

                <div className="mt-4 w-full">
                    {
                        <Button color="dark" style={{width:"100%"}}
                            disabled={
                                isLoadingSwitchNetwork ||
                                isLoadingApproveAllowance ||
                                number == 0 || 
                                network1 == null || 
                                network2 == null ||
                                number > balance
                            }
                            onClick={()=>{
                                transferBridge();
                            }}
                        >
                            {
                                isLoadingSwitchNetwork ||
                                isLoadingApproveAllowance
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

            {
                showAlert &&
                <div class="absolute top-0 left-0 right-0">
                    <Alert color="success" onDismiss={() => setShowAlert(false)}>
                        <span className="font-medium">Bridge Success!</span> Please wait for several minutes for WAG to be deposited at the target network.
                    </Alert>
                </div>
            }

            <SwitchNetworkDialog 
                number={number} network1={network1} network2={network2} 
                isOpen={isLoadingSwitchNetwork}
            />

            <AllowanceDialog 
                number={number} network1={network1} network2={network2} 
                isOpen={isLoadingAllowance}
            />

            <ApproveDialog 
                number={number} network1={network1} network2={network2} 
                isOpen={isLoadingApproveAllowance}
            />

            <BridgeDialog 
                number={number} network1={network1} network2={network2} 
                isOpen={isLoadingSendBridge}
            />
        </div>
        
    )
  }
