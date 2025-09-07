
import React from 'react';
import { ReferencingStyle } from '../types';

interface PaperEditorProps {
  style: ReferencingStyle;
  setStyle: (style: ReferencingStyle) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  draft: string;
  setDraft: (draft: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

const StyleButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full py-2.5 text-sm font-semibold focus:outline-none transition-colors duration-200 ${
      isActive
        ? 'bg-emerald-600 text-white shadow-md'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {label}
  </button>
);

const PaperEditor: React.FC<PaperEditorProps> = ({
  style,
  setStyle,
  prompt,
  setPrompt,
  draft,
  setDraft,
  onGenerate,
  isLoading,
  error,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col space-y-6">
      <h2 className="text-xl font-bold text-gray-900 border-b pb-3">
        Writing Assistant
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Referencing Style
        </label>
        <div className="flex rounded-md overflow-hidden">
          <StyleButton
            label="Harvard"
            isActive={style === ReferencingStyle.Harvard}
            onClick={() => setStyle(ReferencingStyle.Harvard)}
          />
          <StyleButton
            label="IEEE"
            isActive={style === ReferencingStyle.IEEE}
            onClick={() => setStyle(ReferencingStyle.IEEE)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Topic / Instructions
        </label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Write an introduction about the impact of AI on modern literature'"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
        />
      </div>
      
      <div>
        <label htmlFor="draft" className="block text-sm font-medium text-gray-700 mb-2">
          Your Draft (Optional)
        </label>
        <textarea
          id="draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={12}
          placeholder="Paste your existing work here, or leave blank to start from scratch..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
        />
      </div>

      {error && <div className="text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</div>}

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Paper'
        )}
      </button>
    </div>
  );
};

export default PaperEditor;
