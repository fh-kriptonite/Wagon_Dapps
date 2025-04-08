import Head from 'next/head';
import ComingSoon from '../components/general/ComingSoon';

interface GovernanceProps {
  [key: string]: any;
}

export default function Governance(props: GovernanceProps) {
  return (
    <div className='container mx-auto'>
        <Head>
          <title>Governance | Wagon Network</title>
        </Head>
        <ComingSoon/>
    </div>
  )
} 