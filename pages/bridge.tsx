import BridgeCard from '../components/bridge/BridgeCard';
import Head from 'next/head';
import { HiArrowLeft, HiShieldCheck } from "react-icons/hi2";
import Link from "next/link";

interface BridgeProps {
  [key: string]: any;
}

export default function Bridge(props: BridgeProps) {
  return (
    <div className="container mx-auto px-4 md:px-10 h-full bg-gray-50">
      <Head>
        <title>Bridge | Wagon Network</title>
      </Head>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto space-y-4 pb-4">
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <HiShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Bridge</h2>
                    <p className="text-blue-100 mt-2 text-sm md:text-base">
                      Transfer WAG tokens between networks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pb-4">
        <div className="flex flex-col items-center">
          <BridgeCard {...props} />
        </div>
      </div>
    </div>
  );
} 