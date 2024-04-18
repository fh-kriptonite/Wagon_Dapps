export default function PoolRepaymentTermCard(props) {

    const poolJson = props.poolJson;
    
    return (
    <div className='card space-y-6'>
        <h6 className="!font-semibold">Repayment terms</h6>
        {
            poolJson == null
            ? <div>
                <div className='flex'>
                <div className='flex-1 p-4 border rounded-tl-lg'>
                    <p className='text-sm font-light'>Repayment structure</p>
                    <div className="h-5 w-full bg-gray-300 rounded-full mt-2"/>
                </div>
                <div className='flex-1 p-4 border border-l-0 rounded-tr-lg'>
                    <p className='text-sm font-light'>Loan term</p>
                    <div className="h-5 w-full bg-gray-300 rounded-full mt-2"/>
                </div>
                </div>
                <div className='flex'>
                <div className='flex-1 p-4 border border-t-0'>
                    <p className='text-sm font-light'>Term start date</p>
                    <div className="h-5 w-full bg-gray-300 rounded-full mt-2"/>
                </div>
                <div className='flex-1 p-4 border border-t-0 border-l-0'>
                    <p className='text-sm font-light'>Loan maturity date</p>
                    <div className="h-5 w-full bg-gray-300 rounded-full mt-2"/>
                </div>
                </div>
                <div className='flex'>
                <div className='flex-1 p-4 border border-t-0 rounded-bl-lg'>
                    <p className='text-sm font-light'>Payment Frequency</p>
                    <div className="h-5 w-full bg-gray-300 rounded-full mt-2"/>
                </div>
                <div className='flex-1 p-4 border border-t-0 border-l-0 rounded-br-lg'>
                    <p className='text-sm font-light'>Total payments</p>
                    <div className="h-5 w-full bg-gray-300 rounded-full mt-2"/>
                </div>
                </div>
            </div>
            : <div>
                <div className='flex'>
                    <div className='flex-1 p-4 border rounded-tl-lg'>
                        <p className='text-sm font-light'>Repayment structure</p>
                        <p className='text-xl font-semibold mt-1'>{poolJson.properties.repayment_structure}</p>
                    </div>
                    <div className='flex-1 p-4 border border-l-0 rounded-tr-lg'>
                        <p className='text-sm font-light'>Loan term</p>
                        <p className='text-xl font-semibold mt-1'>{poolJson.properties.term}</p>
                    </div>
                </div>
                <div className='flex'>
                    <div className='flex-1 p-4 border border-t-0'>
                        <p className='text-sm font-light'>Term start date</p>
                        <p className='text-xl font-semibold mt-1'>{poolJson.properties.term_start}</p>
                    </div>
                    <div className='flex-1 p-4 border border-t-0 border-l-0'>
                        <p className='text-sm font-light'>Loan maturity date</p>
                        <p className='text-xl font-semibold mt-1'>{poolJson.properties.term_end}</p>
                    </div>
                </div>
                <div className='flex'>
                    <div className='flex-1 p-4 border border-t-0 rounded-bl-lg'>
                        <p className='text-sm font-light'>Payment Frequency</p>
                        <p className='text-xl font-semibold mt-1'>{poolJson.properties.payment_freuency}</p>
                    </div>
                    <div className='flex-1 p-4 border border-t-0 border-l-0 rounded-br-lg'>
                        <p className='text-sm font-light'>Total payments</p>
                        <p className='text-xl font-semibold mt-1'>{poolJson.properties.total_payment}</p>
                    </div>
                </div>
            </div>
        }
    </div>
  );
};