import { getUserPoolsService } from "../../../controllers/db_lending_services"

export default async function handler(req, res) {
    if(req.method === 'GET') {
        const address = req.query.address;
        const response = await getUserPoolsService(address)
        res.status(200).json({data: response})
    }
}