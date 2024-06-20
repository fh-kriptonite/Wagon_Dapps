import Disconnected from '../components/general/Disconnected';
import AccountComponent from '../components/account';
import Head from 'next/head';
import { checkConnected } from '../util/web3Utility';

export default function Home(props) {
  const isConnected = checkConnected();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
      <Head>
        <title>Account | Wagon Network</title>
      </Head>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <AccountComponent {...props}/>
            </div>
        }
    </div>
  )
}