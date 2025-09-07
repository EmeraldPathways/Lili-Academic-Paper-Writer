
import React, { useState, useEffect } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (output) {
      setCopied(false);
    }
  }, [output]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative h-full">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Generated Content</h2>
        {output && !isLoading && (
          <button
            onClick={handleCopy}
            className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardIcon className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
      <div className="prose prose-slate max-w-none h-[500px] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
             <svg className="animate-spin h-8 w-8 text-emerald-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-medium">Generating your paper...</p>
            <p className="text-sm">This may take a moment.</p>
          </div>
        ) : output ? (
          <pre className="whitespace-pre-wrap font-sans text-base">{output}</pre>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Your generated paper will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
