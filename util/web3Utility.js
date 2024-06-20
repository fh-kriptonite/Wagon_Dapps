import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";

export function checkConnected() {
    const { isConnected } = useWeb3ModalAccount();
    const { isConnected : isConnectedWeb3Auth } = useWeb3Auth();

    return isConnected || isConnectedWeb3Auth;
}

export async function getAddress(provider) {
    if (!provider) {
        console.log("provider not initialized yet");
        return;
    }

    const address = await provider.request({method: 'eth_accounts'});
    return(address[0]);
}

export async function getChainId(provider) {
    if (!provider) {
        console.log("provider not initialized yet");
        return;
    }

    const _provider = new ethers.BrowserProvider(provider)
    const networkDetails = await _provider.getNetwork();
    const chainId = networkDetails.chainId.toString();
    return(chainId);
}