import Head from 'next/head';
import LendHome from '../../components/lend/LendHome';

interface LendProps {
  [key: string]: any;
}

export default function Lend(props: LendProps) {
  const themeSkin = Number(process.env.THEME_SKIN || '0');

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          {
            themeSkin === 1
            ? <title>Lend | Wagon Network</title>
            : themeSkin === 2
              ? <title>Waresix ABS | Lend</title>
              : <title>Lend</title>
          }
        </Head>
        <div>
          <LendHome {...props}/>
        </div>
    </div>
  )
} 