import { useAccount } from 'wagmi'
import Disconnected from '../components/general/Disconnected';
import AccountComponent from '../components/account';

export default function Home(props) {
  const { isConnected } = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <AccountComponent {...props}/>
            </div>
        }
    </div>
  )
}