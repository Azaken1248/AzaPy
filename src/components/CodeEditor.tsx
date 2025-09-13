import React from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prism-themes/themes/prism-coldark-dark.css";
import "../styles/editor.css";
import { RunIcon, SpinnerIcon } from "./Icons";
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onRun: () => void;
  onSave: () => void;
  onUploadClick: () => void;
  isBusy: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onRun,
  onSave,
  setCode,
  onUploadClick,
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
        <div className="absolute top-2 right-2 z-10 flex flex-row">
          <button
            onClick={onRun}
            disabled={isBusy}
            title={isBusy ? "Running..." : "Run"}
            className="bg-[#121212] hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-[#8DA0B4] px-3 py-1 rounded-md flex items-center gap-2 transition-colors duration-200"
          >
            {isBusy ? (
              <>
                <SpinnerIcon />
                Running...
              </>
            ) : (
              <>
                <RunIcon />
              </>
            )}
          </button>
          <button
            onClick={onSave}
            title="Download Code"
            className="rounded bg-[#121212]px-3 py-1.5 text-sm font-semibold text-[#8DA0B4] shadow-sm hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:none transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
          </button>
          <button
            onClick={onUploadClick}
            title="Upload Code"
            className="rounded bg-[#121212] px-3 py-1.5 text-sm font-semibold text-[#8DA0B4] hover:text-blue-300 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
          </button>
        </div>
        <div className="editor-container pt-2 w-full h-full rounded-md border border-gray-700">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.python, "python")
            }
            padding={{ top: 16, right: 16, bottom: 16, left: 16 }}
            className="editor mt-3.5"
            disabled={isBusy}
            textareaId="code-editor"
          />
        </div>
      </div>
    </div>
  );
};
