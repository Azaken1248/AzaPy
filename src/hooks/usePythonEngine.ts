import { useState, useEffect } from 'react';


interface Pyodide {
  runPythonAsync: (code: string) => Promise<any>;
  setStdout: (options: { batched: (output: string) => void }) => void;
  setStderr: (options: { batched: (output: string) => void }) => void;
  loadPackagesFromImports: (code: string) => Promise<void>;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<Pyodide>;
  }
}

export const usePythonEngine = () => {
  const [pyodide, setPyodide] = useState<Pyodide | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const PYODIDE_SCRIPT_URL = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
    const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/";

    const initializePyodide = () => {
      const script = document.createElement('script');
      script.src = PYODIDE_SCRIPT_URL;
      script.async = true;

      script.onload = async () => {
        try {
          const pyodideInstance = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
          setPyodide(pyodideInstance);
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setIsLoading(false);
        }
      };

      script.onerror = () => {
        setError("Failed to load the Pyodide script from the CDN.");
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    initializePyodide();
  }, []);

  const runPython = async (code: string): Promise<string> => {
    if (!pyodide) {
      return "Error: Pyodide is not loaded.";
    }

    setIsRunning(true);
    let output = '';

    try {
      pyodide.setStdout({ batched: (str) => { output += str + '\n'; }});
      pyodide.setStderr({ batched: (str) => { output += str + '\n'; }});

      await pyodide.loadPackagesFromImports(code);
      const result = await pyodide.runPythonAsync(code);

      if (result !== undefined) {
        output += `<-- ${String(result)}`;
      }
    } catch (e) {
      output += String(e);
    } finally {
      setIsRunning(false);
    }

    return output.trim();
  };

  return { isLoading, isRunning, error, runPython };
};
