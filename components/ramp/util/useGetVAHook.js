import { useState } from "react";

const useGetVAHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = async (walletAddress, bankCode, totalAmount, valueFiatAmount, platformFeeAmount, gasFeeAmount, swaps) => {
    setIsLoading(true);

    const apiUrl = process.env.RAMP_API_URL + '/ramp/create_va'; // Example API endpoint
    const body = { 
      wallet_address: walletAddress, 
      bank_code: bankCode, 
      name: "Wagon Network Ramp", 
      totalAmount: totalAmount,
      valueFiatAmount: valueFiatAmount,
      platformFeeAmount: platformFeeAmount,
      gasFeeAmount: gasFeeAmount,
      swaps: swaps
    };

    let data;
    let err;

    try {
      // Making the POST request to the API
      const response = await fetch(apiUrl, {
          method: 'POST', // Specify the request method
          headers: {
              'Content-Type': 'application/json', // Set the content type to JSON
          },
          body: JSON.stringify(body) // Convert the data object to a JSON string
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parsing the JSON response
      const responseData = await response.json();

      if(responseData.message != null) {
        err = responseData.message;
      } else {
        data = responseData.data;
      }

  } catch (error) {
      // Handling any errors that occur during the fetch
      console.error('Error posting data:', error);
      err = error;
  } finally {
    setIsLoading(false)
  }

    return { data: data, error: err }
  };

  return { isLoading, fetchData };
};

export default useGetVAHook;