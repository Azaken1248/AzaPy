import React, { useState, useEffect, useRef } from "react";
import { usePythonEngine } from "../hooks/usePythonEngine";
import { Header } from "./Header";
import { CodeEditor } from "./CodeEditor";
import { Console } from "./Console";
import { LoadingSpinner } from "./LoadingSpinner";

const initialCode = `# Welcome to the Python Pad!
# Type your Python code here and click "Run".

import numpy as np

a = np.array([1, 2, 3])
print(f"Here is a numpy array: {a}")

# The result of the last expression is also displayed
[x * 2 for x in range(10)]
`;

export const PythonRunner: React.FC = () => {
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string>("");
  const { isLoading, isRunning, error, runPython } = usePythonEngine();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRun = async () => {
    setOutput((prev) => prev + `\n> Running code...\n`);
    const result = await runPython(code);
    setOutput((prev) => prev + result + "\n");
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: "text/python" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "script.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCode(text);
    };
    reader.readAsText(file);

    event.target.value = "";
  };

  useEffect(() => {
    if (!isLoading) {
      setOutput(error ? `Error: ${error}` : "Python environment ready.");
    }
  }, [isLoading, error]);

  return (
    <div className="bg-[#18181B] text-gray-200 font-sans flex flex-col h-screen antialiased">
      {isLoading && <LoadingSpinner />}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".py, .txt"
      />

      <Header />

      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <CodeEditor
          onRun={handleRun}
          onSave={handleSave}
          code={code}
          setCode={setCode}
          isBusy={isLoading || isRunning}
          onUploadClick={handleUploadClick}
        />
        <Console output={output} />
      </main>
    </div>
  );
};
