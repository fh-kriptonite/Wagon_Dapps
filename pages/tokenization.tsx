import TokenizationComponent from '../components/tokenization';
import Head from 'next/head';

interface TokenizationProps {
  [key: string]: any;
}

export default function Tokenization(props: TokenizationProps) {
  const themeSkin = Number(process.env.THEME_SKIN || '0');

  return (
    <div className='container mx-auto h-full'>
      <Head>
        {
          <title>Tokenization | Wagon Network</title>
        }
      </Head>
      <div>
        <TokenizationComponent {...props}/>
      </div>
    </div>
  )
} 