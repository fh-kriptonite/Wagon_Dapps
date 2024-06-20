import ButtonConnect from './ButtonConnect';

export default function Disconnected(props) {
    
    return (
        <div className='h-full flex'>
            <div className='m-auto text-center'>
                <img src="/logo.png" className="h-16 mx-auto" alt="Wagon Logo" />
                <h5 className="text-xl font-bold mt-5">
                    Please, connect your wallet
                </h5>
                <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                    Pelase connect your wallet to see your staking dashboard.
                </p>
                <div className='w-full flex justify-center'>
                    <ButtonConnect/>
                </div>
            </div>
        </div>
    )
  }