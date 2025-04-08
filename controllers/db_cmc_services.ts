import connection from '../util/db';
import { RowDataPacket } from 'mysql2';

interface CoinPrice extends RowDataPacket {
    coin_name: string;
    usd_price: number;
    timestamp: Date;
}

export const createCoinPriceService = (coinName: string, usdPrice: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if(err) {
                    connection.releaseConnection(conn);
                    throw err;
                }
                conn.query(
                    `INSERT INTO coin_price (coin_name, usd_price) values ( ?, ? )`, 
                    [coinName, usdPrice],
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

export const getPriceService = (symbol: string): Promise<CoinPrice[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if (err) {
                    return reject(err);
                }
                conn.query(
                    `SELECT *
                    FROM coin_price
                    WHERE coin_name = ?
                    ORDER BY timestamp DESC
                    LIMIT 1;`,
                    [symbol],
                    (err, results, fields) => {
                        conn.release();
                        if (err) {
                            return reject(err);
                        }
                        resolve(results as CoinPrice[]);
                });
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}; 