import { IoIosArrowDown, IoIosArrowForward, IoMdAdd } from "react-icons/io";
import { Button } from "flowbite-react";
import { useAccount } from "@particle-network/connectkit";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import RampInputFiatCard from "./RampInputFiatCard";

import SelectTokenDialog from "./dialog/SelectTokenDialog";
import { numberWithCommas } from "../../util/stringUtility";
import useGetGasFeeHook from "./util/useGetGasFeeHook";
import { useEffect } from "react";
import RampOutputCard from "./RampOutputCard";

export default function RampCard(props) {
    const address = useAccount();

    const tokens = props.tokens;
    const fiat = props.fiat;
    const tokenValues = props.tokenValues;
    const valueFiat = props.valueFiat;
    const gasFee = props.gasFee;

    function handleTransferButtonDisabled() {
        if(valueFiat == "") return true;
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === null) {
                return true;
            }
        }
        return false;
    }

    return (
        <div>
            <div className="bg-blue-100 py-4 mt-4 flex gap-4 px-4 items-center rounded-lg">
                <div className="flex-initial w-fit flex items-center">
                    <Jazzicon diameter={32} seed={jsNumberForAddress(address)}/>
                </div>
                <div className="grow overflow-hidden">
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
                {
                    tokens.length <= 1 &&
                    <>
                        <RampInputFiatCard {...props} disabled={false}/>
                        <div className="w-full mt-6">
                            <IoIosArrowDown className="mx-auto"/>
                        </div>
                    </>
                }
            </div>

            <div className="space-y-4 mt-6">
                {
                    tokens.map((token, index)=>{
                        let amountOutput = 0;
                        if(gasFee) {
                            amountOutput = gasFee?.output_amounts[index]?.amount;
                        }
                        return (
                            <>
                                {
                                    index > 0 && 
                                    <div className="flex justify-center">
                                        <IoMdAdd/>
                                    </div>
                                }
                                <div key={"token-"+index}>
                                    <RampOutputCard fiat={fiat} token={token} index={index} value={tokenValues[index]} {...props}/>
                                </div>
                            </>
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
        
    )
  }
