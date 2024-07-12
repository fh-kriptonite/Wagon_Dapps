import StakeComponent from '../components/stake/index';
import Disconnected from '../components/general/Disconnected';
import Head from 'next/head';
import { useAccount } from '@particle-network/connectkit';

export default function Stake(props) {
  const address = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          <title>Stake | Wagon Network</title>
        </Head>
        {
            !address 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <StakeComponent {...props}/>
            </div>
        }
    </div>
  )
}