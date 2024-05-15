import Head from 'next/head';
import ComingSoon from '../components/general/ComingSoon';

export default function DataAnalytics(props) {
    
  return (
    <div className='container mx-auto'>
        <Head>
          <title>Data Analytics | Wagon Network</title>
        </Head>
        <ComingSoon/>
    </div>
  )
}