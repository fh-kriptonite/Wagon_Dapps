import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownComponentProps {
    content: string;
}

export default function MarkdownComponent({ content }: MarkdownComponentProps) {
    return (
        <div className="prose prose-sm max-w-none">
            <ReactMarkdown
                components={{
                    h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 mb-4">
                            {children}
                        </ul>
                    ),
                    li: ({ children }) => (
                        <li className="text-sm text-gray-600">
                            {children}
                        </li>
                    ),
                    hr: () => (
                        <hr className="my-6 border-gray-200" />
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                            {children}
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em className="text-gray-600">
                            {children}
                        </em>
                    ),
                }}
            >
                {content.replace(/\\n/g, '\n')}
            </ReactMarkdown>
        </div>
    );
} 