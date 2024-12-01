import React, { useState } from 'react';
import { Table, Pagination } from 'flowbite-react';

export default function ShipmentList(props) {
  const data = props.shipments || []; // Default to an empty array if data is null or undefined

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Set how many rows per page

  // Calculate the index of the first and last item to display on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Change page handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function getDisplayId(shipment) {
    const id = shipment.id;
    const timestamp = new Date(shipment.created_at);
  
    const data = `${id}:${timestamp}`; // Combine integer and timestamp
  
    // Generate MD5 hash and encode it in Base64
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(data).digest('base64');
  
    // Convert Base64 hash to an alphanumeric string
    // Remove any non-alphanumeric characters from the Base64 hash
    let base64Hash = hash.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters
    
    // Return the first 9 alphanumeric characters
    return base64Hash.slice(0, 9); 
  }
  
  function getDisplayAssetId(shipment) {
    const id = shipment.asset_id;
    const timestamp = new Date(shipment.asset_created_at);

    const data = `${id}:${timestamp}`; // Combine integer and timestamp
    
    // Simple hash-like function to ensure a 5-character result
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(data).digest('base64'); // Generate MD5 hash and encode in Base64
    // Return the first 9 characters
    const shortHash = hash.slice(0, 9);
    
    if (shipment.asset_type == "TRL-T")
      return "TT-" + shortHash;

    if (shipment.asset_type == "LTANK")
      return "LT-" + shortHash;

    return shortHash
  }

  return (
    <div className="overflow-x-auto">
      {/* Check if data exists and has at least one row */}
      {data.length > 0 ? (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Asset</Table.HeadCell>
              <Table.HeadCell>From</Table.HeadCell>
              <Table.HeadCell>To</Table.HeadCell>
              <Table.HeadCell>Weight</Table.HeadCell>
              <Table.HeadCell>Distance</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {currentRows.map((row, index) => (
                <Table.Row key={row.id}>
                  <Table.Cell>{getDisplayId(row)}</Table.Cell>
                  <Table.Cell>{new Date(row.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{getDisplayAssetId(row)}</Table.Cell>
                  <Table.Cell>{row.from}</Table.Cell>
                  <Table.Cell>{row.to}</Table.Cell>
                  <Table.Cell>{row.weight} Ton</Table.Cell>
                  <Table.Cell>{row.distance} Km</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Flowbite Pagination Component with alignment to the end */}
          <div className="flex justify-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p>No shipments available</p> // Display message if no data
      )}
    </div>
  );
}
