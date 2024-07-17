import { useState } from "react";

const useGetOnrampDisburseHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = async (external_id) => {
    setIsLoading(true);

    const apiUrl = process.env.RAMP_API_URL + '/ramp/onramp_disburse'; // Example API endpoint
    const body = { id: external_id };

    let data;
    let error;

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
        error = responseData.message;
      } else {
        data = responseData.data;
      }

  } catch (error) {
      // Handling any errors that occur during the fetch
      console.error('Error posting data:', error);
      error = error;
  } finally {
    setIsLoading(false)
  }

    return { data: data, error: error }
  };

  return { isLoading, fetchData };
};

export default useGetOnrampDisburseHook;