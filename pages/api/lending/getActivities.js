import { getPoolActivitiesService } from "../../../controllers/db_lending_services"

export default async function handler(req, res) {
    if(req.method === 'GET') {
        const id = req.query.id;
        const network = req.query.network;
        const response = await getPoolActivitiesService(id, network)
        res.status(200).json({data: response})
    }
}