import StakeComponent from '../components/stake/index';
import Head from 'next/head';

interface StakeProps {
  [key: string]: any;
}

export default function Stake(props: StakeProps) {
  return (
    <div className='container mx-auto h-full'>
        <Head>
          <title>Stake | Wagon Network</title>
        </Head>
        <div>
          <StakeComponent {...props}/>
        </div>
    </div>
  )
} 