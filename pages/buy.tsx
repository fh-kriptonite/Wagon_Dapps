import Head from 'next/head';
import ComingSoon from '../components/general/ComingSoon';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';

interface RampProps {
  [key: string]: any;
}

export default function Ramp(props: RampProps) {
  const { connectedAddress: account } = useConnectedAddress();

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