import '../styles/globals.css'
import Head from "next/head"
import Script from 'next/script'

import { useEffect, useState } from 'react'
import Sidebar from '../components/general/Sidebar'
import { Web3Modal } from '../components/general/web3modal'

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

      {/* <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-T11YXZR7QS"/>
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
        /> */}

      {ready ? (
        <Web3Modal>
          <div className='h-screen flex flex-col'>
            <Sidebar/>
            <div className="p-2 mt-20 md:ml-56 grow">
              <Component {...pageProps}/>
            </div>
          </div>
        </Web3Modal>
      ) : null}
    </>
  )
}

export default MyApp
