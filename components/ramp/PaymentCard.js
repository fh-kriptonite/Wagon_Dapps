import { Button } from "flowbite-react";

import paymentMethodsJson from "../../public/files/rampPayment.json"
import { BiArrowBack } from "react-icons/bi";

export default function PaymentCard(props) {

    const paymentMethod = props.paymentMethod;

    return (
        <div className="h-full flex items-center">

            <div className="card max-w-md mx-auto w-96">
                
                <div className="hover:cursor-pointer w-fit"
                    onClick={props.back}
                >
                    <BiArrowBack/>
                </div>

                <p className="text-sm mt-4 font-bold">Select your payment method?</p>

                <div className="mt-4">
                    {
                        paymentMethodsJson.map((method, index) => {
                            return (
                                <div 
                                    key={method.name}
                                    className={`px-2 py-3 flex items-center gap-4 hover:cursor-pointer hover:bg-blue-100 ${paymentMethod === method ? "bg-blue-100" : ""}`}
                                    onClick={() => {
                                        props.setPaymentMethod(method)
                                    }}
                                >
                                    <img src={method.logo} className="h-7" alt="Wagon Logo"/>
                                    <div>
                                        <p className='text-sm'>{method.name}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="mt-4 w-full">
                    {
                        <Button color="dark" style={{width:"100%"}}
                            disabled={props.valueFiat == ""}
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
