import { useAccount } from 'wagmi'
import Disconnected from '../components/general/Disconnected';
import BridgeCard from '../components/bridge/BridgeCard';

export default function Bridge(props) {
  const { isConnected } = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <BridgeCard {...props}/>
            </div>
        }
    </div>
  )
}