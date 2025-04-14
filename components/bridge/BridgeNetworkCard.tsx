import { useEffect, useState } from "react"
import { numberWithCommas } from "../../util/stringUtility"
import SelectNetworkDialog from "./dialog/SelectNetworkDialog";
import { getERC20NetworkBalanceService } from "../../services/service_erc20"
import { Network } from "./types";

import { useConnectedAddress } from "@/hooks/useConnectedAddress";
interface BridgeNetworkCardProps {
    number: string;
    setNumber: (number: string) => void;
    otherNetwork: Network | null;
    network: Network | null;
    setNetwork: (network: Network) => void;
    primary: boolean;
    setBalance: (balance: number) => void;
}

export default function BridgeNetworkCard(props: BridgeNetworkCardProps) {
    const { number, setNumber, otherNetwork, network, setNetwork, primary, setBalance } = props;
    const [balance, setBalanceState] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { connectedAddress } = useConnectedAddress();

    async function getBalance(): Promise<void> {
        if(!primary)  return;

        try {
            setIsLoading(true);
            if (!network?.wagAddress || !network?.rpc || !connectedAddress) {
                return;
            }
            const wagBalance = await getERC20NetworkBalanceService(
                network.wagAddress, 
                connectedAddress, 
                network.rpc
            );

            setBalanceState(wagBalance);
            setBalance(wagBalance);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // get the balance
        if(network && connectedAddress) {
            getBalance();
        }
    }, [network, connectedAddress]);

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
                    <SelectNetworkDialog 
                        otherNetwork={otherNetwork} 
                        network={network} 
                        setNetwork={setNetwork} 
                        id={primary ? 1 : 2}
                    />
                </div>
            </div>
            <div className='flex gap-2 items-center justify-between mt-2 px-4 pb-2'>
                {primary && (
                    <button
                        type="button"
                        onClick={() => {
                            if (balance !== null) {
                                setNumber(balance.toString());
                            }
                        }}
                        className="button-max text-sm"
                    >
                        Max
                    </button>
                )}
                <input 
                    type="number"
                    disabled={!primary}
                    min="0"
                    className="text-gray-900 border-none focus:ring-0 outline-none text-2xl w-full focus:outline-none grow" 
                    value={number}
                    onChange={(e) => {
                        const inputNumber = e.target.value;
                        // Check if the input is a valid number
                        if (!isNaN(Number(inputNumber))) {
                            setNumber(inputNumber); // Update the state only if it's a valid number
                        }
                    }}
                    placeholder="0" 
                    required
                />

                {primary && (
                    <div className="flex-none w-1/3 text-right">
                        <p className="text-xs font-semibold text-gray-500">
                            Balance
                        </p>
                        <p className="text-xs font-semibold text-gray-500">
                            { 
                                balance === null || isLoading
                                ? "--"
                                : numberWithCommas(balance)
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 