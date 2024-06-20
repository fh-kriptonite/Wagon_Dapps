import { Web3WalletProvider } from '../components/general/web3WalletContext';

export default function HomeApp({children}) {

  return (
    <Web3WalletProvider>
        {children}
    </Web3WalletProvider>
  )
}