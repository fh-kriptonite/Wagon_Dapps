import { useState } from "react";

import fiatJson from "../../public/files/rampFiat.json";
import tokenJson from "../../public/files/rampToken.json";
import paymentJson from "../../public/files/rampPayment.json";

import RampCard from "./RampCard";
import PaymentCard from "./PaymentCard";
import DetailCard from "./DetailCard";
import VACard from "./VACard";
import useGetVAHook from "./util/useGetVAHook";
import { useAccount } from "@particle-network/connectkit";

export default function RampHome(props) {
    const address = useAccount();

    const [fiat, setFiat] = useState(fiatJson[0]);
    const [tokens, setTokens] = useState([tokenJson[1]]);
    const [tokenValues, setTokenValues] = useState([""]);
    const [paymentMethod, setPaymentMethod] = useState(paymentJson[0]);
    const [valueFiat, setValueFiat] = useState("");
    const [platformFee, setPlatformFee] = useState(null)
    const [gasFee, setGasFee] = useState(null)
    const [vaDetail, setVaDetail] = useState(null)

    const { isLoading: isLoadingVA, fetchData: getVA } = useGetVAHook();

    const [section, setSection] = useState(0);

    function reset() {
        setFiat(fiatJson[0]);
        setTokens([tokenJson[1]]);
        setTokenValues([""]);
        setPaymentMethod(paymentJson[0]);
        setValueFiat("");
        setPlatformFee(null);
        setGasFee(null);
    }

    async function processVA() {
        // prepare onramp details
        let swaps = [];
        for(let i=0; i<tokenValues.length;i++) {
            swaps[i]={
                amount: tokenValues[i],
                to:tokens[i].name,
                chain:tokens[i].network
            }
        }
        // create VA
        const gasFeeAmount = Math.ceil(parseFloat(gasFee.fee));
        const platformFeeAmount = Math.ceil(parseFloat(platformFee));
        const valueFiatAmount = Math.ceil(parseFloat(valueFiat));
        const totalAmount = valueFiatAmount + platformFeeAmount + gasFeeAmount;
        try {
            const response = await getVA(address, paymentMethod.value, totalAmount, valueFiatAmount, platformFeeAmount, gasFeeAmount, swaps);
            if(response.error) {
                throw response.error;
            }
            setVaDetail(response.data);
            setSection(3);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="h-full flex items-center justify-center">

            {/* section 1 - choose fiat, token, input value */}
            {
                (section == 0) &&
                <RampCard 
                    fiat={fiat} setFiat={setFiat} 
                    tokens={tokens}
                    tokenValues={tokenValues}
                    valueFiat={valueFiat} setValueFiat={(newValue)=>{
                        setValueFiat(newValue);
                        if(tokens.length == 1) {
                            setTokenValues([newValue]);
                        }
                    }}
                    addToken={(newToken)=>{
                        setTokens((prevTokens) => [...prevTokens, newToken]);
                        setTokenValues((prevTokenValues) => [...prevTokenValues, newToken]);
                    }}
                    removeToken={(index)=>{
                        setTokens((prevTokens) => prevTokens.filter((_, i) => i !== index));
                        if(tokenValues.length == 2) {
                            setTokenValues([valueFiat]);
                        } else {
                            setTokenValues((prevTokenValues) => prevTokenValues.filter((_, i) => i !== index));
                        }
                    }}
                    replaceToken={(index, newToken)=>{
                        setTokens((prevTokens) => prevTokens.map((token, i) => i === index ? newToken : token));
                    }}
                    replaceTokenValues={(index, newTokenValue)=>{
                        setTokenValues((prevTokenValues) => prevTokenValues.map((tokenValues, i) => i === index ? newTokenValue : tokenValues));
                    }}
                    next={()=>{
                        setSection(1)
                    }}
                />
            }

            {/* section 2 - choose payment method */}
            {
                (section == 1) &&
                <PaymentCard
                    paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                    back={()=>{
                        setSection(0)
                    }}
                    next={()=>{
                        setGasFee(null);
                        setPlatformFee(null);
                        setSection(2)
                    }}
                />
            }

            {/* section 3 - detail and fee */}
            {
                (section == 2) &&
                <DetailCard 
                    fiat={fiat}
                    tokens={tokens}
                    valueFiat={valueFiat}
                    tokenValues={tokenValues}
                    platformFee={platformFee} setPlatformFee={setPlatformFee}
                    gasFee={gasFee} setGasFee={setGasFee}
                    isLoadingVA={isLoadingVA}
                    back={()=>{
                        setSection(1)
                    }}
                    next={()=>{
                        processVA();
                    }}
                />
            }

            {/* section 4 - VA instruction */}
            {
                (section == 3) &&
                <VACard 
                    fiat={fiat}
                    valueFiat={valueFiat}
                    paymentMethod={paymentMethod}
                    platformFee={platformFee}
                    gasFee={gasFee}
                    vaDetail={vaDetail}
                    next={()=>{
                        reset();
                        setSection(0)
                    }}
                />
            }

        
        </div>
        
    )
  }
