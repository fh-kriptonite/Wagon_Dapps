import { useState } from 'react';
import ERC20_ABI from "../../../public/ABI/erc20.json";
import { ethers, parseEther, Contract } from 'ethers';
import { useParticleProvider } from '@particle-network/connectkit';

interface Network {
    wagAddress: string;
    OFTAddress: string;
    // Add other network properties as needed
}

interface UseApproveAllowanceHookResult {
    isLoading: boolean;
    fetchData: (network1: Network, amount: string) => Promise<{ data: any | null; error: string | null }>;
}

const useApproveAllowanceHook = (): UseApproveAllowanceHookResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const particleProvider = useParticleProvider();
    
    const fetchData = async (network1: Network, amount: string): Promise<{ data: any | null; error: string | null }> => {
        setIsLoading(true);

        let data = null;
        let error = null;

        try {
            // Connect to Ethereum
            if (!particleProvider) {
                throw new Error("Provider is not available");
            }
            // Use type assertion to tell TypeScript this provider is compatible
            const provider = new ethers.BrowserProvider(particleProvider as any);
            const signer = await provider.getSigner();
            
            // Contract ABI and Address
            const contractAddress = network1.wagAddress;
            const contractABI = ERC20_ABI; // Your contract's ABI

            // Initialize contract
            const contract = new Contract(contractAddress, contractABI, signer);

            // Call smart contract function
            const transaction = await contract.approve(
                network1.OFTAddress, 
                parseEther(`${amount}`).toString()
            );
            
            // Wait for transaction confirmation
            await transaction.wait();
            data = transaction;
        } catch (e) {
            error = "Fail to approve";
        } finally {
            setIsLoading(false);
        }

        return { data, error };
    };

    return { isLoading, fetchData };
};

export default useApproveAllowanceHook; 