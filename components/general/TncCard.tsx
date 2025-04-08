import React from 'react';

interface TncCardProps {
    title: string;
    label: string;
    points?: string[];
}

export default function TncCard({ title, label, points }: TncCardProps) {
    return (
        <div className="my-5">
            <p className='text-xl font-medium lg:text-2xl'>
                {title}
            </p>
            <p className='text-sm text-gray-500 font-light lg:text-md mt-2'>
                {label}
            </p>
            <ul className="ml-4">
                {points?.map((point, index) => (
                    <li key={`${title}-point-${index}`} className='text-sm text-gray-500 font-light lg:text-md mt-2 list-disc'>
                        {point}
                    </li>
                ))}
            </ul>
        </div>
    );
} 