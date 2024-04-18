export default function LoadingPoolDetailCard() {
  return (
    <>
        <div className='card space-y-4 sticky animate-pulse top-20'>
            <div className='flex-1 flex flex-col md:flex-row items-center gap-4'>
                <div className="flex-none card !p-2 !bg-gray-300">
                <div className="h-32 w-32 flex items-center justify-center"> 
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                    </svg>
                </div>
                </div>
            
                <div className='flex flex-col md:ml-10 gap-4'>
                    <div className="grow">
                        <div className="bg-gray-300 h-5 w-64 rounded-full"></div>
                        <div className="bg-gray-300 h-3 w-32 rounded-full mt-2"></div>
                    </div>
                    <div className='flex gap-4'>
                    <div className='flex-none h-3 w-40 flex items-center gap-1 bg-gray-300 px-4 py-1 rounded-xl'/>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="h-3 w-full bg-gray-300 rounded-full"/>
                <div className="h-3 w-full bg-gray-300 rounded-full"/>
                <div className="h-3 w-full bg-gray-300 rounded-full"/>
                <div className="h-3 w-full bg-gray-300 rounded-full"/>
                <div className="h-3 w-full bg-gray-300 rounded-full"/>
                <div className="h-3 w-1/2 bg-gray-300 rounded-full"/>
            </div>

            <div className="space-y-2">
                <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                <div className="h-3 w-2/6 bg-gray-300 rounded-full"/>
            </div>

            <div>
                <div className='flex border-t justify-between py-4'>
                <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                </div>
                <div className='flex border-t justify-between py-4'>
                <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                <div className="h-3 w-1/6 bg-gray-300 rounded-full"/>
                </div>
            </div>
        </div>
    </>
  );
};