declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CMC_API_URL_ROOT: string;
            CMC_API_KEY: string;
        }
    }
}

import { createCoinPriceService } from "./db_cmc_services";

interface CMCResponse {
    data: {
        symbol: string;
        quote: {
            USD: {
                price: number;
            };
        };
    };
}

function fetchCMCPrice(coinId: number): void {
    fetch(process.env.CMC_API_URL_ROOT + `/v2/tools/price-conversion?amount=1&id=${coinId}&convert=USD`,
    {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY || '',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: CMCResponse) => {
            // Process the fetched data here
            console.log('Fetched data:', data.data);
            createCoinPriceService(data.data.symbol, data.data.quote.USD.price);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
}

export const startCMCService = (): void => {
    console.log('Starting CMC listener service...');

    const fetchInterval = 900000; // Fetch data every 900 seconds

    // fetch WAG price
    fetchCMCPrice(28557);
    setInterval(() => fetchCMCPrice(28557), fetchInterval);

    // fetch IDRT price
    fetchCMCPrice(4702);
    setInterval(() => fetchCMCPrice(4702), fetchInterval);
}; 