import AccountComponent from '../components/account';
import Head from 'next/head';

export default function Home(props) {

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
      <Head>
        {
          process.env.THEME_SKIN == 1
          ? <title>Account | Wagon Network</title>
          : process.env.THEME_SKIN == 2
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