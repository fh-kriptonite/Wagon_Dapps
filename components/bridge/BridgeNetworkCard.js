import { useEffect, useState } from "react"
import { numberWithCommas } from "../../util/stringUtility"
import SelectNetworkDialog from "./dialog/SelectNetworkDialog";
import { getERC20NetworkBalanceService } from "../../services/service_erc20.js"
import { useAccount } from "wagmi";

export default function BridgeNetworkCard(props) {

    const number = props.number;
    const [balance, setBalance] = useState(null)
    const [isLoading, setIsloading] = useState(null)
    const network = props.network;

    const { address } = useAccount();

    async function getBalance() {
        try {
            setIsloading(true)
            const wagBalance = await getERC20NetworkBalanceService(network.wagAddress, address, network.rpc, network.chainId)
            setBalance(wagBalance);
            setIsloading(false)
        } catch (error) {
            console.log(error);
            setIsloading(false)
        }
    }

    useEffect(()=>{
        // get the balance
        if(network != null) {
            getBalance();
        }
    }, [network])

    return (
        <div className="mt-2 border rounded-xl overflow-hidden">
            <div className='flex items-center justify-between bg-blue-100'>
                <div className="flex items-center gap-4 px-4 py-2 flex-none w-3/5">
                    <div className="rounded-full bg-white p-3">
                        <img src="/logo.png" className="h-7" alt="Wagon Logo"/>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs">
                            Token
                        </p>
                        <p className="text-sm font-semibold">
                            WAG
                        </p>
                    </div>
                </div>
                <div className="border-l border-white p-4 grow space-y-1">
                    <p className="text-xs">
                        Network
                    </p>
                    <SelectNetworkDialog otherNetwork={props.otherNetwork} network={network} setNetwork={props.setNetwork}/>
                </div>
            </div>
            <div className='flex gap-2 items-center justify-between mt-2 px-4 pb-2'>
                {
                    props.primary &&
                    <button
                        type="button"
                        onClick={() => {
                            props.setNumber(balance)
                        }}
                        className="button-max text-sm"
                    >
                        Max
                    </button>
                }
                <input type="number" id="amount" 
                    disabled={!props.primary}
                    min="0"
                    className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none grow" 
                    value={number}
                    onChange={(e)=>{
                        props.setNumber(e.target.value)
                    }}
                    placeholder="0" required/>

                {
                    props.primary &&
                    <div className="flex-none w-1/3 text-right">
                        <p className="text-xs font-semibold text-gray-500">
                            Balance
                        </p>
                        <p className="text-xs font-semibold text-gray-500">
                            { 
                                balance == null || isLoading
                                ? "--"
                                : numberWithCommas(balance)
                            }
                        </p>
                    </div>
                }
            </div>
        </div>
    )
  }