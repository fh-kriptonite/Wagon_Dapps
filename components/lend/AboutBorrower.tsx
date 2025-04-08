import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AboutBorrowerProps {
    content: string;
}

export default function AboutBorrower({ content }: AboutBorrowerProps) {
    return (
        <div className="space-y-4">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
} 