import AccountComponent from '../components/account';
import Head from 'next/head';

interface HomeProps {
  [key: string]: any;
}

export default function Home(props: HomeProps) {
  const themeSkin = Number(process.env.THEME_SKIN || '0');

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
      <Head>
        {
          themeSkin === 1
          ? <title>Account | Wagon Network</title>
          : themeSkin === 2
            ? <title>Waresix ABS | Account</title>
            : <title>Account</title>
        }
      </Head>
      <div>
        <AccountComponent {...props}/>
      </div>
    </div>
  )
} 