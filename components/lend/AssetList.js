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
    if (asset.id == 1)
      // return "/trucks/truck7.jpeg";
      return "/trucks/tank1.jpeg";

    if (asset.id == 2)
      // return "/trucks/truck2.jpeg";
      return "/trucks/tank2.jpeg";
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {
        assets?.map((asset, index) => {
          return (
            <div className="card !px-0 !pt-0 overflow-hidden" key={asset.id}>
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: `url(${asset.image_url})` }}
              />
              <div className="flex gap-2 justify-between mt-4 px-4">
                <div>
                  <p className="text-base font-bold">
                    {getDisplayId(asset)}
                  </p>
                </div>
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
            </div>
          )
        })
      }
    </div>
  )
}
