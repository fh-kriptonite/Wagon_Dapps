import { HiMiniBanknotes } from "react-icons/hi2";

interface OnrampTabProps {
    onramp_enabled?: boolean;
}

export default function OnrampTab({ onramp_enabled }: OnrampTabProps) {
    return (
        <div className="py-4">
            <div className="flex items-center gap-2 mb-2">
                <HiMiniBanknotes className="w-5 h-5 text-gray-900"/>
                <h5 className="font-semibold">Onramp Services</h5>
            </div>
            <div className="pl-7">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${onramp_enabled ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                    <p className="text-sm">
                        {onramp_enabled ? 'Onramp Enabled' : 'Onramp Pending'}
                    </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {onramp_enabled
                        ? 'You can deposit fiat currency to your account'
                        : 'Complete verification to enable fiat deposits'}
                </p>
            </div>
        </div>
    );
} 