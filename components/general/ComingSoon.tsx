import React from 'react';
import { HiClock } from "react-icons/hi2";
import { FaTelegram } from "react-icons/fa";

interface ComingSoonProps {
    // Add any props if needed in the future
}

export default function ComingSoon(_props: ComingSoonProps) {
    return (
        <div className="min-h-screen flex items-center justify-center -my-28">
            <div className="text-center p-8 max-w-2xl">
                {/* Icon */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 inline-block mb-6">
                    <HiClock className="w-16 h-16 text-blue-600" />
                </div>

                {/* Main Text */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
                <p className="text-lg text-gray-600 mb-8">
                    We're working on something exciting!
                </p>

                {/* Community Link */}
                <a 
                    href="https://t.me/wagon_network" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                    <FaTelegram className="w-5 h-5" />
                    <span>Join our community for updates</span>
                </a>
            </div>
        </div>
    );
} 