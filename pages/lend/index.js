import Head from 'next/head';
import Disconnected from '../../components/general/Disconnected';
import LendHome from '../../components/lend/LendHome';
import { checkConnected } from '../../util/web3Utility';

export default function Lend(props) {
  const isConnected = checkConnected();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          <title>Lend | Wagon Network</title>
        </Head>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <LendHome {...props}/>
            </div>
        }
    </div>
  )
}