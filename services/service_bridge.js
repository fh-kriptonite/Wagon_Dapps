import BRIDGE_ABI from '../public/ABI/bridge.json';
import { ethers } from "ethers"

module.exports = {

    getDestinationGasFeeService : async (endpointId, OFTAddress, walletAddress, providerUrl, chainId, amount) => {
        // Connect to the Ethereum network
        const provider = new ethers.providers.JsonRpcProvider(providerUrl, {chainId});

        // Instantiate the ERC-20 token contract
        const sepoliaOFT = new ethers.Contract(OFTAddress, BRIDGE_ABI, provider)
        let defaultAdapterParams = ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000])
        const deployerAddressBytes32 = ethers.utils.defaultAbiCoder.encode(["address"], [walletAddress])
      
        return new Promise( async (resolve, reject) => {
            // Get the balance of the wallet address
            try {
                const weiAmount = ethers.utils.parseUnits(amount.toString(), 18); // Convert to Wei
                const formattedAmount = weiAmount.toString(); // Convert to string
                
                let nativeFee = (
                    await sepoliaOFT.estimateSendFee(
                        endpointId, 
                        deployerAddressBytes32, 
                        formattedAmount, 
                        false,
                        defaultAdapterParams
                    )).nativeFee
                
                // Get the decimals to adjust the balance
                const decimals = 18;
            
                // Adjust the balance based on the token decimals
                const destinationGasFee = ethers.utils.formatUnits(nativeFee, decimals);
                
                resolve(parseFloat(destinationGasFee));
            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        })
      }
}