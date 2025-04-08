import React from 'react';

interface MaintenanceProps {
    // Add any props if needed in the future
}

export default function Maintenance(_props: MaintenanceProps) {
    return (
        <div className='-my-28 flex h-screen'>
            <div className='m-auto'>
                <h1>Sorry, we are under maintenance</h1>
                <h3 className='mt-2 text-center'>
                    <a 
                        href="https://t.me/wagon_network" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block py-2 pl-3 pr-4 md:hover:text-gray-700 md:p-0"
                    > 
                        Join our community for more updates
                    </a>
                </h3>
            </div>
        </div>
    );
} 