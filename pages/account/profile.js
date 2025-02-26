import Head from 'next/head';
import { useAccount } from '@particle-network/connectkit';
import Disconnected from '../../components/general/Disconnected';
import ProfileComponent from '../../components/account/profile';

export default function Profile(props) {
  const address = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          {
            process.env.THEME_SKIN == 1
            ? <title>Profile | Wagon Network</title>
            : process.env.THEME_SKIN == 2
              ? <title>Waresix ABS | Profile</title>
              : <title>Profile</title>
          }
        </Head>
        {
            !address 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <ProfileComponent {...props}/>
            </div>
        }
    </div>
  )
}