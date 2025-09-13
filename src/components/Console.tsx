import "prismjs/components/prism-python";
import "prism-themes/themes/prism-coldark-dark.css";
import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import Editor from "react-simple-code-editor";

interface ConsoleProps {
  output: string;
  onCommandSubmit: (command: string) => void;
}

export const Console: React.FC<ConsoleProps> = ({
  output,
  onCommandSubmit,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
    Prism.highlightAll();
  }, [output]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (command.trim() === "") return;

      onCommandSubmit(command);
      if (history[history.length - 1] !== command) {
        setHistory([...history, command]);
      }
      setHistoryIndex(history.length);
      setCommand("");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex <= 0 ? 0 : historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[newIndex]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[newIndex]);
      } else {
        setHistoryIndex(history.length);
        setCommand("");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <label
        htmlFor="output-console"
        className="text-sm font-medium text-gray-400 mb-2"
      >
        Console
      </label>
      <div
        id="output-console"
        className="flex flex-col flex-grow w-full bg-[#000000] text-[#8DA1B9] font-mono p-4 rounded-lg border border-gray-700 overflow-hidden"
      >
        <div ref={outputRef} className="flex-grow overflow-y-auto">
          <pre
            id="lib-output"
            className="whitespace-pre-wrap break-all bg-transparent"
          >
            <code className="language-python bg-transparent">{output}</code>
          </pre>
        </div>
        <div className="flex items-center mt-2 shrink-0">
          <span className="text-gray-400 mr-2">{">"}</span>
          <Editor
            value={command}
            onValueChange={setCommand}
            placeholder="Enter command here...."
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.python, "python")
            }
            onKeyDown={handleKeyDown}
            padding={4}
            className="flex-1 bg-transparent text-[#8DA1B9] font-mono [&_textarea]:outline-none [&_textarea]:ring-0 [&_textarea]:border-0 caret-[#8DA1B9]"
          />
        </div>
      </div>
    </div>
  );
};
