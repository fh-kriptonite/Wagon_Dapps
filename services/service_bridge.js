import BRIDGE_ABI from '../public/ABI/bridge.json';
import { ethers } from "ethers"

module.exports = {

    getDestinationGasFeeService : async (endpointId, OFTAddress, walletAddress, providerUrl, amount) => {
        // Connect to the Ethereum network
        const provider = new ethers.JsonRpcProvider(providerUrl);

        // Instantiate the ERC-20 token contract
        const localOFT = new ethers.Contract(OFTAddress, BRIDGE_ABI, provider)
        let defaultAdapterParams = ethers.solidityPacked(["uint16", "uint256"], [1, 200000])
        const deployerAddressBytes32 = ethers.AbiCoder.defaultAbiCoder().encode(["address"], [walletAddress])
      
        return new Promise( async (resolve, reject) => {
            // Get the balance of the wallet address
            try {
                const weiAmount = ethers.parseUnits(amount.toString(), 18); // Convert to Wei
                const formattedAmount = weiAmount.toString(); // Convert to string
                
                let nativeFee = (
                    await localOFT.estimateSendFee(
                        endpointId, 
                        deployerAddressBytes32, 
                        formattedAmount, 
                        false,
                        defaultAdapterParams
                    )).nativeFee
                
                // Get the decimals to adjust the balance
                const decimals = 18;
            
                // Adjust the balance based on the token decimals
                const destinationGasFee = ethers.formatUnits(nativeFee, decimals);
                
                resolve(parseFloat(destinationGasFee));
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
      }
}