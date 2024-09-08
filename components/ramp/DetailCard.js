import { Button } from "flowbite-react";
import { useAccount } from "@particle-network/connectkit";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import RampInputFiatCard from "./RampInputFiatCard";
import RampInputCard from "./RampInputCard";
import { BiArrowBack } from "react-icons/bi";
import useGetPlatformFeeHook from "./util/useGetPlatformFeeHook";
import { useEffect, useState } from "react";
import { numberWithCommas } from "../../util/stringUtility";
import useGetGasFeeHook from "./util/useGetGasFeeHook";

export default function DetailCard(props) {
    const address = useAccount();
    const tokens = props.tokens;
    const tokenValues = props.tokenValues;

    const platformFee= props.platformFee;
    const gasFee= props.gasFee;

    const isLoadingVA = props.isLoadingVA;

    const { isLoading: isLoadingPlatform, fetchData:getPlatformFee } = useGetPlatformFeeHook();
    const { isLoading: isLoadingGas, fetchData:getGasFee } = useGetGasFeeHook();

    async function getPlatformFees() {
        const response = await getPlatformFee();
        props.setPlatformFee(response.data);
    }

    async function getGasFees() {
        const chainId = "bsc";
        const amount = props.valueFiat;
        let swaps = [];
        for(let i=0; i<tokenValues.length;i++) {
            swaps[i]={
                amount: tokenValues[i],
                to:tokens[i].name
            }
        }
        
        const response = await getGasFee(chainId, amount, swaps);
        props.setGasFee(response.data);
    }

    useEffect(()=>{
        getPlatformFees();
        getGasFees();
    }, [])

    function handleButtonDisabled() {
        if(isLoadingPlatform) return true;
        if(isLoadingGas) return true;
        if(props.valueFiat == "") return true;
        if(isLoadingVA) return true;
        return false;
    }

    function handleButtonLabel() {
        if(isLoadingPlatform) return "Simulating...";
        if(isLoadingGas) return "Simulating...";
        if(props.valueFiat == "") return "No Value";
        if(isLoadingVA) return "Preparing Payment..."
        return "Pay";
    }

    return (
        <div>

            <div className="hover:cursor-pointer w-fit"
                onClick={props.back}
            >
                <BiArrowBack/>
            </div>

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
                <p className="text-xs">You send exactly</p>
                <RampInputFiatCard {...props} disabled={true}/>
            </div>

            <div className="space-y-2 px-4 my-6">
                <div className="flex justify-between">
                    <p className="text-xs">Platform Fee</p>
                    <p className="text-xs font-semibold">
                        {
                            isLoadingPlatform
                            ? "~"
                            : numberWithCommas(platformFee)
                        } IDR
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-xs">Gas Fee</p>
                    <p className="text-xs font-semibold">
                        {
                            isLoadingGas && gasFee == null
                            ? "~"
                            : numberWithCommas(gasFee?.fee, 0)
                        } IDR
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <p className="text-xs">Estimation of what you will receive</p>
                {
                    tokens.map((token, index)=>{
                        let amountOutput = 0;
                        if(gasFee) {
                            amountOutput = gasFee?.output_amounts[index].amount;
                        }
                        return (
                            <div key={index}>
                                <RampInputCard token={token} {...props} amount={amountOutput}/>
                            </div>
                        )
                    }) 
                }
            </div>

            <div className="mt-4 w-full">
                {
                    <Button color="dark" style={{width:"100%"}}
                        disabled={handleButtonDisabled()}
                        onClick={()=>{
                            props.next()
                        }}
                    >
                        {handleButtonLabel()}
                    </Button>
                }
            </div>

        </div>
        
    )
  }
