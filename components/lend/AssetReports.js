import { PiPackage } from "react-icons/pi";
import { FaTruckFront } from "react-icons/fa6";
import { GiPathDistance } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { numberWithCommas } from "../../util/stringUtility";
import ShipmentChart from "./shipmentChart";

export default function AssetReports(props) {

  const assets = props.assets;
  
  const shipments = props.shipments;

  function aggregateShipments(data) {
    // Create a map to hold the aggregated data
    const aggregatedData = {};

    // Loop through each shipment in the data
    data?.forEach(shipment => {
      // Format the date to "YYYY-MM-DD"
      const date = new Date(shipment.date).toISOString().split('T')[0];

      // Initialize the count for the date if it doesn't exist yet
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
      }

      // Increment the count for that date
      aggregatedData[date]++;
    });

    // Convert the aggregated data into an array of objects
    const result = Object.keys(aggregatedData).map(date => ({
      date,
      totalShipments: aggregatedData[date]
    }));

    // Sort the result by date (optional)
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    return result;
  }
  
  function getTotalWeight(shipments) {
    if(shipments == null) return 0;

    // Ensure that shipments is an array and contains valid data
    if (!Array.isArray(shipments)) {
      return 0; // Return 0 if the input is not an array
    }
  
    // Use reduce to sum up the weights of all shipments
    const totalWeight = shipments.reduce((total, shipment) => {
      if (shipment.weight && !isNaN(shipment.weight)) {
        return total + shipment.weight;
      }
      return total;
    }, 0); // Initial value is 0
  
    return numberWithCommas(totalWeight);
  }

  function getTotalDistance(shipments) {
    if(shipments == null) return 0;

    // Ensure that shipments is an array and contains valid data
    if (!Array.isArray(shipments)) {
      return 0; // Return 0 if the input is not an array
    }
  
    // Use reduce to sum up the distance of all shipments
    const totalDistance = shipments.reduce((total, shipment) => {
      if (shipment.distance && !isNaN(shipment.distance)) {
        return total + shipment.distance;
      }
      return total;
    }, 0); // Initial value is 0
  
    return numberWithCommas(totalDistance);
  }

  function getTotalShipments(shipments) {
    // Ensure that shipments is an array
    if (!Array.isArray(shipments)) {
      return 0; // Return 0 if the input is not an array
    }
  
    // Return the length of the shipments array
    return numberWithCommas(shipments.length);
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 justify-between items-center card">
        <div className="flex-1 grid grid-cols md:grid-cols-2 gap-8">

          <div className="flex-1">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 card !rounded-full bg-white flex items-center justify-center">
                <PiPackage className="h-8 w-8"/>
              </div>
              
              <div>
                <p className="text-2xl">{getTotalShipments(shipments)}</p>
                <p className="text-sm">Total Shipments</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 card !rounded-full bg-white flex items-center justify-center">
                <GiPathDistance className="h-8 w-8"/>
              </div>
              
              <div>
                <p className="text-2xl">{getTotalDistance(shipments)} Km</p>
                <p className="text-sm">Total Distance</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 card !rounded-full bg-white flex items-center justify-center">
                <GiWeight className="h-8 w-8"/>
              </div>
              
              <div>
                <p className="text-2xl">{getTotalWeight(shipments)} Ton</p>
                <p className="text-sm">Total Weight</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 card !rounded-full bg-white flex items-center justify-center">
                <FaTruckFront className="h-6 w-6"/>
              </div>
              
              <div>
                <p className="text-2xl">{ assets == null ? 0 : assets.length}</p>
                <p className="text-sm">Underlying Assets</p>
              </div>
            </div>
          </div>

        </div>

        <div className="flex-1">
          <ShipmentChart data={aggregateShipments(shipments)}/>
        </div>
      </div>

      
    </>
    

  )
}
