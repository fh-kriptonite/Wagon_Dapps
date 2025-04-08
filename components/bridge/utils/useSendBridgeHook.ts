import { useState } from 'react';
import BRIDGE_ABI from "../../../public/ABI/bridge.json";
import { ethers, parseEther, Contract } from 'ethers';
import { getDestinationGasFeeService } from "../../../services/service_bridge"
import { useParticleProvider, useAccount } from '@particle-network/connectkit';
import { Network } from "../types";

interface UseSendBridgeHookResult {
    isLoading: boolean;
    fetchData: (network1: Network, network2: Network, amount: string) => Promise<{ data: any | null; error: string | null }>;
}

const useSendBridgeHook = (): UseSendBridgeHookResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const particleProvider = useParticleProvider();
    const address = useAccount();
    
    const fetchData = async (network1: Network, network2: Network, amount: string): Promise<{ data: any | null; error: string | null }> => {
        setIsLoading(true);

        let data = null;
        let error = null;

        try {
            if (!particleProvider) {
                throw new Error("No provider available");
            }

            if (!address) {
                throw new Error("No address available");
            }

            // Connect to Ethereum
            const provider = new ethers.BrowserProvider(particleProvider as any);
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
            
            // Wait for transaction confirmation
            await transaction.wait();
            data = transaction;
        } catch (e) {
            error = "Fail to bridge";
        } finally {
            setIsLoading(false);
        }

        return { data, error };
    };

    return { isLoading, fetchData };
};

export default useSendBridgeHook; 