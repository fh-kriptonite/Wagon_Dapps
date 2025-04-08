import StakeComponent from '../components/stake/index';
import Disconnected from '../components/general/Disconnected';
import Head from 'next/head';
import { useAccount } from '@particle-network/connectkit';

interface StakeProps {
  [key: string]: any;
}

export default function Stake(props: StakeProps) {
  const address = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          <title>Stake | Wagon Network</title>
        </Head>
        <div>
          <StakeComponent {...props}/>
        </div>
    </div>
  )
} 