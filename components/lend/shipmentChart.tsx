import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AggregatedShipment {
  date: string;
  totalShipments: number;
}

interface ShipmentChartProps {
  aggregatedShipments: AggregatedShipment[];
}

export default function ShipmentChart({ aggregatedShipments = [] }: ShipmentChartProps) {

  const dates = aggregatedShipments.map(item => item.date);
  const totalShipments = aggregatedShipments.map(item => item.totalShipments);


  // Prepare data for the chart
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Shipments',
        data: totalShipments,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(0, 0, 0, 0.9)',
        borderWidth: 1,
        borderRadius: 10
      }
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Shipments count',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Shipment Statistics',
      },
    },
  };

  return (
    <div className="w-full h-[400px] p-4">
      {aggregatedShipments.length > 0 ? (
        <Bar options={options} data={chartData} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No shipment data available</p>
        </div>
      )}
    </div>
  );
} 