import Disconnected from '../components/general/Disconnected';
import FaucetHome from '../components/faucet/FaucetHome';
import { checkConnected } from '../util/web3Utility';


export default function Faucet(props) {
  const isConnected = checkConnected();
    
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