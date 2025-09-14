import React from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prism-themes/themes/prism-coldark-dark.css";
import "../styles/editor.css";

import { RunIcon, SpinnerIcon } from "./Icons";
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePythonAutocomplete } from "../hooks/usePythonAutocomplete";

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
  const { suggestion, getSuggestion } = usePythonAutocomplete();

  const words = code.split(/[\s\n\(\)\{\}\[\]\.:,;=\+\-\*\/]+/);
  const lastWord = words[words.length - 1] || "";

  let ghostTextRemainder = "";
  if (
    suggestion &&
    lastWord &&
    suggestion.toLowerCase().startsWith(lastWord.toLowerCase()) &&
    suggestion.toLowerCase() !== lastWord.toLowerCase()
  ) {
    ghostTextRemainder = suggestion.substring(lastWord.length);
  }

  const handleValueChange = (newCode: string) => {
    setCode(newCode);
    getSuggestion(newCode);
  };

  const highlightWithSuggestion = (codeValue: string) => {
    const highlightedCode = Prism.highlight(
      codeValue,
      Prism.languages.python,
      "python"
    );

    const escapedGhostText = ghostTextRemainder
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return `${highlightedCode}<span class="ghost-text">${escapedGhostText}</span>`;
  };

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
          <button onClick={onRun}>
            {isBusy ? (
              <>
                <SpinnerIcon />
                Running...
              </>
            ) : (
              <RunIcon />
            )}
          </button>
          <button onClick={onSave}>
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
          </button>
          <button onClick={onUploadClick}>
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
          </button>
        </div>
        <div className="editor-container pt-2 w-full h-full rounded-md border border-gray-700">
          <Editor
            value={code}
            onValueChange={handleValueChange}
            highlight={highlightWithSuggestion}
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
