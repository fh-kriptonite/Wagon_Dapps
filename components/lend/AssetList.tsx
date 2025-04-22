import { Badge } from "flowbite-react";
import crypto from 'crypto';
import { Asset } from "./types";

interface AssetListProps {
  assets: Asset[] | null | undefined;
}

export default function AssetList({ assets }: AssetListProps) {
  function getDisplayId(asset: Asset): string {
    const id = asset.id;
    const timestamp = new Date(asset.created_at);

    const data = `${id}:${timestamp}`; // Combine integer and timestamp
    
    // Simple hash-like function to ensure a 5-character result
    const hash = crypto.createHash('md5').update(data).digest('base64'); // Generate MD5 hash and encode in Base64
    // Return the first 9 characters
    const shortHash = hash.slice(0, 9);
    
    if (asset.type === "TRL-T")
      return "TT-" + shortHash;

    if (asset.type === "LTANK")
      return "LT-" + shortHash;

    return shortHash;
  }

  function getBadgeColor(status: string): string {
    if(status === "ONROAD") return "success";
    
    return "success";
  }

  function getBadgeString(status: string): string {
    if(status === "ONROAD") return "On Road";
    
    return "On Road";
  }

  function getBadgePulseColor(status: string): string {
    if(status === "ONROAD") return "bg-green-400";
    
    return "bg-green-400";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        assets?.map((asset, index) => {
          return (
            <div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow" 
              key={asset.id}
            >
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${asset.image_url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {getDisplayId(asset)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`${getBadgePulseColor(asset.status)} animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
                      <span className={`${getBadgePulseColor(asset.status)} relative inline-flex rounded-full h-2 w-2`}></span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      asset.status === "ONROAD" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {getBadgeString(asset.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
} 