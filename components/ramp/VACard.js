import { Button } from "flowbite-react";
import { useAccount } from "@particle-network/connectkit";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import { IoMdCopy } from "react-icons/io";
import { useState } from "react";
import CountdownTimer from "../general/CountdownTimer";
import ExpiredTimer from "../general/ExpiredTimer";
import { numberWithCommas } from "../../util/stringUtility";

export default function VACard(props) {
    const address = useAccount();
    const paymentMethod = props.paymentMethod;

    const vaDetail = props.vaDetail;

    const [alert, setAlert] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          setAlert(true);
          setTimeout(() => {
            setAlert(false);
          }, 2000); // Hide alert after 2 seconds
        }).catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    };

    return (
        <div className="h-full flex flex-col justify-center items-center">
            
            <div className="card max-w-md mx-auto relative">
                {
                    alert &&
                    <div className="absolute top-0 left-0 w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
                        <span className="block sm:inline">Copied to clipboard!</span>
                    </div>
                }

                <p className="text-sm font-bold mt-4">Buy</p>

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

                <div className="p-2 border mt-4 flex gap-4 items-center">
                    <div className="flex-1">
                        <p className="text-sm">Virtual Account Number</p>
                        <div className="flex gap-2 items-center">
                            <p className="text-lg">{vaDetail.account_number}</p>
                            <div 
                                className="hover:cursor-pointer"
                                onClick={()=>{
                                    copyToClipboard(vaDetail.account_number)
                                }}
                            >
                                <IoMdCopy />
                            </div>
                        </div>

                        <p className="text-sm mt-4">Virtual Account Name</p>
                        <p className="text-lg">{vaDetail.name}</p>

                        <p className="text-sm mt-4">Amount to Pay</p>
                        <p className="text-lg">IDR {numberWithCommas(vaDetail.expected_amount)}</p>

                        <p className="text-sm mt-4">Expired at</p>
                        <ExpiredTimer targetEpoch={new Date(vaDetail.expiration_date).getTime()}/>
                    </div>
                    <div className="flex-1">
                        <img src={paymentMethod.logo} className="w-full" alt="Payment Logo"/>
                    </div>
                </div>

                <div className="mt-4 w-full">
                    <Button color="dark" style={{width:"100%"}}
                        disabled={props.valueFiat == ""}
                        onClick={()=>{
                            props.next()
                        }}
                    >
                        Done
                    </Button>
                </div>

            </div>

        </div>
        
    )
  }
