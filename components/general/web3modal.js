import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.WALLET_PROJECT_ID

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
}

const bsc = {
    chainId: 56,
    name: 'BNB Smart Chain',
    currency: 'BNB',
    explorerUrl: 'https://bscscan.com',
    rpcUrl: 'https://rpc.ankr.com/bsc'
}

const sepolia = {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://rpc.sepolia.org'
}

const bscTestnet = {
    chainId: 97,
    name: 'Binance Smart Chain Testnet',
    currency: 'BNB',
    explorerUrl: 'https://testnet.bscscan.com',
    rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545'
}

// 3. Create a metadata object
const metadata = {
    name: 'Wagon Network',
    description: 'Decentralized supply chain financing and data network',
    url: 'https://wagon.network', // origin must match your domain & subdomain
    icons: ['https://wagon.network/logo.png']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    /*Required*/
    metadata,
})

// 5. Create a Web3Modal instance
createWeb3Modal({
    ethersConfig,
    chains: [mainnet, bsc, sepolia, bscTestnet],
    projectId,
    themeMode: 'light',
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    themeVariables: {
        '--w3m-font-family': 'Roboto, sans-serif',
        '--w3m-accent': 'rgb(31, 41, 55)'
      }
})

export function Web3Modal({ children }) {
    return children
}