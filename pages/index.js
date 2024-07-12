import Disconnected from '../components/general/Disconnected';
import AccountComponent from '../components/account';
import Head from 'next/head';
import { useAccount } from '@particle-network/connectkit';

export default function Home(props) {
  const account = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
      <Head>
        <title>Account | Wagon Network</title>
      </Head>
        {
            !account 
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