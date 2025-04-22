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
import { HiArrowPath } from "react-icons/hi2";

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
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <BiTransferAlt className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Bridge</h2>
                            <p className="text-sm text-gray-500">Transfer WAG between networks</p>
                        </div>
                    </div>
                </div>

                {/* Network Cards */}
                <div className="space-y-4">
                    <BridgeNetworkCard 
                        number={number} 
                        setNumber={setNumber} 
                        otherNetwork={network2} 
                        network={network1} 
                        setNetwork={setNetwork1} 
                        primary={true}
                        setBalance={setBalance}
                    />

                    {/* Transfer Arrow */}
                    <div className="flex justify-center -my-2">
                        <button 
                            onClick={() => {
                                const tempNetwork = network1;
                                setNetwork1(network2);
                                setNetwork2(tempNetwork);
                            }}
                            className="bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition-colors"
                        >
                            <HiArrowPath className="w-5 h-5 text-blue-600" />
                        </button>
                    </div>

                    <BridgeNetworkCard 
                        number={number} 
                        setNumber={setNumber} 
                        otherNetwork={network1} 
                        network={network2} 
                        setNetwork={setNetwork2} 
                        primary={false}
                        setBalance={() => {}}
                    />
                </div>

                {/* Transaction Details */}
                <div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Gas on destination</span>
                        <span className="text-sm font-medium text-gray-900">
                            {destinationGasUSD == null || isLoadingGas ? "--" : `$${numberWithCommas(destinationGasUSD, 2)}`}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">You will receive</span>
                        <span className="text-sm font-medium text-gray-900">
                            {number == "0" ? "--" : `${number} WAG`}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Fee</span>
                        <span className="text-sm font-medium text-gray-900">Free</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Slippage tolerance</span>
                        <span className="text-sm font-medium text-gray-900">0.05%</span>
                    </div>
                </div>

                {/* Transfer Button */}
                <div className="mt-6">
                    <Button 
                        color="blue"
                        className="w-full disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                        onClick={transferBridge}
                    >
                        {isLoadingSwitchNetwork ||
                         isLoadingAllowance ||
                         isLoadingApproveAllowance ||
                         isWaitingApprovalApproveAllowance ||
                         isLoadingSendBridge ||
                         isWaitingApprovalSendBridge
                            ? "Processing..."
                            : "Transfer WAG"}
                    </Button>
                </div>
            </div>

            {/* Powered By */}
            <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-xs text-gray-500">Powered By</span>
                <img src="/network/logo-layerzero.png" className="h-8" alt="LayerZero Logo"/>
            </div>

            {/* Success Alert */}
            {showAlert && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl">
                    <Alert color="success" onDismiss={() => setShowAlert(false)}>
                        <span className="font-medium">Bridge Success!</span> Please wait for several minutes for WAG to be deposited at the target network.
                    </Alert>
                </div>
            )}

            {/* Dialogs */}
            <SwitchNetworkDialog 
                number={number} 
                network1={network1} 
                network2={network2} 
                isOpen={isLoadingSwitchNetwork}
            />

            <AllowanceDialog 
                number={number} 
                network1={network1} 
                network2={network2} 
                isOpen={isLoadingAllowance}
            />

            <ApproveDialog 
                number={number} 
                network1={network1} 
                network2={network2} 
                isOpen={showApproveDialog()}
            />

            <BridgeDialog 
                number={number} 
                network1={network1} 
                network2={network2} 
                isOpen={showSendBridgeDialog()}
            />
        </div>
    );
} 