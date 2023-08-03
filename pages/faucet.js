import { useAccount } from 'wagmi'
import Disconnected from '../components/Disconnected';
import { useRouter } from 'next/router'
import FaucetHome from '../components/faucet/FaucetHome';


export default function Faucet(props) {
    const { address, isConnected, isConnecting, isDisconnected } = useAccount();
    const router = useRouter()

    const name = router.query.name;
    const poolId = router.query.poolId;

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