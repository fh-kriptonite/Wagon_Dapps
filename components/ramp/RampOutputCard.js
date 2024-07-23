import { IoIosArrowForward } from "react-icons/io";
import SelectTokenDialog from "./dialog/SelectTokenDialog";
import { numberWithCommas } from "../../util/stringUtility";
import useGetGasFeeHook from "./util/useGetGasFeeHook";
import { useEffect, useState, useRef } from "react";

export default function RampOutputCard(props) {
  const value = props.value;
  const index = props.index;
  const token = props.token;
  const fiat = props.fiat;

  const [amountOutput, setAmountOutput] = useState(0);

  const { isLoading: isLoadingGas, fetchData: getGasFee } = useGetGasFeeHook();

  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    if (token && value) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        const chainId = "bsc";
        const amount = value;
        let swaps = [
          {
            amount: value,
            to: token?.name,
          },
        ];

        const response = await getGasFee(chainId, amount, swaps);
        if (response.data) {
          setAmountOutput(response.data.output_amounts[0].amount);
        }
      }, 1000); // 1 second delay
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [token, value]);

  return (
    <div className="px-2 border rounded-lg py-4">
      <div className="flex items-center justify-around gap-2 md:gap-4">
        <div className="grow flex gap-2 items-center">
          <input
            type="text"
            min="0"
            value={numberWithCommas(value)}
            className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none grow"
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              props.replaceTokenValues(index, rawValue);
            }}
            placeholder="0"
            required
          />
          <p className="text-sm font-semibold"> {fiat.name}</p>
        </div>
        <div className="flex-initial w-fit">
          <IoIosArrowForward />
        </div>
        <div className="flex-initial w-fit">
          <SelectTokenDialog index={index} token={token} {...props} />
        </div>
      </div>
      <div className="border-t my-4" />
      <div className="px-4">
        {isLoadingGas ? (
          <p className="text-lg text-end">Estimating...</p>
        ) : (
          <p className="text-lg text-end">
            {numberWithCommas(amountOutput, token?.name === "IDRT" ? 2 : 5)}
            <span className="font-bold"> {token?.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
