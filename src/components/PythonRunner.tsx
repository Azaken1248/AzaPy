import React, { useState, useEffect } from "react";
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

  const handleRun = async () => {
    setOutput((prev) => prev + `\n> Running code...\n`);
    const result = await runPython(code);
    setOutput((prev) => prev + result + "\n");
  };

  useEffect(() => {
    if (!isLoading) {
      setOutput(error ? `Error: ${error}` : "Python environment ready.");
    }
  }, [isLoading, error]);

  return (
    <div className="bg-[#18181B] text-gray-200 font-sans flex flex-col h-screen antialiased">
      {isLoading && <LoadingSpinner />}

      <Header
        onSave={function (): void {
          throw new Error("Function not implemented.");
        }}
        onDownload={function (): void {
          throw new Error("Function not implemented.");
        }}
        onUploadClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <CodeEditor
          onRun={handleRun}
          code={code}
          setCode={setCode}
          isBusy={isLoading || isRunning}
        />
        <Console output={output} />
      </main>
    </div>
  );
};
