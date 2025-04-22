import React, { useState } from 'react';
import { Table } from 'flowbite-react';
import crypto from 'crypto';
import { Shipment } from './types';

interface ShipmentListProps {
  shipments?: Shipment[] | null;
}

export default function ShipmentList({ shipments = [] }: ShipmentListProps) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Set how many rows per page

  // Ensure shipments is an array
  const safeShipments = Array.isArray(shipments) ? shipments : [];

  // Calculate the index of the first and last item to display on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Get current rows
  const currentRows = safeShipments.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(safeShipments.length / rowsPerPage);

  // Change page handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate array of pages to display
  const getVisiblePages = (): number[] => {
    const visiblePages: number[] = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  function getDisplayId(shipment: Shipment): string {
    const id = shipment.id;
    const timestamp = new Date(shipment.created_at);

    const data = `${id}:${timestamp}`; // Combine integer and timestamp

    // Generate MD5 hash and encode it in Base64
    const hash = crypto.createHash('md5').update(data).digest('base64');

    // Convert Base64 hash to an alphanumeric string
    // Remove any non-alphanumeric characters from the Base64 hash
    let base64Hash = hash.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters

    // Return the first 9 alphanumeric characters
    return base64Hash.slice(0, 9);
  }

  function getDisplayAssetId(shipment: Shipment): string {
    const id = shipment.asset_id;
    const timestamp = new Date(shipment.asset_created_at);

    const data = `${id}:${timestamp}`; // Combine integer and timestamp

    // Simple hash-like function to ensure a 5-character result
    const hash = crypto.createHash('md5').update(data).digest('base64'); // Generate MD5 hash and encode in Base64
    // Return the first 9 characters
    const shortHash = hash.slice(0, 9);

    if (shipment.asset_type === 'TRL-T') return 'TT-' + shortHash;

    if (shipment.asset_type === 'LTANK') return 'LT-' + shortHash;

    return shortHash;
  }

  return (
    <div className="space-y-4">
      {safeShipments.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head className="bg-gray-50">
                  <Table.HeadCell className="text-sm font-medium text-gray-600">ID</Table.HeadCell>
                  <Table.HeadCell className="text-sm font-medium text-gray-600">Date</Table.HeadCell>
                  <Table.HeadCell className="text-sm font-medium text-gray-600">Asset</Table.HeadCell>
                  <Table.HeadCell className="text-sm font-medium text-gray-600">From</Table.HeadCell>
                  <Table.HeadCell className="text-sm font-medium text-gray-600">To</Table.HeadCell>
                  <Table.HeadCell className="text-sm font-medium text-gray-600 text-right">Weight</Table.HeadCell>
                  <Table.HeadCell className="text-sm font-medium text-gray-600 text-right">Distance</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {currentRows.map((row) => (
                    <Table.Row 
                      key={row.id}
                      className="bg-white hover:bg-gray-50"
                    >
                      <Table.Cell className="text-sm text-gray-900 py-4">
                        <span className="font-mono">{getDisplayId(row)}</span>
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-900 py-4">
                        {new Date(row.date).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-900 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.asset_type === 'TRL-T' 
                            ? "bg-blue-100 text-blue-800" 
                            : row.asset_type === 'LTANK'
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                        }`}>
                          {getDisplayAssetId(row)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-900 py-4">
                        {row.from}
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-900 py-4">
                        {row.to}
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-900 py-4 text-right">
                        {row.weight} Ton
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-900 py-4 text-right">
                        {row.distance} Km
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Showing</span>
              <span className="text-sm font-medium text-gray-900">
                {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, safeShipments.length)}
              </span>
              <span className="text-sm text-gray-500">of</span>
              <span className="text-sm font-medium text-gray-900">{safeShipments.length}</span>
              <span className="text-sm text-gray-500">shipments</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="First page"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                First
              </button>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="flex items-center gap-1">
                {getVisiblePages().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                      page === currentPage 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Last page"
              >
                Last
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">No shipments available</p>
        </div>
      )}
    </div>
  );
} 