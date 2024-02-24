// pages/api/erc1155/[id].js
import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
    if(req.method === 'GET') {
        const id = req.query.id
        
        if (!id) {
            return res.status(400).json({ error: 'ID parameter is missing' });
        }

        // Path to the JSON file based on the provided ID
        const filePath = path.join(process.cwd(), 'public', 'pools', `${id}.json`);

        try {
            // Read the JSON file
            const jsonData = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(jsonData);
        
            res.status(200).json(data);
        } catch (error) {
            // Handle file not found or other errors
            return res.status(404).json({ error: 'File not found or error reading JSON file' });
        }
    }
}