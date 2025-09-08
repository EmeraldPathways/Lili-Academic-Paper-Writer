
import React from 'react';
import { HistoryItem } from '../types';
import TrashIcon from './icons/TrashIcon';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoad: (id: number) => void;
  onDelete: (id: number) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onDelete, onClear }) => {
  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Analysis History</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            aria-label="Clear all history entries"
          >
            Clear All
          </button>
        )}
      </div>
      {history.length > 0 ? (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {history.map((item) => (
            <li key={item.id} className="group flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-emerald-50 transition-colors">
              <button onClick={() => onLoad(item.id)} className="flex-grow text-left overflow-hidden">
                <p className="font-medium text-gray-800 truncate" title={item.draft}>
                  {item.draft.substring(0, 80) || 'Untitled Draft'}{item.draft.length > 80 ? '...' : ''}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.timestamp).toLocaleString()} - Style: {item.style}
                </p>
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="ml-4 p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                aria-label="Delete history item"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Your analysis history will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
