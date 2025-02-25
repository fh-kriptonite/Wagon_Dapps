import ButtonConnect from './ButtonConnect';

export default function Disconnected(props) {
    
    return (
        <div className='h-full flex'>
            <div className='m-auto text-center'>
                {
                    process.env.THEME_SKIN == 2
                    ? <img src="/logo-waresix-square.png" className="h-32 mx-auto rounded-full" alt="Logo" />
                    : <img src="/logo.png" className="h-16 mx-auto" alt="Logo" />
                }
                <h5 className="text-xl font-bold mt-5">
                    Please, connect your wallet
                </h5>
                <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                    Pelase connect your wallet to see your staking dashboard.
                </p>
                <ButtonConnect/>
            </div>
        </div>
    )
  }