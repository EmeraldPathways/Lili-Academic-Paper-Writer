
import React, { useState, useCallback, useEffect } from 'react';
import { ReferencingStyle, HistoryItem } from './types';
import { generatePaper } from './services/geminiService';
import Header from './components/Header';
import PaperEditor from './components/PaperEditor';
import OutputDisplay from './components/OutputDisplay';
import HistoryPanel from './components/HistoryPanel';

const STORAGE_KEY = 'academicPaperWriterState';

const App: React.FC = () => {
  const [style, setStyle] = useState<ReferencingStyle>(ReferencingStyle.Harvard);
  const [draft, setDraft] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load state from local storage on initial render
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.style) setStyle(savedState.style);
        if (savedState.draft) setDraft(savedState.draft);
        if (savedState.output) setOutput(savedState.output);
        if (savedState.history) setHistory(savedState.history);
      }
    } catch (e) {
      console.error("Failed to load state from local storage:", e);
    }
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = JSON.stringify({ style, draft, output, history });
      localStorage.setItem(STORAGE_KEY, stateToSave);
    } catch (e) {
      console.error("Failed to save state to local storage:", e);
    }
  }, [style, draft, output, history]);


  const handleGenerate = useCallback(async () => {
    if (!draft.trim()) {
      setError('Please provide your text in the editor to get feedback.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      const result = await generatePaper(draft, style);
      setOutput(result);
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        draft,
        output: result,
        style,
        timestamp: new Date().toISOString(),
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [draft, style]);

  const handleLoadHistory = (id: number) => {
    const item = history.find(h => h.id === id);
    if (item) {
      setDraft(item.draft);
      setOutput(item.output);
      setStyle(item.style);
      window.scrollTo(0, 0);
    }
  };

  const handleDeleteHistory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this history item?')) {
      setHistory(history.filter(h => h.id !== id));
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PaperEditor
            style={style}
            setStyle={setStyle}
            draft={draft}
            setDraft={setDraft}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            error={error}
          />
          <OutputDisplay
            output={output}
            isLoading={isLoading}
          />
        </div>
        <HistoryPanel
          history={history}
          onLoad={handleLoadHistory}
          onDelete={handleDeleteHistory}
          onClear={handleClearHistory}
        />
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Gemini API. Designed for academic excellence.</p>
      </footer>
    </div>
  );
};

export default App;
