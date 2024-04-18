import Disconnected from '../components/general/Disconnected';
import AccountComponent from '../components/account';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

export default function Home(props) {
  const { isConnected } = useWeb3ModalAccount();

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