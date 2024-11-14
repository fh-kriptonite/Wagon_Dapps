import connection from '../util/db';

module.exports = {
    createAccountController: (wallet_address, email, full_name, address, document_type, document_id, document_file) => {
        return new Promise(async (resolve, reject) => {
            try {
                connection.getConnection(function(err, conn) {
                    if(err) {
                        connection.releaseConnection(conn);
                        throw err;
                    }
                    conn.query(
                        `INSERT INTO accounts (wallet_address, email, full_name, address, document_type, document_id, document_file) values ( ?, ?, ?, ?, ?, ?, ? )`, 
                        [wallet_address, email, full_name, address, document_type, document_id, document_file],
                        (err, results, fields) => {
                            if(err) reject(err);
                            resolve(results);
                    });
                    connection.releaseConnection(conn);
                })
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },
    getAccountController: (wallet_address) => {
        return new Promise(async (resolve, reject) => {
            try {
                connection.getConnection(function(err, conn) {
                    if (err) {
                        return reject(err); // Reject the promise with the error
                    }
                    let query = 'SELECT wallet_address, email, full_name, address, document_type, status, error_at FROM `accounts` WHERE wallet_address = ?';
                    
                    conn.query(
                        query,
                        [wallet_address],
                        (err, results) => {
                            // Release the connection before resolving or rejecting
                            conn.release();
                            if (err) {
                                return reject(err); // Reject the promise with the error
                            }
                            resolve(results); // Resolve the promise with the query results
                    });
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },  
}
