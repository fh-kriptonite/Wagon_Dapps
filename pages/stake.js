import { useAccount } from 'wagmi'
import StakeComponent from '../components/stake/index';
import Disconnected from '../components/general/Disconnected';

export default function Stake(props) {
  const { isConnected } = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <StakeComponent {...props}/>
            </div>
        }
    </div>
  )
}