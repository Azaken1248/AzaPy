import { useState, useCallback } from 'react';
import { PYTHON_COMPLETIONS } from '../utils/pythonCompletionsData'; 

const matchCase = (input: string, suggestion: string): string => {
  if (!input) return suggestion;
  if (input.toUpperCase() === input) return suggestion.toUpperCase();
  if (input.toLowerCase() === input) return suggestion.toLowerCase();
  if (
    input.length > 0 &&
    input[0] === input[0].toUpperCase() &&
    input.substring(1).toLowerCase() === input.substring(1)
  ) {
    return suggestion.charAt(0).toUpperCase() + suggestion.slice(1).toLowerCase();
  }
  return suggestion;
};

export const usePythonAutocomplete = () => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [suggestionType, setSuggestionType] = useState<string>(''); 

  const getSuggestion = useCallback((code: string) => {
    if (!code || code.endsWith(' ') || code.endsWith('\n')) {
      setSuggestion('');
      setSuggestionType(''); 
      return;
    }

    const words = code.split(/[\s\n\(\)\{\}\[\]\.:,;=\+\-\*\/]+/);
    const lastWord = words[words.length - 1] || '';

    if (!lastWord) {
      setSuggestion('');
      setSuggestionType(''); 
      return;
    }


    const foundMatch = PYTHON_COMPLETIONS.find(
      (k) =>
        k.value.toLowerCase().startsWith(lastWord.toLowerCase()) &&
        k.value.toLowerCase() !== lastWord.toLowerCase()
    );

    if (foundMatch) {
      setSuggestion(matchCase(lastWord, foundMatch.value));
      setSuggestionType(foundMatch.type); 
    } else {
      setSuggestion('');
      setSuggestionType('');
    }
  }, []);

  return { suggestion, suggestionType, getSuggestion, setSuggestion };
};