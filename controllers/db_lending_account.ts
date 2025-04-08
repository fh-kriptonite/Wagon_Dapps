import connection from '../util/db';
import { RowDataPacket } from 'mysql2';

interface Account {
    wallet_address: string;
    email: string;
    full_name: string;
    address: string;
    document_type: string;
    document_id: string;
    document_file: string;
    status?: number;
    error_at?: string;
}

interface AccountQueryResult extends RowDataPacket {
    wallet_address: string;
    email: string;
    full_name: string;
    address: string;
    document_type: string;
    status: number;
    error_at: string;
}

export const createAccountController = (
    wallet_address: string,
    email: string,
    full_name: string,
    address: string,
    document_type: string,
    document_id: string,
    document_file: string
): Promise<any> => {
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
};

export const getAccountController = (wallet_address: string): Promise<AccountQueryResult[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.getConnection(function(err, conn) {
                if (err) {
                    return reject(err);
                }
                let query = 'SELECT wallet_address, email, full_name, address, document_type, status, error_at FROM `accounts` WHERE wallet_address = ?';
                
                conn.query(
                    query,
                    [wallet_address],
                    (err, results) => {
                        conn.release();
                        if (err) {
                            return reject(err);
                        }
                        resolve(results as AccountQueryResult[]);
                });
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}; 