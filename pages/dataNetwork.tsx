import Head from 'next/head';
import ComingSoon from '../components/general/ComingSoon';

interface DataNetworkProps {
  [key: string]: any;
}

export default function DataNetwork(props: DataNetworkProps) {
  return (
    <div className='container mx-auto'>
        <Head>
          <title>Data Network | Wagon Network</title>
        </Head>
        <ComingSoon/>
    </div>
  )
} 