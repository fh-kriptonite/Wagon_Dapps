import Head from 'next/head';
import ComingSoon from '../components/general/ComingSoon';

interface DataAnalyticsProps {
  [key: string]: any;
}

export default function DataAnalytics(props: DataAnalyticsProps) {
  return (
    <div className='container mx-auto'>
        <Head>
          <title>Data Analytics | Wagon Network</title>
        </Head>
        <ComingSoon/>
    </div>
  )
} 