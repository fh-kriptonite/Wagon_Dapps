import { getPoolService } from "../../../controllers/db_lending_services"

export default async function handler(req, res) {
    if(req.method === 'GET') {
        const id = req.query.id;
        const response = await getPoolService(id)
        res.status(200).json({data: response})
    }
}