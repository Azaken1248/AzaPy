import React from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prism-themes/themes/prism-coldark-dark.css";
import "../styles/editor.css";
import { RunIcon, SpinnerIcon } from "./Icons";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onRun: () => void;
  isBusy: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onRun,
  setCode,
  isBusy,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor="code-editor"
          className="text-sm font-medium text-gray-400"
        >
          Code Editor
        </label>
      </div>

      <div className="relative flex-1 min-h-0">
        <button
          onClick={onRun}
          disabled={isBusy}
          className="absolute top-2 right-2 z-10 bg-[#121212] hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-[#8DA0B4] px-3 py-1 rounded-md flex items-center gap-2 transition-colors duration-200"
        >
          {isBusy ? (
            <>
              <SpinnerIcon />
              Running...
            </>
          ) : (
            <>
              <RunIcon />
              Run
            </>
          )}
        </button>
        <div className="editor-container pt-2 w-full h-full rounded-md border border-gray-700">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.python, "python")
            }
            padding={{ top: 16, right: 16, bottom: 16, left: 16 }}
            className="editor"
            disabled={isBusy}
            textareaId="code-editor"
          />
        </div>
      </div>
    </div>
  );
};
