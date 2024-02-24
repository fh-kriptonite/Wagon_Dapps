import { useAccount } from 'wagmi'
import Disconnected from '../../components/general/Disconnected';
import LendHome from '../../components/lend/LendHome';

export default function Lend(props) {
  const { isConnected } = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <LendHome {...props}/>
            </div>
        }
    </div>
  )
}