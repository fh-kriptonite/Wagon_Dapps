import { MdAccountBalance } from "react-icons/md";

interface OfframpTabProps {
    offramp_enabled?: boolean;
}

export default function OfframpTab({ offramp_enabled }: OfframpTabProps) {
    return (
        <div className="py-4">
            <div className="flex items-center gap-2 mb-2">
                <MdAccountBalance className="w-5 h-5 text-gray-900"/>
                <h5 className="font-semibold">Offramp Services</h5>
            </div>
            <div className="pl-7">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${offramp_enabled ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                    <p className="text-sm">
                        {offramp_enabled ? 'Offramp Enabled' : 'Offramp Pending'}
                    </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {offramp_enabled
                        ? 'You can withdraw funds to your bank account'
                        : 'Complete verification to enable fiat withdrawals'}
                </p>
            </div>
        </div>
    );
} 