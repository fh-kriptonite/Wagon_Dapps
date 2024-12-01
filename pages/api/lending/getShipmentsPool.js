import { getShipmentsPoolService } from "../../../controllers/db_lending_services"

export default async function handler(req, res) {
    if(req.method === 'GET') {
        const pool_id = req.query.pool_id;
        const response = await getShipmentsPoolService(pool_id)
        res.status(200).json({data: response})
    }
}