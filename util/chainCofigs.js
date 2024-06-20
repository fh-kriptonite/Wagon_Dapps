import { CHAIN_NAMESPACES } from "@web3auth/base";

export const chainConfig = {
    chainId: "0x1", // for wallet connect make sure to pass in this chain in the loginSettings of the adapter.
    displayName: "Ethereum",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    tickerName: "Ethereum",
    ticker: "ETH",
    rpcTarget: "https://ethereum-rpc.publicnode.com",
    blockExplorerUrl: "https://etherscan.io",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

export const bscChainCofig = {
    chainId: "0x38", // for wallet connect make sure to pass in this chain in the loginSettings of the adapter.
    displayName: "BSC",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    tickerName: "BNB",
    ticker: "BNB",
    rpcTarget: "https://bsc-pokt.nodies.app",
    blockExplorerUrl: "https://bscscan.com/",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
};

export const sepoliaChainCofig = {
    chainId: "0xAA36A7", // for wallet connect make sure to pass in this chain in the loginSettings of the adapter.
    displayName: "Sepolia",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    tickerName: "Ethereum",
    ticker: "ETH",
    rpcTarget: "https://rpc.sepolia.org",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};
  
export const bscTestnetChainCofig = {
    chainId: "0x61", // for wallet connect make sure to pass in this chain in the loginSettings of the adapter.
    displayName: "BSC Testnet",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    tickerName: "BNB",
    ticker: "tBNB",
    rpcTarget: "https://bsc-testnet-rpc.publicnode.com",
    blockExplorerUrl: "https://testnet.bscscan.com/",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
};

export function getChainConfigById(chainId) {
    if(chainId == "0x1" || chainId == "1") return chainConfig;
    if(chainId == "0x38" || chainId == "56") return bscChainCofig;
    if(chainId == "0xAA36A7" || chainId == "11155111") return sepoliaChainCofig;
    if(chainId == "0x61" || chainId == "97") return bscTestnetChainCofig;
    return null;
}