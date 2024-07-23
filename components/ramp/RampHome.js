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
import ActivityCard from "./ActivityCard";
import ActivityDetailCard from "./ActivityDetailCard";

export default function RampHome(props) {
    const address = useAccount();

    const [fiat, setFiat] = useState(fiatJson[0]);
    const [tokens, setTokens] = useState([tokenJson[1]]);
    const [tokenValues, setTokenValues] = useState([""]);
    const [paymentMethod, setPaymentMethod] = useState(paymentJson[0]);
    const [platformFee, setPlatformFee] = useState(null);
    const [gasFee, setGasFee] = useState(null);
    const [vaDetail, setVaDetail] = useState(null);

    const [transactionId, setTransactionId] = useState(null);

    const { isLoading: isLoadingVA, fetchData: getVA } = useGetVAHook();

    const [section, setSection] = useState(0);

    function getTotalFiat() {
        let total = 0;
        for(let i=0; i<tokenValues.length; i++) {
            const amount = parseFloat(tokenValues[i]);
            total += amount;
        }
        return total;
    }

    function reset() {
        setFiat(fiatJson[0]);
        setTokens([tokenJson[1]]);
        setTokenValues([""]);
        setPaymentMethod(paymentJson[0]);
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
        const valueFiatAmount = Math.ceil(getTotalFiat());
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

    function handleNavButtonBuy() {
        if(section == 4) {
            setSection(0);
        }
    }

    return (
        <div className="h-full flex items-center justify-center flex-col">
            <div className="card mx-auto w-full max-w-md space-y-4">
                <div className="flex gap-4">
                    {
                        (section != 5) &&
                        <div className="hover:cursor-pointer" onClick={handleNavButtonBuy}>
                            <p className={`text-lg ${section != 4 ? "font-bold" : "text-gray-500"}`}>Buy</p>
                        </div>
                    }

                    {
                        (section == 0 || section == 4) &&
                        <div className="hover:cursor-pointer" onClick={()=>{setSection(4)}}>
                            <p className={`text-lg ${section == 4 ? "font-bold" : "text-gray-500"}`}>Activity</p>
                        </div>
                    }
                </div>

                {/* section 1 - choose fiat, token, input value */}
                {
                    (section == 0) &&
                    <RampCard 
                        fiat={fiat} setFiat={setFiat} 
                        tokens={tokens}
                        tokenValues={tokenValues}
                        gasFee={gasFee} setGasFee={setGasFee}
                        valueFiat={tokenValues[0]} setValueFiat={(newValue)=>{
                            setTokenValues([newValue]);
                        }}
                        addToken={(newToken)=>{
                            setTokens((prevTokens) => [...prevTokens, newToken]);
                            setTokenValues((prevTokenValues) => [...prevTokenValues, newToken]);
                        }}
                        removeToken={(index)=>{
                            setTokens((prevTokens) => prevTokens.filter((_, i) => i !== index));
                            setTokenValues((prevTokenValues) => prevTokenValues.filter((_, i) => i !== index));
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
                        valueFiat={getTotalFiat()}
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
                        valueFiat={getTotalFiat()}
                        paymentMethod={paymentMethod}
                        platformFee={platformFee}
                        gasFee={gasFee}
                        vaDetail={vaDetail}
                        next={()=>{
                            reset();
                            setSection(4)
                        }}
                    />
                }

                {/* section 5 - activity history */}
                {
                    (section == 4) &&
                    <ActivityCard 
                        showDetail={(transactionId)=>{
                            setTransactionId(transactionId);
                            setSection(5);
                        }}
                    />
                }

                {/* section 5 - activity history */}
                {
                    (section == 5) &&
                    <ActivityDetailCard
                        transactionId={transactionId}
                        back={()=>{setSection(4)}}
                    />
                }

            </div>
        </div>
        
    )
  }
