module.exports = {
    getPoolsService : async (status) => {
        return new Promise( async (resolve, reject) => {
            try {
                const response = await fetch('../api/lending/?id=' + status);
                if (!response.ok) {
                    reject('Failed to fetch data');
                }
                const jsonData = await response.json();
                resolve(jsonData);
            } catch (error) {
                console.error('Error fetching JSON:', error);
                reject(error);
            }
        })
    }
}