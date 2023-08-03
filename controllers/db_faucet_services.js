import connection from '../util/db';

module.exports = {
    getClaimsServiceUnder24: (address) => {
        return new Promise(async (resolve, reject) => {
            try {
                connection.getConnection(function(err, conn) {
                    if(err) {
                        connection.releaseConnection(conn);
                        throw err;
                    }
                    conn.query(
                        'SELECT * FROM `claims` WHERE address = ? and TIMESTAMPDIFF(SECOND, created_at, now()) < ' + process.env.FAUCET_DURATION,
                        [address],
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
    createClaimsService: (address, amount) => {
        return new Promise(async (resolve, reject) => {
            try {
                connection.getConnection(function(err, conn) {
                    if(err) {
                        connection.releaseConnection(conn);
                        throw err;
                    }
                    conn.query(
                        `INSERT INTO claims (address, amount, transactionHash) values ( ?, ?, ? )`, 
                        [address, amount, ""],
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
    UpdateClaimsService: (transactionHash, status, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                connection.getConnection(function(err, conn) {
                    if(err) {
                        connection.releaseConnection(conn);
                        throw err;
                    }
                    conn.query(
                        `UPDATE claims SET transactionHash = ?, status = ?, updated_at = now() where id = ?`, 
                        [transactionHash, status, id],
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
    }
}
