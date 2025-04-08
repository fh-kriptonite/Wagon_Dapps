import Head from 'next/head';
import { useAccount } from '@particle-network/connectkit';
import ComingSoon from '../components/general/ComingSoon';

interface RampProps {
  [key: string]: any;
}

export default function Ramp(props: RampProps) {
  const account = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          <title>Ramp | Wagon Network</title>
        </Head>
        <ComingSoon/>
        {/* {
            !account 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div className='h-full'>
                <RampHome {...props}/>
            </div>
        } */}
    </div>
  )
} 