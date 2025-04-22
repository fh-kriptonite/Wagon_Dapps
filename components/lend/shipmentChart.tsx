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
  const dates = aggregatedShipments.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const totalShipments = aggregatedShipments.map(item => item.totalShipments);

  // Prepare data for the chart
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Shipments',
        data: totalShipments,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        hoverBorderColor: 'rgb(59, 130, 246)',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: (value: number) => {
            return value.toLocaleString();
          },
        },
        title: {
          display: true,
          text: 'Shipments Count',
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (tooltipItems: any) => {
            return tooltipItems[0].label;
          },
          label: (tooltipItem: any) => {
            return `${tooltipItem.raw.toLocaleString()} shipments`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-full h-full">
      {aggregatedShipments.length > 0 ? (
        <Bar 
          options={options as any} 
          data={chartData}
          className="w-full h-full"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-sm">No shipment data available</p>
            <p className="text-gray-300 text-xs mt-1">Start tracking shipments to see activity</p>
          </div>
        </div>
      )}
    </div>
  );
} 