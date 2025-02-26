import Head from 'next/head';
import LendHome from '../../components/lend/LendHome';

export default function Lend(props) {

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          {
            process.env.THEME_SKIN == 1
            ? <title>Lend | Wagon Network</title>
            : <title>Lend</title>
          }
        </Head>
        <div>
          <LendHome {...props}/>
        </div>
    </div>
  )
}