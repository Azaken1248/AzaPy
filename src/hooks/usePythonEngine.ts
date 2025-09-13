import { useState, useEffect } from 'react';
import "../styles/matplotlib.css";


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
  interface Document {
    pyodideMplTarget?: HTMLElement | null;
  }
}

const styleMatplotlibToolbar = () => {
  const toolbar = document.querySelector(".matplotlib-toolbar");
  if (!toolbar) return;
  const pdfBtn = toolbar.querySelector("button#text:nth-of-type(1)");
  if (pdfBtn) {
    pdfBtn.className = "fa fa-file-pdf matplotlib-toolbar-button";
    pdfBtn.removeAttribute("id");
    pdfBtn.setAttribute("title", "Save as PDF");
  }

  const pngBtn = toolbar.querySelector("button#text:nth-of-type(2)");
  if (pngBtn) {
    pngBtn.className = "fa fa-file-image matplotlib-toolbar-button";
    pngBtn.removeAttribute("id");
    pngBtn.setAttribute("title", "Save as PNG");
  }

  const svgBtn = toolbar.querySelector("button#text:nth-of-type(3)");
  if (svgBtn) {
    svgBtn.className = "fa fa-file-code matplotlib-toolbar-button";
    svgBtn.removeAttribute("id");
    svgBtn.setAttribute("title", "Save as SVG");
  }
};


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

    let fullCode = code;

    if (/\bmatplotlib\b/.test(code)) {

      const parent = document.getElementById("lib-output");
        if (parent) {
        const container = document.createElement("div");
        container.className = "mpl-container";
        container.id = `matplotlib_${Date.now()}`;
        parent.appendChild(container);

        document.pyodideMplTarget = container;
      }

      fullCode = `
import matplotlib
matplotlib.use("module://matplotlib_pyodide.html5_canvas_backend")
` + code;
    }

    await pyodide.loadPackagesFromImports(fullCode);
    const result = await pyodide.runPythonAsync(fullCode);

    if (result !== undefined) {
      output += `<-- ${String(result)}`;
    }
  } catch (e) {
    output += String(e);
  } finally {
    setIsRunning(false);
  }

  styleMatplotlibToolbar();

  return output.trim();
};


  return { isLoading, isRunning, error, runPython };
};
