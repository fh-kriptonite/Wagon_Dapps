import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ShipmentChart({ data }) {
  // Extract the dates, total shipments, total weight, and total distance
  const dates = data.map(item => item.date);
  const totalShipments = data.map(item => item.totalShipments);

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
    maintainAspectRatio: true, // Ensures the chart keeps its aspect ratio
    plugins: {
      title: {
        display: true,
        text: 'Shipment Statistics by Day',
      },
      legend: {
        display: false, // Disable the legend
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
            display: false, // Hide the grid lines of the X-axis
        },
      },
      y: {
        stacked: true,
        grid: {
            display: false, // Hide the grid lines of the Y-axis
        },
      },
    },
  };

  return (
    <div className='h-60 w-full flex justify-center'>
        <Bar data={chartData} options={options}/>
    </div>
  );
}
