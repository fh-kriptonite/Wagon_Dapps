import { createPool } from 'mysql2';

const connection = createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 100,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default connection;
