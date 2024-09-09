import tncJson from "../public/files/tnc.json";
import TncCard from "../components/general/TncCard";

export default function LendTnc(props) {

  return (
    <div>
        <div className="container mx-auto px-10 py-8 max-w-5xl">    
          <h1 className="text-xl font-medium md:text-2xl lg:text-3xl mt-2 text-start">
            TERMS AND CONDITIONS
          </h1>
          <h1 className="text-xl font-medium md:text-2xl lg:text-3xl text-start">
            OF THE LENDING POOLS ISSUED
          </h1>
          <h1 className="text-xl font-medium md:text-2xl lg:text-3xl text-start">
            ON WAGON NETWORK
          </h1>
          <p className="text-sm text-black mt-2">
            Effective Date: 1 September 2024
          </p>

          <p className="text-sm text-gray-500 font-light mt-4">
            These Terms and Conditions govern participation in the lending pools ("Lending Pools") issued by the Web3 DeFi platform ("Platform"), operated by Wagon Network. By participating in any Lending Pool, users ("Lenders" or "Investors") agree to these terms.
          </p>

          {
            tncJson.map((tnc, index) => {
                return (
                    <div key={index} className="border-b-2">
                        <TncCard 
                            title={tnc.title} 
                            label={tnc.label}
                            points={tnc.points}
                        />
                    </div>
                )
            })
          }
        </div>

    </div>
  )
}