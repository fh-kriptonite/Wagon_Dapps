import connection from '../util/db';
import { RowDataPacket, PoolConnection } from 'mysql2';

interface LendingPool {
  id: number;
  pool_id: string;
  currency: string;
  network: string;
  status: number;
  block: number;
  transaction_hash: string;
}

interface LendingLend {
  pool_id: string;
  lender: string;
  currency_amount: string;
  pairing_amount: string;
  block: number;
  transaction_hash: string;
  network: string;
}

interface LendingBorrow {
  pool_id: string;
  borrower: string;
  amount: string;
  block: number;
  transaction_hash: string;
  network: string;
}

interface LendingRepayment {
  pool_id: string;
  borrower: string;
  amount: string;
  block: number;
  transaction_hash: string;
  network: string;
}

interface LendingClaim {
  pool_id: string;
  lender: string;
  interest_amount: string;
  principal_amount: string;
  block: number;
  transaction_hash: string;
  network: string;
}

interface PoolActivity {
  block: number;
  transaction_hash: string;
  address: string;
  amount: string;
  event: string;
}

interface UserPool {
  pool_id: string;
  currency: string;
  network: string;
}

export const createLendingPoolService = (poolId: string, currency: string, network: string, block: number, tx: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `INSERT INTO lending_pools (pool_id, currency, network, status, block, transaction_hash) values ( ?, ?, ?, 1, ?, ? )`, 
                    [poolId, currency, network, block, tx],
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
};

export const createLendingLendService = (poolId: string, lender: string, currencyAmount: string, pairingAmount: string, block: number, tx: string, network: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `INSERT INTO lending_lends (pool_id, lender, currency_amount, pairing_amount, block, transaction_hash, network) values ( ?, ?, ?, ?, ?, ?, ? )`, 
                    [poolId, lender, currencyAmount, pairingAmount, block, tx, network],
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
};

export const createLendingBorrowService = (poolId: string, borrower: string, amount: string, block: number, tx: string, network: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `INSERT INTO lending_borrows (pool_id, borrower, amount, block, transaction_hash, network) values ( ?, ?, ?, ?, ?, ? )`, 
                    [poolId, borrower, amount, block, tx, network],
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
};

export const createLendingRepaymentService = (poolId: string, borrower: string, amount: string, block: number, tx: string, network: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `INSERT INTO lending_repayments (pool_id, borrower, amount, block, transaction_hash, network) values ( ?, ?, ?, ?, ?, ? )`, 
                    [poolId, borrower, amount, block, tx, network],
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
};

export const createLendingClaimInterestService = (poolId: string, lender: string, amountInterest: string, amountPrincipal: string, block: number, tx: string, network: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `INSERT INTO lending_claims (pool_id, lender, interest_amount, principal_amount, block, transaction_hash, network) values ( ?, ?, ?, ?, ?, ?, ? )`, 
                    [poolId, lender, amountInterest, amountPrincipal, block, tx, network],
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
};

export const updatePoolService = (poolId: string, status: number, network: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `UPDATE lending_pools SET status = ? where pool_id = ? and network = ?`,
                    [status, poolId, network],
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
};

export const getPoolService = (status: number): Promise<LendingPool[]> => {
    return new Promise(async (resolve, reject) => {
        let conn: PoolConnection | undefined;
        try {
            conn = await new Promise<PoolConnection>((resolve, reject) => {
                connection.getConnection((err: Error | null, connection: PoolConnection) => {
                    if (err) reject(err);
                    else resolve(connection);
                });
            });

            if (!conn) {
                throw new Error('Failed to get database connection');
            }

            let query = 'SELECT id, pool_id, currency, network, status FROM `lending_pools` WHERE status = ?';
            if (status == 1) {
                query = 'SELECT id, pool_id, currency, network, status FROM `lending_pools` WHERE status = ? OR status = 0';
            } else if (status == 2) {
                query = 'SELECT id, pool_id, currency, network, status FROM `lending_pools` WHERE status = ? OR status = 7';
            }

            const results = await new Promise<RowDataPacket[]>((resolve, reject) => {
                conn?.query(query, [status], (err: Error | null, results: RowDataPacket[]) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            resolve(results as LendingPool[]);
        } catch (error) {
            console.error('Error in getPoolService:', error);
            reject(error);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    });
};

export const getAssetsPoolService= (poolId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `SELECT id, type, image_url, status, created_at
                    FROM assets
                    WHERE pool_id = ?`,
                    [poolId],
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
};

export const getShipmentsPoolService= (poolId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `SELECT shipments.id, 
                        shipments.date, 
                        shipments.from, 
                        shipments.to, 
                        shipments.weight, 
                        shipments.distance, 
                        shipments.created_at,
                        assets.id as asset_id,
                        assets.type as asset_type,
                        assets.created_at as asset_created_at
                    FROM shipments
                    LEFT JOIN assets ON shipments.truck_id = assets.id
                    WHERE assets.pool_id = ?
                    ORDER BY shipments.date DESC;`,
                    [poolId],
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