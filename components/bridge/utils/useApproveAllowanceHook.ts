import { useState } from 'react';
import ERC20_ABI from "../../../public/ABI/erc20.json";
import { parseEther, Contract } from 'ethers';
import { useGetProvider } from '@/util/getProvider';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';

interface Network {
    wagAddress: string;
    OFTAddress: string;
    // Add other network properties as needed
}

interface UseApproveAllowanceHookResult {
    isLoading: boolean;
    isWaitingApproval: boolean;
    fetchData: (network1: Network, amount: string) => Promise<{ data: any | null; error: string | null }>;
}

const useApproveAllowanceHook = (): UseApproveAllowanceHookResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);

    const getProvider = useGetProvider();
    const { connectedAddress } = useConnectedAddress();

    const fetchData = async (network1: Network, amount: string): Promise<{ data: any | null; error: string | null }> => {
        setIsLoading(true);
        // Contract ABI and Address
        const contractAddress = network1.wagAddress;
        const contractABI = ERC20_ABI;

        let data = null;
        let error = null;

        try {
            if (!connectedAddress) {
                throw new Error("No connected address available");
            }
            const provider = await getProvider();
            const signer = await provider.getSigner();

            // Initialize contract
            const contract = new Contract(contractAddress, contractABI, signer)

            setIsWaitingApproval(true);
            // Call smart contract function
            const transaction = await contract.approve(
                network1.OFTAddress, 
                parseEther(`${amount}`).toString()
            );
            setIsWaitingApproval(false);
            
            // Wait for transaction confirmation
            const receipt = await transaction.wait();
            if (receipt.status === 0) {
                throw new Error("Transaction reverted");
            }
            data = receipt;
            setIsLoading(false);
        } catch (e: any) {
            console.error("Approve error:", e);
            error = e.message || "Failed to approve allowance";
        } finally {
            setIsLoading(false);
            setIsWaitingApproval(false);
        }

        return { data, error };
    };

    return { isLoading, isWaitingApproval, fetchData };
};

export default useApproveAllowanceHook; 