
import React, { useState, useCallback } from 'react';
import { ReferencingStyle } from './types';
import { generatePaper } from './services/geminiService';
import Header from './components/Header';
import PaperEditor from './components/PaperEditor';
import OutputDisplay from './components/OutputDisplay';

const App: React.FC = () => {
  const [style, setStyle] = useState<ReferencingStyle>(ReferencingStyle.Harvard);
  const [prompt, setPrompt] = useState<string>('');
  const [draft, setDraft] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please provide a topic or instructions for the AI.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      const result = await generatePaper(prompt, draft, style);
      setOutput(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, draft, style]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PaperEditor
            style={style}
            setStyle={setStyle}
            prompt={prompt}
            setPrompt={setPrompt}
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
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Gemini API. Designed for academic excellence.</p>
      </footer>
    </div>
  );
};

export default App;
