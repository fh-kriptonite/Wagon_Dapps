import { useAccount } from 'wagmi'
import StakeComponent from '../components/stake/index';
import Disconnected from '../components/general/Disconnected';

export default function Home(props) {
  const { isConnected } = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10'>
        {
            !isConnected 
            ? <Disconnected {...props}/>
            : <div>
                <StakeComponent {...props}/>
            </div>
        }
    </div>
  )
}