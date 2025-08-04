import { HiClock } from "react-icons/hi2";
import CountdownTimer from "../general/CountdownTimer";

export default function PoolCardComingSoon() {
  return (
    <div className="relative bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
        <div className="text-center">
          <HiClock className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-2 md:mb-3" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-700">Coming Soon</h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">New project launching soon</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="opacity-50">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 bg-gray-50 p-2 rounded-xl border border-gray-100">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <HiClock className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">New Pool</h3>
              <p className="text-xs md:text-sm text-gray-500">Coming Soon</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="px-2 py-1 md:px-3 md:py-1 bg-yellow-50 rounded-lg border border-yellow-100">
              <span className="text-xs md:text-sm font-medium text-yellow-700">Pending</span>
            </div>
          </div>
        </div>

        {/* Pool Details */}
        <div className="space-y-4 md:space-y-6">
          {/* Pool Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-100 rounded-full" />
                <span className="text-xs md:text-sm font-medium text-gray-600">Pool Size</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">-</div>
            </div>
            <div className="bg-purple-50 p-3 md:p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-purple-100 rounded-full" />
                <span className="text-xs md:text-sm font-medium text-gray-600">Fixed APY</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">-</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">0%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full">
              <div className="h-2 w-0 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs md:text-sm text-gray-500">
              <span>0</span>
              <span>-</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-100 rounded-full" />
                <span className="text-xs md:text-sm font-medium text-gray-600">Loan Term</span>
              </div>
              <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">-</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-100 rounded-full" />
                <span className="text-xs md:text-sm font-medium text-gray-600">Type</span>
              </div>
              <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">-</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-3 md:p-4 rounded-xl border border-yellow-100">
            <CountdownTimer targetEpoch={0}/>
          </div>
        </div>
      </div>
    </div>
  );
} 