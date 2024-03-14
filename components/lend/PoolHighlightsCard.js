export default function PoolHighlightsCard(props) {
  
  const isLoadingDetail = props.isLoadingDetail;
  const isLoadingPool = props.isLoadingPool;
  const poolDetailErc1155 = props.poolDetailErc1155;

  return (
    <>
        {
            isLoadingDetail || isLoadingPool
            ? <div className='card space-y-6'>
                <h6 className="!font-semibold">Highlights</h6>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='card !bg-blue-100 text-slate-800 flex-1'>
                    <div className="h-2.5 w-1/2 bg-gray-300 rounded-full"/>
                    <div className="h-2 w-full bg-gray-300 rounded-full mt-2"/>
                    <div className="h-2 w-full bg-gray-300 rounded-full mt-1"/>
                    <div className="h-2 w-full bg-gray-300 rounded-full mt-1"/>
                    <div className="h-2 w-2/3 bg-gray-300 rounded-full mt-1"/>
                  </div>
                  <div className='card !bg-blue-100 text-slate-800 flex-1'>
                    <div className="h-2.5 w-1/2 bg-gray-300 rounded-full"/>
                    <div className="h-2 w-full bg-gray-300 rounded-full mt-2"/>
                    <div className="h-2 w-full bg-gray-300 rounded-full mt-1"/>
                    <div className="h-2 w-full bg-gray-300 rounded-full mt-1"/>
                    <div className="h-2 w-2/3 bg-gray-300 rounded-full mt-1"/>
                  </div>
                </div>
              </div>
            : <div className='card space-y-6'>
                <h6 className="!font-semibold">Highlights</h6>
                <div className='grid grid-cols-2 gap-4'>
                  {
                    poolDetailErc1155?.properties.highlights.map((highlight, index) => {
                      return(
                        <div className='card !bg-blue-100 text-slate-800 flex-1' key={`highligh-${index}`}>
                          <p className='text-sm font-bold'>{highlight.title}</p>
                          <p className='text-sm mt-2 text-justify'>{highlight.description}</p>
                        </div>
                      )
                    })
                  }
                </div>
            </div>
        }
    </>
  );
};