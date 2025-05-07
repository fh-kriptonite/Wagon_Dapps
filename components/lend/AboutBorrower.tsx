import React from 'react';
import MarkdownComponent from '../general/markdownComponent';

interface AboutBorrowerProps {
    content: string;
}

export default function AboutBorrower({ content }: AboutBorrowerProps) {
    return (
        <div className="space-y-4">
            <MarkdownComponent content={content} />
        </div>
    );
} 