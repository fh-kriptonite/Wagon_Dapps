import { useState } from "react";
import axios from 'axios';
import { Button, Label, Select, TextInput } from "flowbite-react";
import { IoClose } from "react-icons/io5";
import { useAccount } from "@particle-network/connectkit";

export default function VerificationForm(props) {
    const account = useAccount();

    const refreshAccount = props.refreshAccount;

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // Handle file change from the input
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    // Handle drag and drop
    const handleDrag = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === "dragenter" || event.type === "dragover") {
            setDragActive(true);
        } else if (event.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setFile(event.dataTransfer.files[0]);
        }
    };

    const handleSaveProfile = async () => {
        if (!email || !fullName || !address || !documentType || !file) {
            alert("Please fill in all fields and upload a document.");
            return;
        }

        const formData = new FormData();
        formData.append('wallet_address', account);
        formData.append('email', email);
        formData.append('full_name', fullName);
        formData.append('address', address);
        formData.append('document_type', documentType);
        formData.append('document_file', file);

        try {
            // Send data to your backend
            const response = await axios.post(`/api/account/createAccount?wallet_address=${account}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle success response
            alert('Profile successfully saved!');
            refreshAccount();
            props.closeForm();
        } catch (error) {
            // Handle error response
            console.error('Error saving profile:', error);
            alert('There was an error saving your profile. Please try again.');
        }
    };

    return (
        <div className="card w-full space-y-2">
            <div className="flex gap-4 justify-between items-center">
                <h5 className="mb-2">Verify your profile</h5>
                <Button color="light" className="border-0" onClick={props.closeForm}>
                    <IoClose className="w-6 h-6"/>
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="mb-2 block">
                        <Label htmlFor="email" value="Email" />
                    </div>
                    <TextInput 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>

                <div className="flex-1">
                    <div className="mb-2 block">
                        <Label htmlFor="fullname" value="Full Name" />
                    </div>
                    <TextInput 
                        id="fullname" 
                        type="text" 
                        placeholder="Your name" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        required
                    />
                </div>
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="address" value="Address" />
                </div>
                <TextInput 
                    id="address" 
                    type="text" 
                    placeholder="Your address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required
                />
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="document_type" value="Document Type" />
                </div>
                <Select 
                    id="document_type" 
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)} 
                    required
                >
                    <option value="">Select Document Type</option>
                    <option value="National Identity">National Identity</option>
                    <option value="Driving Licence">Driving Licence</option>
                    <option value="Passport">Passport</option>
                </Select>
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="dropzone_file" value="Upload Document" />
                </div>
                <div 
                    className={`flex w-full items-center justify-center ${dragActive ? 'border-blue-500 bg-blue-50' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                >
                    <Label
                        htmlFor="dropzone-file"
                        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            {file ? (
                                <p className="text-base font-semibold text-gray-500 dark:text-gray-400">{file.name}</p>
                            ) : (
                                <>
                                    <svg
                                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (MAX. 800x400px)</p>
                                </>
                            )}
                        </div>
                        <input 
                            id="dropzone-file" 
                            name="document_file"
                            type="file" 
                            onChange={handleFileChange} 
                            className="hidden" 
                        />
                    </Label>
                </div>
            </div>

            <Button color="dark" className="w-full" onClick={handleSaveProfile}>
                Save Profile
            </Button>
        </div>
    );
}
