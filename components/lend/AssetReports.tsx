import { PiPackage } from "react-icons/pi";
import { FaTruckFront } from "react-icons/fa6";
import { GiPathDistance } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { numberWithCommas } from "../../util/stringUtility";
import ShipmentChart from "./shipmentChart";

interface Shipment {
  date: string;
  weight: number;
  distance: number;
}

interface Asset {
  id: number;
  created_at: string;
  type: string;
  status: string;
  image_url: string;
}

interface AssetReportsProps {
  assets: Asset[] | null;
  shipments: Shipment[] | null;
}

interface AggregatedShipment {
  date: string;
  totalShipments: number;
}

export default function AssetReports({ assets, shipments }: AssetReportsProps) {
  function aggregateShipments(data: Shipment[] | null): AggregatedShipment[] {
    const aggregatedData: Record<string, number> = {};

    data?.forEach(shipment => {
      const date = new Date(shipment.date).toISOString().split('T')[0];
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
      }
      aggregatedData[date]++;
    });

    const result = Object.keys(aggregatedData).map(date => ({
      date,
      totalShipments: aggregatedData[date]
    }));

    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return result;
  }
  
  function getTotalWeight(shipments: Shipment[] | null): string {
    if (shipments == null) return "0";
    if (!Array.isArray(shipments)) return "0";
  
    const totalWeight = shipments.reduce((total, shipment) => {
      if (shipment.weight && !isNaN(shipment.weight)) {
        return total + shipment.weight;
      }
      return total;
    }, 0);
  
    return numberWithCommas(totalWeight);
  }

  function getTotalDistance(shipments: Shipment[] | null): string {
    if (shipments == null) return "0";
    if (!Array.isArray(shipments)) return "0";
  
    const totalDistance = shipments.reduce((total, shipment) => {
      if (shipment.distance && !isNaN(shipment.distance)) {
        return total + shipment.distance;
      }
      return total;
    }, 0);
  
    return numberWithCommas(totalDistance);
  }

  function getTotalShipments(shipments: Shipment[] | null): string {
    if (!Array.isArray(shipments)) return "0";
    return numberWithCommas(shipments.length);
  }

  return (
    <div className="card space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Shipments */}
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <PiPackage className="h-6 w-6 text-blue-600"/>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalShipments(shipments)}</p>
            </div>
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <GiPathDistance className="h-6 w-6 text-blue-600"/>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Distance</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalDistance(shipments)} Km</p>
            </div>
          </div>
        </div>

        {/* Total Weight */}
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <GiWeight className="h-6 w-6 text-blue-600"/>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Weight</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalWeight(shipments)} Ton</p>
            </div>
          </div>
        </div>

        {/* Underlying Assets */}
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <FaTruckFront className="h-6 w-6 text-blue-600"/>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Underlying Assets</p>
              <p className="text-2xl font-bold text-gray-900">{assets == null ? 0 : assets.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shipment Activity</h3>
          <p className="text-sm text-gray-500">Overview of shipment activities over time</p>
        </div>
        <div className="h-64">
          <ShipmentChart aggregatedShipments={aggregateShipments(shipments)}/>
        </div>
      </div>
    </div>
  );
} 