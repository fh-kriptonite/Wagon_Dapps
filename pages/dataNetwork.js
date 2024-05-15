import Head from 'next/head';
import ComingSoon from '../components/general/ComingSoon';

export default function DataNetwork(props) {
    
  return (
    <div className='container mx-auto'>
        <Head>
          <title>Data Network | Wagon Network</title>
        </Head>
        <ComingSoon/>
    </div>
  )
}