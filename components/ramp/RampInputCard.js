import { numberWithCommas } from "../../util/stringUtility";

export default function RampInputCard(props) {

    const token = props.token;
    const amount = props.amount;

    return (
        <div className="mt-2 border rounded-xl overflow-hidden">
            <div className='flex gap-2 items-center justify-between mt-2 px-4 pb-2'>
                <input 
                    type="text"
                    disabled={true}
                    min="0"
                    value={numberWithCommas(amount, (props.token == "IDRT") ? 2 : 4)}
                    className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none grow" 
                    placeholder="0" required
                />
                <div className="flex gap-2 items-center hover:cursor-pointer">
                    <div className='relative h-10 w-10'>
                        <img src={token?.logo} className="h-10 w-10 rounded-full border-2" alt="Token Logo" />
                        <div className='absolute -bottom-2 -right-2 bg-white rounded-full overflow-hidden border-2'>
                            <img src={token?.network_logo} className="h-6 w-6 p-1" alt="Token Logo" />
                        </div>
                    </div>
                    <p className="text-sm font-semibold">
                    {
                        token?.name
                    }
                    </p>
                </div>
            </div>
        </div>
    )
  }