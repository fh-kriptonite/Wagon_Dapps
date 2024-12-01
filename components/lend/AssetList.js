import { Badge } from "flowbite-react";

export default function AssetList(props) {

  const assets = props.assets;

  function getDisplayId(asset) {
    const id = asset.id;
    const timestamp = new Date(asset.created_at);

    const data = `${id}:${timestamp}`; // Combine integer and timestamp
    
    // Simple hash-like function to ensure a 5-character result
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(data).digest('base64'); // Generate MD5 hash and encode in Base64
    // Return the first 9 characters
    const shortHash = hash.slice(0, 9);
    
    if (asset.type == "TRL-T")
      return "TT-" + shortHash;

    if (asset.type == "LTANK")
      return "LT-" + shortHash;

    return shortHash
  }

  function getImage(asset) {
    if (asset.type == "TRL-T")
      return "/trucks/truck7.jpeg";

    if (asset.type == "LTANK")
      return "/trucks/truck2.jpeg";
  }

  function getBadgeColor(status) {
    if(status == "ONROAD") return "success"
    
    return "success"
  }

  function getBadgeString(status) {
    if(status == "ONROAD") return "On Road"
    
    return "On Road"
  }

  function getBadgePulseColor(status) {
    if(status == "ONROAD") return "bg-green-400"
    
    return "bg-green-400"
  }

  function getTypeString(asset) {
    if (asset.type == "TRL-T")
      return "Trailer Tronton";

    if (asset.type == "LTANK")
      return "Tank Tronton";
  }
  
  return (
    <div className="space-y-2">
      {
        assets?.map((asset, index) => {
          return (
            <div className="card" key={asset.id}>
              <div className="flex gap-2 justify-between">
                <p className="text-base font-bold">
                  {getDisplayId(asset)}
                </p>
                <Badge color={getBadgeColor(asset.status)} size={"xs"} style={{width:"fit-content", marginLeft:"auto", borderRadius:"10px"}}>
                  <div className="flex gap-2 items-center">
                    <span className="relative flex h-2 w-2">
                      <span className={`${getBadgePulseColor(asset.status)} animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
                      <span className={`${getBadgePulseColor(asset.status)} relative inline-flex rounded-full h-2 w-2s`}></span>
                    </span>
                    {getBadgeString(asset.status)}
                  </div>
                </Badge>
              </div>
              <img src={getImage(asset)} className="h-20 mx-auto mt-2" alt="Truck"/>
              <p className="text-sm font-semibold text-center mt-1">
                {getTypeString(asset)}
              </p>
            </div>
          )
        })
      }
    </div>
  )
}
