import { useAccount } from 'wagmi'
import Disconnected from '../components/general/Disconnected';
import FaucetHome from '../components/faucet/FaucetHome';


export default function Faucet(props) {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
    
  return (
    <div className='container mx-auto px-4 md:px-10'>
        {
            !isConnected 
            ? <Disconnected {...props}/>
            : <div>
                <FaucetHome/>
            </div>
        }
    </div>
  )
}