import { ReferencingStyle } from '../types';

export const generatePaper = async (
  draft: string,
  style: ReferencingStyle
): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ draft, style }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error generating paper:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while communicating with the server: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the paper.");
  }
};
