/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/trucks/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate", // Forces fresh load
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: 'loose'
  },
  // Add transpilePackages to handle ESM modules
  transpilePackages: [
    '@particle-network/connectkit',
    '@particle-network/evm-connectors',
    '@simplewebauthn/browser',
    '@particle-network/auth-connectors',
    '@particle-network/wallet-plugin',
    '@particle-network/aa-plugin',
    '@coinbase/wallet-sdk'
  ],
  webpack: (config, { isServer }) => {
    // Handle ESM modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };
    
    // Add fallback for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Configure module resolution for ESM packages
    config.resolve.conditionNames = ['import', 'module', 'browser', 'default'];
    
    // Add a rule to handle ESM modules
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Handle ESM modules in node_modules
    config.module.rules.push({
      test: /\.m?js/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // Handle JSON files
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    // Add rule to handle React Strict Mode warnings
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: /node_modules\/@particle-network/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
            ['@babel/plugin-proposal-class-properties', { loose: true }]
          ]
        }
      }
    });

    // Handle Coinbase wallet SDK ESM modules
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/@coinbase\/wallet-sdk/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  env: {
    PRODUCTION: process.env.PRODUCTION,
    
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
    BNB_CHAIN_ID: process.env.BNB_CHAIN_ID,
    ERC1155_ADDRESS_BNB: process.env.ERC1155_ADDRESS_BNB,
    LENDING_ADDRESS_BNB: process.env.LENDING_ADDRESS_BNB,
    PROVIDER_HTTPS_BNB: process.env.PROVIDER_HTTPS_BNB,
    BNB_EXPLORER: process.env.BNB_EXPLORER,
    
    // BASE
    BASE_CHAIN_ID: process.env.BASE_CHAIN_ID,
    PROVIDER_HTTPS_BASE: process.env.PROVIDER_HTTPS_BASE,
    BASE_EXPLORER: process.env.BASE_EXPLORER,
    ERC1155_ADDRESS_BASE: process.env.ERC1155_ADDRESS_BASE,
    LENDING_ADDRESS_BASE: process.env.LENDING_ADDRESS_BASE,
    
    // HCAPTCHA
    HCAPTCHA_SITEKEY: process.env.HCAPTCHA_SITEKEY,
    HCAPTCHA_SECRETKEY: process.env.HCAPTCHA_SECRETKEY,

    // DATABASE
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,

    // BRIDGE
    BRIDGE_NETWORK_FILE: process.env.BRIDGE_NETWORK_FILE,

    // PARTICLE
    PARTICLE_NETWORK_PROJECT_ID: process.env.PARTICLE_NETWORK_PROJECT_ID,
    PARTICLE_NETWORK_CLIENT_KEY: process.env.PARTICLE_NETWORK_CLIENT_KEY,
    PARTICLE_NETWORK_APP_ID: process.env.PARTICLE_NETWORK_APP_ID,

    // RAMP
    WAGON_API_URL: process.env.WAGON_API_URL,

    // ONRAMP
    ONRAMP_ADDRESS: process.env.ONRAMP_ADDRESS,
    IDRX_ADDRESS_BSC: process.env.IDRX_ADDRESS_BSC,
    IDRX_ADDRESS_BASE: process.env.IDRX_ADDRESS_BASE,

    ONRAMP_IDRX_ADDRESS_BSC: process.env.ONRAMP_IDRX_ADDRESS_BSC,
    ONRAMP_IDRX_ADDRESS_BASE: process.env.ONRAMP_IDRX_ADDRESS_BASE,

    // THEME SKIN
    THEME_SKIN: process.env.THEME_SKIN
  }
};

export default nextConfig;