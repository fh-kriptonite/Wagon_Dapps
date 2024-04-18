export default function LoadingUserLendingStatistic() {
  return (
    <>
        <div className='card space-y-6 flex-1'>
            <h6 className="!font-semibold">Your Lending Statistics</h6>
            <div className='flex gap-4'>
                <div className='flex-1 flex items-center gap-2'>
                <div className="h-8 w-8 bg-gray-300 rounded-full"/>
                <div>
                    <p className='text-sm font-light'>Your Lending Balance</p>
                    <div className="h-3 w-1/2 bg-gray-300 rounded-full mt-1"/>
                </div>
                </div>
                <div className='flex-1 flex items-center gap-2'>
                <img src="/logo.png" className="h-8" alt="WAG Logo" />
                <div>
                    <p className='text-sm font-light'>Your Wagon Balance</p>
                    <div className="h-3 w-1/2 bg-gray-300 rounded-full mt-1"/>
                </div>
                </div>
            </div>

            <div className="h-8 w-full bg-gray-300 rounded-lg"/>
        </div>
    </>
  );
};