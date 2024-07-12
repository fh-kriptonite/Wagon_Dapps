import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Button } from "flowbite-react";
import { useAccount } from "@particle-network/connectkit";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import RampInputFiatCard from "./RampInputFiatCard";

import SelectTokenDialog from "./dialog/SelectTokenDialog";

export default function RampCard(props) {
    const address = useAccount();

    const tokens = props.tokens;
    const fiat = props.fiat;
    const tokenValues = props.tokenValues;
    const valueFiat = props.valueFiat;

    function isSumEqual(value, array) {
        const targetValue = parseInt(value, 10);
        const sum = array.reduce((acc, curr) => acc + parseInt(curr, 10), 0);
        return sum === targetValue;
      }

    function handleTransferButtonDisabled() {
        if(valueFiat == "") return true;
        if(tokens.length > 1) {
            if(!isSumEqual(valueFiat, tokenValues)) return true;
        }
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === null) {
                return true;
            }
        }
        return false;
    }

    return (
        <div className="h-full flex items-center">

            <div className="card max-w-md mx-auto">

                <p className="text-sm font-bold">Buy</p>

                <div className="bg-blue-100 py-4 mt-4 flex gap-4 px-4 items-center rounded-lg">
                    <Jazzicon diameter={32} seed={jsNumberForAddress(address)}/>
                    <div className="grow">
                        <p className="text-xs font-bold">
                            Account
                        </p>
                        <p className="text-xs font-semibold mt-1">
                            { address }
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-xs">How much would you like to transfer?</p>
                    <RampInputFiatCard {...props} disabled={false}/>
                </div>

                <div className="w-full mt-6">
                    <IoIosArrowDown className="mx-auto"/>
                </div>

                <div className="space-y-4 mt-6">
                    {
                        tokens.map((token, index)=>{
                            return (
                                <div key={"token-"+index}>
                                    <div className="px-2 flex items-center justify-around border rounded-lg py-4 gap-4">
                                        <div className="flex-1 flex gap-2 items-center">
                                            <input type="number"
                                                min="0"
                                                disabled={tokens.length == 1}
                                                value={ tokenValues[index] }
                                                className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none grow" 
                                                onChange={(e)=>{
                                                    props.replaceTokenValues(index, e.target.value);
                                                }}
                                                placeholder="0" required
                                            />
                                            <p className="text-sm font-semibold"> { fiat.name }</p>
                                        </div>
                                        <IoIosArrowForward/>
                                        <div className="flex-initial w-1/4">
                                            <SelectTokenDialog index={index} token={token} {...props}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {
                    tokens.length < 3 &&
                    <div className="mt-2 ml-auto w-fit text-blue-700 hover:text-blue-800 hover:cursor-pointer"
                        onClick={()=>{
                            props.addToken(null)
                        }}
                    >
                        <p className="text-xs text-right">+ Add more token</p>
                    </div>
                }
                {
                    tokens.length > 1 &&
                    <div className="mt-2 ml-auto w-fit text-red-700 hover:text-red-800 hover:cursor-pointer"
                        onClick={()=>{
                            props.removeToken(tokens.length-1)
                        }}
                    >
                        <p className="text-xs text-right">- Remove token</p>
                    </div>
                }

                <div className="mt-4 w-full">
                    {
                        <Button color="dark" style={{width:"100%"}}
                            disabled={handleTransferButtonDisabled()}
                            onClick={()=>{
                                props.next()
                            }}
                        >
                            Transfer
                        </Button>
                    }
                </div>

            </div>

        </div>
        
    )
  }
