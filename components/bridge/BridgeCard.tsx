import { BiTransferAlt } from "react-icons/bi"
import BridgeNetworkCard from "./BridgeNetworkCard"
import { useEffect, useState } from "react"
import { Button } from "flowbite-react";
import { Network } from './types';
import { numberWithCommas } from "../../util/stringUtility";
import SwitchNetworkDialog from "./dialog/SwitchNetworkDialog";
import AllowanceDialog from "./dialog/AllowanceDialog";
import ApproveDialog from "./dialog/ApproveDialog";
import BridgeDialog from "./dialog/BridgeDialog";
import useGetDestinationGasHook from "./utils/useGetDestinationGasHook";
import useSwitchNetworkHook from "./utils/useSwitchNetworkHook";
import useCheckAllowanceHook from "./utils/useCheckAllowanceHook";
import useApproveAllowanceHook from "./utils/useApproveAllowanceHook";
import useSendBridgeHook from "./utils/useSendBridgeHook";
import { useConnectedAddress } from "@/hooks/useConnectedAddress";
import { Alert } from 'flowbite-react';
import { Dialog } from '@headlessui/react';

interface BridgeCardProps {
    // Add any props if needed
}

export default function BridgeCard(props: BridgeCardProps) {
    const { connectedAddress } = useConnectedAddress();
    const [number, setNumber] = useState<string>("");
    const [balance, setBalance] = useState<number>(0);
    const [network1, setNetwork1] = useState<Network | null>(null);
    const [network2, setNetwork2] = useState<Network | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const { isLoading: isLoadingGas, data: destinationGasUSD, fetchData: getGasOnDestination } = useGetDestinationGasHook();

    async function getGas() {
        if(network1 != null && network2 != null && connectedAddress) {
            getGasOnDestination(network2, network1, connectedAddress, 0);
        }
    }

    useEffect(() => {
        getGas();
    }, [network1, network2, connectedAddress])

    const { isLoading: isLoadingSwitchNetwork, fetchData: switchNetwork } = useSwitchNetworkHook();
    const { isLoading: isLoadingAllowance, fetchData: checkAllowance } = useCheckAllowanceHook();
    const { isLoading: isLoadingApproveAllowance, isWaitingApproval: isWaitingApprovalApproveAllowance, fetchData: approveAllowance } = useApproveAllowanceHook();
    const { isLoading: isLoadingSendBridge, isWaitingApproval: isWaitingApprovalSendBridge, fetchData: sendBridge } = useSendBridgeHook();
    
    async function handleNetwork(): Promise<number> {
        // checking network
        if (!network1?.chainId) {
            throw new Error("Network chain ID is undefined");
        }
        const { data } = await switchNetwork(network1.chainId);
        if (data === null) {
            throw new Error("Failed to switch network");
        }
        return data;
    }

    async function handleAllowance(currentChainId: number): Promise<void> {
        // checking allowance
        if(currentChainId == Number(process.env.BRIDGE_LOCAL_CHAIN_ID)) {
            if (!network1 || !connectedAddress) {
                throw new Error("Network or address is undefined");
            }
            const resultAllowance = await checkAllowance(network1, connectedAddress);
            if (resultAllowance.error) {
                throw resultAllowance.error
            }

            if(parseFloat(resultAllowance.data || "0") < parseFloat(number)) {
                // approving allowance
                const resultApprove = await approveAllowance(network1, number)
                if (resultApprove.error) {
                    throw resultApprove.error
                }
            }
        }
    }

    async function handleTransferBridge(): Promise<void> {
        // transfer bridge
        if (!network1 || !network2) {
            throw new Error("Network is undefined");
        }
        const resultSendBridge = await sendBridge(network1, network2, number)
        if (resultSendBridge.error) {
            throw resultSendBridge.error;
        }
        showAlertWithTimeout();
    }

    async function transferBridge(): Promise<void> {
        try {
            const currentChainId = await handleNetwork();
            await handleAllowance(currentChainId);
            await handleTransferBridge();
        } catch (error) {
            console.log(error)
        }
    }

    const showAlertWithTimeout = (): void => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    function showApproveDialog(): boolean {
        if(isWaitingApprovalApproveAllowance) { return false }
        if(isLoadingApproveAllowance) { return true }
        return false;
    }

    function showSendBridgeDialog(): boolean {
        if(isWaitingApprovalSendBridge) { return false }
        if(isLoadingSendBridge) { return true }
        return false;
    }

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="card max-w-md mx-auto">
                <p className="text-sm font-bold">Bridge</p>

                <BridgeNetworkCard 
                    number={number} 
                    setNumber={(number: string) => {setNumber(number)}} 
                    otherNetwork={network2} 
                    network={network1} 
                    setNetwork={(network: Network) => {setNetwork1(network)}} 
                    primary={true}
                    setBalance={(balance: number) => {setBalance(balance)}}
                />

                <div className="my-6">
                    <BiTransferAlt style = {{transform: 'rotate(90deg)' }} 
                        className='w-6 h-6 text-gray-500 mx-auto hover:cursor-pointer'
                        onClick={() => {
                            const tempNetwork = network1;
                            setNetwork1(network2)
                            setNetwork2(tempNetwork)
                        }}
                    />
                </div>

                <BridgeNetworkCard 
                    number={number} 
                    setNumber={(number: string) => {
                        setNumber(number)
                    }} 
                    otherNetwork={network1} 
                    network={network2} 
                    setNetwork={(network: Network) => {
                        setNetwork2(network)
                    }} 
                    primary={false}
                    setBalance={() => {}}
                />

                <div className="space-y-2 px-4 my-6">
                    <div className="flex justify-between">
                        <p className="text-xs">Gas on destination</p>
                        <p className="text-xs font-semibold">{destinationGasUSD == null || isLoadingGas ? "--" : numberWithCommas(destinationGasUSD, 2)} USD</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xs">You will receive</p>
                        <p className="text-xs font-semibold">{number == "0" ? "--" : number} WAG</p>
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
                    <Button color="dark" 
                        className="w-full disabled:bg-gray-300"
                        disabled={
                            isLoadingSwitchNetwork ||
                            isLoadingAllowance ||
                            isLoadingApproveAllowance ||
                            isWaitingApprovalApproveAllowance ||
                            isLoadingSendBridge ||
                            isWaitingApprovalSendBridge ||
                            number === "0" || 
                            number === "" || 
                            network1 == null || 
                            network2 == null ||
                            parseFloat(number) > balance
                        }
                        onClick={() => {
                            transferBridge();
                        }}
                    >
                        {
                            isLoadingSwitchNetwork ||
                            isLoadingAllowance||
                            isLoadingApproveAllowance ||
                            isWaitingApprovalApproveAllowance ||
                            isLoadingSendBridge ||
                            isWaitingApprovalSendBridge
                            ? "Loading..."
                            : "TRANSFER"
                        }
                    </Button>
                </div>
            </div>

            <div className="flex gap-1 justify-center items-center mt-2">
                <p className="text-xs">Powered By</p>
                <img src="/network/logo-layerzero.png" className="h-12" alt="LayerZero Logo"/>
            </div>

            {showAlert && (
                <div className="absolute top-0 left-0 right-0">
                    <Alert color="success" onDismiss={() => setShowAlert(false)}>
                        <span className="font-medium">Bridge Success!</span> Please wait for several minutes for WAG to be deposited at the target network.
                    </Alert>
                </div>
            )}

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
                isOpen={showApproveDialog()}
            />

            <BridgeDialog 
                number={number} network1={network1} network2={network2} 
                isOpen={showSendBridgeDialog()}
            />
        </div>
    )
} 