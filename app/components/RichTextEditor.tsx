import { useEffect, useState } from 'react';
import ClientRichTextEditor from './RichTextEditor.client';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

// This component will only render on the client side
export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="border rounded-md p-4 h-40 mb-12 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Loading editor...</p>
            </div>
        );
    }

    // Dynamically import the client-side only component

    return (
        <ClientRichTextEditor
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}