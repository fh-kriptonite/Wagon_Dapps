/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PORT: process.env.PORT,
    
    IS_PROD:false,
    WALLET_PROJECT_ID: process.env.WALLET_PROJECT_ID,
    WALLET_FAUCET_ADDRESS: process.env.WALLET_FAUCET_ADDRESS,
    WALLET_FAUCET_KEY: process.env.WALLET_FAUCET_KEY,

    // ARBITRUM GOERLI
    WAG_ADDRESS: process.env.WAG_ADDRESS,
    WAGON_STAKING_PROXY: process.env.WAGON_STAKING_PROXY,
    MAINNET_EXPLORER: process.env.MAINNET_EXPLORER,
    MAINNET_TX_EXPLORER: process.env.MAINNET_TX_EXPLORER,
    GOERLI_EXPLORER: process.env.GOERLI_EXPLORER,
    GOERLI_TX_EXPLORER: process.env.GOERLI_TX_EXPLORER,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    ALCHEMY_PROVIDER_HTTPS: process.env.ALCHEMY_PROVIDER_HTTPS,
    
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
    FAUCET_DURATION: process.env.FAUCET_DURATION
  },
  trailingSlash: true
}

module.exports = nextConfig
