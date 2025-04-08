import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ImCross } from "react-icons/im"
import { IoIosArrowDown } from "react-icons/io";

import networksTestnet from "../../../public/files/bridgeNetworks-testnet.json"
import networksMainnet from "../../../public/files/bridgeNetworks.json"
import { Network } from "../types";

interface SelectNetworkDialogProps {
    network: Network | null;
    otherNetwork: Network | null;
    setNetwork: (network: Network) => void;
    id: number;
}

export default function SelectNetworkDialog(props: SelectNetworkDialogProps) {
    const { network, otherNetwork, setNetwork, id } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function closeModal(): void {
        setIsOpen(false);
    }

    function openModal(): void {
        setIsOpen(true);
    }

    let networks: Network[] = networksMainnet;

    if(process.env.BRIDGE_NETWORK_FILE === "testnet") {
        networks = networksTestnet;
    }
    
    return (
        <>
            <div>
                <div className="flex gap-2 items-center hover:cursor-pointer"
                    onClick={openModal}
                >
                    <p className="text-sm font-semibold">{network === null ? "Select" : network.name}</p>  
                    <IoIosArrowDown/>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => {}}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className='flex justify-between'>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Network
                                        </Dialog.Title>
                                        <button onClick={() => closeModal()}>
                                            <ImCross/>
                                        </button>
                                    </div>

                                    <div className='h-[360px] mt-6 overflow-auto'>
                                        {networks.map((networkItem) => {
                                            if(networkItem.name !== otherNetwork?.name) {
                                                return (
                                                    <div 
                                                        key={`${id}_${networkItem.name}`}
                                                        className='px-2 py-3 flex items-center gap-4 hover:cursor-pointer'
                                                        onClick={() => {
                                                            setNetwork(networkItem);
                                                            closeModal();
                                                        }}
                                                    >
                                                        <img src={networkItem.logo || ""} className="h-7" alt="Network Logo"/>
                                                        <div>
                                                            <p className='text-sm'>{networkItem.name}</p>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                    
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
} 