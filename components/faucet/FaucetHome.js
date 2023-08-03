import { Spinner } from "flowbite-react";
import { useRef, useState } from "react";
import Captcha from "./Captcha";

export default function FaucetHome(props) {
    const [token, setToken] = useState("");
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [txHash, setTxHash] = useState("");
    const captchaRef = useRef(null);

    const submit = async () => {
        setIsLoading(true);

        const response = await fetch('/api/getWag', {
            method: 'POST',
            body: JSON.stringify({address, token}),
            headers: {
                'Content-Type': 'application/json; charset=utf8'
            },
        });
        const data = await response.json();
        
        if(response.status == 200){
            if(data.status == "success") {
                setTxHash(data.transactionHash);
                setError("");
            } else if(data.status == "failed"){
                if(data.message == "Error: maxFeePerGas cannot be less than maxPriorityFeePerGas (The total must be the larger of the two)") {
                    setTxHash("");
                    setError("Arbitrum Goerli traffic is high right now, please try again later.");
                } else {
                    setTxHash("");
                    setError(data.message);
                }
            } else {
                setTxHash("");
                setError("Something went wrong. Please try again later.");    
            }
            setIsLoading(false);
        } else {
            setTxHash("");
            setError("Something went wrong. Please try again later.");
            setIsLoading(false);
        }
    }

    return (
        <>
            <h1 className="text-3xl text-center font-bold mb-4">Wagon Faucet</h1>
            <h6 className="text-lg text-center font-semibold mb-8">Fast and reliable. 100 Goerli WAG/day</h6>

            <div className="card mx-auto">
                {
                    (isLoading)
                    ? <div className="text-center">
                        <Spinner/>
                    </div>
                    : <div className="flex items-center gap-4 flex-col lg:flex-row">
                        <input type="text" id="address" 
                            className="text-gray-900 text-lg w-full rounded-lg p-4" 
                            onChange={(e)=>{
                                setAddress(e.target.value)
                            }}
                            placeholder="Enter your Wallet Address(0x...)" 
                            required/>

                        <button
                            type="button"
                            onClick={submit}
                            className="button-light !w-64 mx-auto"
                        >
                            Send Me WAG
                        </button>
                    </div>
                }
                {
                    (txHash != "") &&
                    <div className="mt-4">
                        <p className="font-semibold text-sm"> Your Transaction </p>
                        <a href={process.env.GOERLI_TX_EXPLORER + txHash}  
                            target={"_blank"} 
                            rel="noreferrer"
                            className="font-semibold text-sm text-blue-600 hover:text-blue-800 underline"> {txHash} </a>
                    </div>
                }
                {
                    (error != "") &&
                    <div className="mt-4">
                        <p className="text-red-600 font-semibold text-sm"> {error} </p>
                    </div>
                }
            </div>
            

            <div className="mt-4">
                <Captcha setToken={(token)=>{
                    setToken(token)
                }}
                captchaRef={captchaRef}
                />
            </div>
            
            <div className="card mt-4">
                <h6 className="text-2xl font-semibold mb-4">FAQs</h6>
                <p className="font-semibold mb-1">
                    How do I use this?
                </p>
                <p>
                    To request funds, simply enter your wallet address, and hit “Send Me WAG“.
                </p>

                <p className="font-semibold mb-1 mt-8">
                    How does it work?
                </p>
                <p>
                    You can request 100 Goerli WAG every 24h!
                </p>

                <p className="font-semibold mb-1 mt-8">
                    What is a testnet Wagon faucet?
                </p>
                <p>
                    A Wagon faucet is a developer tool to get testnet Wagon (WAG) in order to test and interact with wagon network application or protocol before going live on Ethereum mainnet, where one must use real Wagon.
                </p>
            </div>


        </>
    )
}