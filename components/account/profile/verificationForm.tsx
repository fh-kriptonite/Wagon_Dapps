import { useState, ChangeEvent, DragEvent } from "react";
import axios from 'axios';
import { Button, Label, Select, TextInput, Alert } from "flowbite-react";
import { IoClose } from "react-icons/io5";
import { useConnectedAddress } from '@/hooks/useConnectedAddress';

interface VerificationFormProps {
    refreshAccount: () => void;
    closeForm: () => void;
}

interface FormErrors {
    email?: string;
    fullName?: string;
    address?: string;
    documentType?: string;
    documentId?: string;
    documentFile?: string;
}

export default function VerificationForm({ refreshAccount, closeForm }: VerificationFormProps) {
    const { connectedAddress: account } = useConnectedAddress();

    const [email, setEmail] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [documentType, setDocumentType] = useState<string>('');
    const [documentId, setDocumentId] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        let isValid = true;

        if (!email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }

        if (!fullName) {
            errors.fullName = 'Full name is required';
            isValid = false;
        }

        if (!address) {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (!documentType) {
            errors.documentType = 'Document type is required';
            isValid = false;
        }

        if (!documentId) {
            errors.documentId = 'Document ID is required';
            isValid = false;
        }

        if (!file) {
            errors.documentFile = 'Document file is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const validateFile = (file: File): boolean => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setError('Only JPG and PNG files are allowed');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError('File size must be less than 5MB');
            return false;
        }
        setError(null);
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                setFormErrors(prev => ({ ...prev, documentFile: undefined }));
            } else {
                setFile(null);
            }
        }
    };

    // Handle drag and drop
    const handleDrag = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === "dragenter" || event.type === "dragover") {
            setDragActive(true);
        } else if (event.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                setFormErrors(prev => ({ ...prev, documentFile: undefined }));
            } else {
                setFile(null);
            }
        }
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        const formData = new FormData();
        formData.append('wallet_address', account || '');
        formData.append('email', email);
        formData.append('full_name', fullName);
        formData.append('address', address);
        formData.append('document_type', documentType);
        formData.append('document_id', documentId);
        if (file) {
            formData.append('document_file', file);
        }

        try {
            const response = await axios.post(`/api/account/createAccount?wallet_address=${account}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSubmitStatus('success');
            setTimeout(() => {
                refreshAccount();
                closeForm();
            }, 2000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card w-full space-y-2">
            <div className="flex gap-8 items-center my-8">
                <div className="flex-initial w-1/3 mx-auto hidden lg:block">
                    <img src={"/profile.png"} className="mx-auto rounded-lg" alt="Profile"/>
                </div>
                <div className="flex-1 max-w-2xl mx-auto space-y-2">
                    <div className="flex gap-4 justify-between items-center">
                        <h5 className="mb-2">Verify your profile</h5>
                        <Button color="light" className="border-0" onClick={closeForm}>
                            <IoClose className="w-6 h-6"/>
                        </Button>
                    </div>

                    {submitStatus === 'success' && (
                        <Alert color="success" className="mb-4">
                            Profile successfully saved!
                        </Alert>
                    )}
                    {submitStatus === 'error' && (
                        <Alert color="failure" className="mb-4">
                            There was an error saving your profile. Please try again.
                        </Alert>
                    )}

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
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setFormErrors(prev => ({ ...prev, email: undefined }));
                                }}
                                color={formErrors.email ? 'failure' : 'gray'}
                                helperText={formErrors.email}
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
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                    setFormErrors(prev => ({ ...prev, fullName: undefined }));
                                }}
                                color={formErrors.fullName ? 'failure' : 'gray'}
                                helperText={formErrors.fullName}
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
                            onChange={(e) => {
                                setAddress(e.target.value);
                                setFormErrors(prev => ({ ...prev, address: undefined }));
                            }}
                            color={formErrors.address ? 'failure' : 'gray'}
                            helperText={formErrors.address}
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
                            onChange={(e) => {
                                setDocumentType(e.target.value);
                                setFormErrors(prev => ({ ...prev, documentType: undefined }));
                            }}
                            color={formErrors.documentType ? 'failure' : 'gray'}
                            required
                        >
                            <option value="">Select Document Type</option>
                            <option value="National Identity">National Identity</option>
                            <option value="Driving Licence">Driving Licence</option>
                            <option value="Passport">Passport</option>
                        </Select>
                        {formErrors.documentType && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formErrors.documentType}</p>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="documentId" value="Document ID" />
                        </div>
                        <TextInput 
                            id="documentId" 
                            type="text" 
                            placeholder="Your document ID" 
                            value={documentId} 
                            onChange={(e) => {
                                setDocumentId(e.target.value);
                                setFormErrors(prev => ({ ...prev, documentId: undefined }));
                            }}
                            color={formErrors.documentId ? 'failure' : 'gray'}
                            helperText={formErrors.documentId}
                            required
                        />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="dropzone_file" value="Upload Document" />
                        </div>
                        <div 
                            className={`flex w-full items-center justify-center ${dragActive ? 'border-blue-500 bg-blue-50' : ''} ${formErrors.documentFile ? 'border-red-500' : ''}`}
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
                                        <div className="text-center">
                                            <p className="text-base font-semibold text-gray-500 dark:text-gray-400">{file.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
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
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG or JPG (MAX. 5MB and 800x400px)
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input 
                                    id="dropzone-file" 
                                    name="document_file"
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png"
                                />
                            </Label>
                        </div>
                        {(error || formErrors.documentFile) && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {error || formErrors.documentFile}
                            </p>
                        )}
                    </div>

                    <Button 
                        color="dark" 
                        className="w-full" 
                        onClick={handleSaveProfile}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Profile'}
                    </Button>
                </div>
            </div>
        </div>
    );
} 