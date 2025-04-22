import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Spinner } from 'flowbite-react';
import { Network } from "../types";
import { HiArrowPath } from "react-icons/hi2";

interface BridgeDialogProps {
    number: string;
    network1: Network | null;
    network2: Network | null;
    isOpen: boolean;
}

export default function BridgeDialog(props: BridgeDialogProps) {
    const { number, network1, network2, isOpen } = props;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[1001]" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <HiArrowPath className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold text-gray-900"
                                    >
                                        Bridging Tokens
                                    </Dialog.Title>
                                </div>

                                {/* Content */}
                                <div className="space-y-6">
                                    {/* Loading Spinner */}
                                    <div className="flex justify-center">
                                        <Spinner size="xl" color="blue" />
                                    </div>

                                    {/* Transfer Details */}
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Amount</span>
                                            <span className="text-sm font-medium text-gray-900">{number} WAG</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">From</span>
                                            <span className="text-sm font-medium text-gray-900">{network1?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">To</span>
                                            <span className="text-sm font-medium text-gray-900">{network2?.name}</span>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Please check your wallet for transaction prompt.
                                        </p>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 