import Head from 'next/head';
import { useAccount } from '@particle-network/connectkit';
import Disconnected from '../../components/general/Disconnected';
import ProfileComponent from '../../components/account/profile';

interface ProfileProps {
  [key: string]: any;
}

export default function Profile(props: ProfileProps) {
  const address = useAccount();
  const themeSkin = Number(process.env.THEME_SKIN || '0');

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          {
            themeSkin === 1
            ? <title>Profile | Wagon Network</title>
            : themeSkin === 2
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