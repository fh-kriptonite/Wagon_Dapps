import '../styles/globals.css'
import Head from "next/head"
import Script from 'next/script'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { useEffect, useState } from 'react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { baseGoerli, mainnet, sepolia, bscTestnet, bsc } from 'wagmi/chains'
import Sidebar from '../components/general/Sidebar'

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = process.env.WALLET_PROJECT_ID

// 2. Configure wagmi client
const chains = [ mainnet, baseGoerli, sepolia, bsc, bscTestnet]

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, appName: 'wagonStake', chains }),
  provider
})

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains)

function MyApp({ Component, pageProps }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    import("flowbite")
  }, [])

  return (
    <>
      <Head>
        <title>Apps | Wagon Network</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-T11YXZR7QS"/>
        <Script
          id='google-analytics'
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T11YXZR7QS', {
                page_path: window.location.pathname,
              });
            `,
            }}
        />

      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <div className='h-screen flex flex-col'>
            <Sidebar/>
            <div className="p-2 mt-20 md:ml-56 grow">
              <Component {...pageProps} provider={provider} />
            </div>
          </div>
        </WagmiConfig>
      ) : null}

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeMode={"light"} 
        themeVariables={{
          '--w3m-font-family': 'Roboto, sans-serif',
          '--w3m-accent-color': '#1f2937',
          '--w3m-background-color': '#1f2937'
        }}
      />
      
    </>
  )
}

export default MyApp
