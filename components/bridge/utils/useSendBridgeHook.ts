import { useState } from 'react';
import BRIDGE_ABI from "../../../public/ABI/bridge.json";
import { ethers, parseEther, Contract } from 'ethers';
import { getDestinationGasFeeService } from "../../../services/service_bridge"
import { Network } from "../types";
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import { useGetProvider } from '@/util/getProvider';

interface UseSendBridgeHookResult {
    isLoading: boolean;
    isWaitingApproval: boolean;
    fetchData: (network1: Network, network2: Network, amount: string) => Promise<{ data: any | null; error: string | null }>;
}

const useSendBridgeHook = (): UseSendBridgeHookResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);

    const { connectedAddress:address } = useConnectedAddress();
    const getProvider = useGetProvider();
    
    const fetchData = async (network1: Network, network2: Network, amount: string): Promise<{ data: any | null; error: string | null }> => {
        setIsLoading(true);
        let data = null;
        let error = null;

        try {
            if (!address) {
                throw new Error("No address available");
            }

            // Connect to Ethereum
            const provider = await getProvider();
            const signer = await provider.getSigner();
            
            // Contract ABI and Address
            const contractAddress = network1.OFTAddress;
            const contractABI = BRIDGE_ABI;
            
            // Initialize contract
            const contract = new Contract(contractAddress, contractABI, signer);

            const gas = await getDestinationGasFeeService(
                network2.lzEndpointId.toString(),
                network1.OFTAddress, 
                address, 
                network1.rpc,
                parseFloat(amount)
            );
            
            // Prepare transaction parameters
            const destinationAddress = ethers.AbiCoder.defaultAbiCoder().encode(["address"], [address]);
            const amountWei = parseEther(amount);
            const adapterParams = ethers.solidityPacked(
                ["uint16", "uint256"], 
                [1, 200000]
            );

            setIsWaitingApproval(true);
            // Call smart contract function
            const transaction = await contract.sendFrom(
                address,
                network2.lzEndpointId,
                destinationAddress,
                amountWei,
                amountWei,
                [
                    address, 
                    "0x0000000000000000000000000000000000000000", 
                    adapterParams
                ],
                { value: parseEther(gas.toFixed(18)) }
            );
            setIsWaitingApproval(false);
            // Wait for transaction confirmation
            await transaction.wait();

            data = transaction;
        } catch (e) {
            console.log(e)
            error = "Fail to bridge";
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            setIsWaitingApproval(false);
        }

        return { data, error };
    };

    return { isLoading, isWaitingApproval, fetchData };
};

export default useSendBridgeHook; 