import '../styles/globals.css'
import Head from "next/head"
import Script from 'next/script'

import { useEffect, useState } from 'react'
import Sidebar from '../components/general/Sidebar'
import { Web3Modal } from '../components/general/web3modal'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const [ready, setReady] = useState(false)
  const router = useRouter();

  useEffect(() => {
    setReady(true)
    import("flowbite")
  }, [])

  useEffect(() => {
  if (process.env.PRODUCTION) {
    const handleRouteChange = (url) => {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_path: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Apps | Wagon Network</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {
        process.env.PRODUCTION &&
        <>
          <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`} />
          <Script
            id='google-analytics'
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
          />
        </>
      }

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
