import BridgeCard from '../components/bridge/BridgeCard';
import Head from 'next/head';

interface BridgeProps {
  [key: string]: any;
}

export default function Bridge(props: BridgeProps) {
  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          <title>Bridge | Wagon Network</title>
        </Head>
        <div className='h-full'>
          <BridgeCard {...props}/>
        </div>
    </div>
  )
} 