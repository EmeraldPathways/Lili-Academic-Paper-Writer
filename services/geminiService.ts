import { GoogleGenAI } from "@google/genai";
import { ReferencingStyle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getFullPrompt = (draft: string, style: ReferencingStyle): string => {
    const nciWritingGuide = `
    **1. Accuracy & Specificity:**
       - Avoid vague phrases (e.g., 'about / several', 'a long time ago'). Use exact figures and values.
       - Be specific about time frames, people ('who exactly?'), and places ('where?').

    **2. Conciseness:**
       - Avoid unnecessary academic complexity and wordiness. Use plain language where possible.
       - Aim for one main idea per sentence, keeping sentences to a reasonable length (e.g., under 25 words).
       - Avoid phrasal verbs where a single-word alternative exists (e.g., use 'increase' instead of 'go up').

    **3. Formality:**
       - Avoid colloquial terms (e.g., use 'a little / rather' instead of 'a bit'; 'many factors' instead of 'loads of things').
       - Avoid contractions (e.g., use 'do not' instead of 'don't').
       - Use formal alternatives for common expressions (e.g., 'assist' instead of 'help'; 'enquire' instead of 'ask').

    **4. Objectivity / Impersonality:**
       - Use the third person. Avoid personal pronouns like 'I', 'you', 'we'.
       - Rephrase subjective statements. Instead of "I think that...", use "It could be argued that...". Instead of "I believe...", use "Research suggests...".

    **5. Critical Tone:**
       - Move beyond simple description. Analyze and evaluate information in relation to the assignment question.
       - Answer the 'so what?' question – why is the information important?

    **6. Language and Tone:**
       - Writing should be emotionally neutral. Avoid emotive, exaggerated, or biased language (e.g., 'amazing', 'terrible', 'dreadful').
       - Avoid rhetorical questions; use statements instead.
       - Use neutral, gender-inclusive language (e.g., "A researcher must confirm their results").

    **7. Abbreviations & Numbers:**
       - On first use, state the full name followed by the acronym in brackets, e.g., "North Atlantic Treaty Organization (NATO)". Use the acronym thereafter.
       - Use words for numbers below 10. Use numerals for 10 and above.
    `;
    let styleInstructions = style === 'IEEE' ? `
      You must adhere strictly to the IEEE referencing style. Key rules are:
      1.  **In-text citations:** Use numerical citations in square brackets, e.g., [1].
      2.  **Reference List:** Must be titled "References" and ordered numerically, corresponding to the in-text citation numbers.
    ` : `
      You must adhere strictly to the Harvard referencing style. Key rules are:
      1.  **In-text citations:** Use the author-date format, e.g., (Smith, 2023). For quotes, add page number (Smith, 2023, p. 12).
      2.  **Reference List:** Must be titled "References" and ordered alphabetically by author's surname.
    `;

    return `
    Your task is to act as an expert academic writing tutor from the National College of Ireland (NCI). Your goal is to analyze a student's text and provide constructive feedback based on the official NCI Academic Writing Guide. You will then, as a final step, add citations and a reference list.

    **NCI Academic Writing Guide Summary:**
    ${nciWritingGuide}

    **Your Process:**
    1.  **Analyze the Text:** Read the user's text carefully and compare it against each point in the NCI guide.
    2.  **Provide Structured Feedback:**
        - Create a section for each category of the NCI guide (e.g., Conciseness, Formality, Objectivity).
        - Under each section, quote the specific part of the user's text that could be improved.
        - Clearly explain the issue and provide a concrete suggestion for improvement, referencing the NCI rule.
        - If there are no issues in a category, state "No issues found."
        - Format your feedback using Markdown for clarity (e.g., use '###' for headers, '*' or '-' for bullet points, and code blocks for quotes).
    3.  **Add Citations and References:**
        - After the feedback section, create a final section titled "### Revised Text with Citations (${style} Style)".
        - In this section, present the user's original text again, but this time with correctly formatted in-text citations inserted where claims need supporting evidence.
        - **CRITICAL RULE:** For this step ONLY, do not change the user's original wording. Only insert the citations.
        - Generate a plausible, high-quality academic reference list that matches the in-text citations. The list must be perfectly formatted according to the user's selected style.
        - Append this reference list under a "### Reference List" heading.

    **User's Selected Referencing Style:** ${style}
    ${styleInstructions}

    **User's Text to Process:**
    ---
    ${draft}
    ---

    Begin your response with the title "### Analysis of Your Writing".
  `;
};


export const generatePaper = async (
  draft: string,
  style: ReferencingStyle
): Promise<string> => {
  try {
    const fullPrompt = getFullPrompt(draft, style);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: `You are a world-class academic writing assistant from the National College of Ireland. Your expertise is in analyzing student writing against the official NCI guidelines. You provide clear, constructive, and actionable feedback to help students improve their work. You are an expert in Harvard and IEEE referencing.`,
        temperature: 0.5,
        topP: 0.95,
        topK: 40
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating paper with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while communicating with the Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the paper.");
  }
};
