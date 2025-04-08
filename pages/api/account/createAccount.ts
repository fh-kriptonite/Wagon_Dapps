import path from 'path';
import fs from 'fs';
import formidable, { Fields, Files } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { createAccountController } from "../../../controllers/db_lending_account"

// Set the upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, so formidable can handle it
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' }); // Ensure response for other methods
  }

  // Initialize formidable to handle form data, including files
  const form = formidable({
    uploadDir: UPLOAD_DIR, // Set the upload directory
    keepExtensions: true,  // Keep file extensions
  });

  // Ensure the upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err }); // Send response on error
    }

    try {
      // Extract file information
      const documentFile = files.document_file?.[0]; // Assuming single file upload
      if (!documentFile) {
        return res.status(400).json({ message: 'No document file provided' });
      }
      
      // Construct the destination path
      const walletAddress = fields.wallet_address?.[0];
      if (!walletAddress) {
        return res.status(400).json({ message: 'No wallet address provided' });
      }
      
      const destinationFolder = path.join(UPLOAD_DIR, walletAddress); // Create a subfolder for the wallet address
      const destinationFilePath = path.join(destinationFolder, documentFile.newFilename);
      
      // Ensure wallet address directory exists
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
      }
      
      // Move the file to the wallet's directory
      fs.renameSync(documentFile.filepath, destinationFilePath);

      // Now you can save account information along with the file path
      const { wallet_address, email, full_name, address, document_type, document_id } = fields;
      
      // Ensure all fields are defined
      if (!wallet_address || !email || !full_name || !address || !document_type || !document_id) {
        return res.status(400).json({ message: 'Missing required fields' }); // Handle missing fields
      }

      const response = await createAccountController(
        wallet_address[0], 
        email[0], 
        full_name[0], 
        address[0], 
        document_type[0], 
        document_id[0], 
        destinationFilePath
      );
      
      return res.status(200).json({ data: response }); // Send success response
    } catch (error) {
      return res.status(500).json({ message: 'Error in account creation', error }); // Send response on exception
    }
  });
} 