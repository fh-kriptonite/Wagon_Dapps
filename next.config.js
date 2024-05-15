/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PORT: process.env.PORT,
    PRODUCTION: process.env.PRODUCTION,
    
    WALLET_PROJECT_ID: process.env.WALLET_PROJECT_ID,
    WALLET_FAUCET_ADDRESS: process.env.WALLET_FAUCET_ADDRESS,
    WALLET_FAUCET_KEY: process.env.WALLET_FAUCET_KEY,

    BRIDGE_LOCAL_CHAIN_ID: process.env.BRIDGE_LOCAL_CHAIN_ID,

    // MAINNET NETWORK
    ETH_CHAIN_ID: process.env.ETH_CHAIN_ID,
    WAG_ADDRESS: process.env.WAG_ADDRESS,
    WAGON_STAKING_PROXY: process.env.WAGON_STAKING_PROXY,
    WAGON_TEAM_FINANCE_LOCK: process.env.WAGON_TEAM_FINANCE_LOCK,
    MAINNET_EXPLORER: process.env.MAINNET_EXPLORER,
    MAINNET_TX_EXPLORER: process.env.MAINNET_TX_EXPLORER,
    ALCHEMY_PROVIDER_HTTPS: process.env.ALCHEMY_PROVIDER_HTTPS,

    // BNB
    WAG_ADDRESS_BNB: process.env.WAG_ADDRESS_BNB,
    BNB_CHAIN_ID: process.env.BNB_CHAIN_ID,
    ERC1155_ADDRESS_BNB: process.env.ERC1155_ADDRESS_BNB,
    LENDING_ADDRESS_BNB: process.env.LENDING_ADDRESS_BNB,
    BNB_STABLE_COIN_ADDRESS_1: process.env.BNB_STABLE_COIN_ADDRESS_1,
    PROVIDER_HTTPS_BNB: process.env.PROVIDER_HTTPS_BNB,
    BNB_SCAN_API_KEY: process.env.BNB_SCAN_API_KEY,
    BNB_CHAIN_NAME: process.env.BNB_CHAIN_NAME,
    BNB_EXPLORER: process.env.BNB_EXPLORER,
    BNB_ERC1155_JSON_URI: process.env.BNB_ERC1155_JSON_URI,
    
    // HCAPTCHA
    HCAPTCHA_SITEKEY: process.env.HCAPTCHA_SITEKEY,
    HCAPTCHA_SECRETKEY: process.env.HCAPTCHA_SECRETKEY,

    // DATABASE
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,

    // FAUCET DURATION
    FAUCET_DURATION: process.env.FAUCET_DURATION,

    // CMC
    CMC_API_KEY: process.env.CMC_API_KEY,

    // BRIDGE
    BRIDGE_NETWORK_FILE: process.env.BRIDGE_NETWORK_FILE
  },
  trailingSlash: true
}

module.exports = nextConfig
