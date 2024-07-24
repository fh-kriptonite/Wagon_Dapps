import { inputNumberFilter, inputNumberWithCommas, numberWithCommas } from "../../util/stringUtility";
import SelectFiatDialog from "./dialog/SelectFiatDialog";

export default function RampInputFiatCard(props) {

    const disabled = props.disabled;
    
    function showError() {
        if(props.valueFiat == "") return false;
        if(props.valueFiat < 50000) {
            return true
        }
        return false;
    }

    function handleChange(e) {
        const rawValue = inputNumberFilter(e.target.value);
        props.setValueFiat(rawValue);
    }

    return (
        <>
            <div className="mt-2 border rounded-xl overflow-hidden">
                <div className='flex gap-2 items-center justify-between mt-2 px-4 pb-2'>
                    <input 
                        type="text"
                        disabled={disabled}
                        min="0"
                        value={inputNumberWithCommas(props.valueFiat)}
                        className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none grow" 
                        onChange={handleChange}
                        placeholder="0" 
                        required
                    />
                    <SelectFiatDialog {...props}/>
                </div>
            </div>
            {
                showError() &&
                <p className="text-xs text-red-500 mt-2">
                    Minimum purchase 50,000 IDR
                </p>
            }
        </>
    )
  }