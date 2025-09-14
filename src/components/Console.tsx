import "prismjs/components/prism-python";
import "prism-themes/themes/prism-coldark-dark.css";
import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import Editor from "react-simple-code-editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileCode,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

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

  const downloadFile = (
    filename: string,
    content: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMD = () => {
    let mdContent = "```python\n" + output + "\n```\n\n";

    if (outputRef.current) {
      const originalCanvases =
        outputRef.current.querySelectorAll<HTMLCanvasElement>(
          ".mpl-container canvas"
        );

      if (originalCanvases.length > 0) {
        mdContent += "## Matplotlib Plots\n\n";
        originalCanvases.forEach((canvas, index) => {
          const dataUrl = canvas.toDataURL("image/png");
          mdContent += `![Plot ${index + 1}](${dataUrl})\n\n`;
        });
      }
    }

    downloadFile("console-output.md", mdContent.trim(), "text/markdown");
  };

  const getConsoleHtmlContent = (): string => {
    if (!outputRef.current) return "";

    const contentClone = outputRef.current.cloneNode(true) as HTMLElement;

    const originalContainers =
      outputRef.current.querySelectorAll(".mpl-container");
    const clonedContainers = contentClone.querySelectorAll(".mpl-container");

    originalContainers.forEach((originalContainer, index) => {
      const clonedContainer = clonedContainers[index];
      if (!clonedContainer) return;

      const originalCanvas =
        originalContainer.querySelector<HTMLCanvasElement>("canvas");

      const allClonedCanvases =
        clonedContainer.querySelectorAll<HTMLCanvasElement>("canvas");

      if (!originalCanvas || allClonedCanvases.length === 0) {
        return;
      }

      const mainClonedCanvas = allClonedCanvases[0];

      const dataUrl = originalCanvas.toDataURL("image/png");

      const img = document.createElement("img");
      img.src = dataUrl;
      img.style.display = "block";
      img.style.maxWidth = "90%";
      img.style.maxHeight = "600px";
      img.style.margin = "1rem auto";
      img.style.border = "1px solid #374151";
      img.style.borderRadius = "0.25rem";

      mainClonedCanvas.parentNode?.replaceChild(img, mainClonedCanvas);

      for (let i = 1; i < allClonedCanvases.length; i++) {
        allClonedCanvases[i].remove();
      }
    });
    contentClone
      .querySelectorAll(".matplotlib-toolbar-button")
      .forEach((toolbar) => {
        toolbar.remove();
      });

    const renderedHtml = contentClone.innerHTML;
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Console Output</title>
          <style>
              body { 
                  background-color: #18181B; 
                  font-family: sans-serif; 
                  padding: 20px;
                  margin: 0;
              }
              h1 {
                color: #8DA1B9;
              }
              .console-container {
                  background-color: #000000;
                  color: #8DA1B9;
                  font-family: monospace;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  border: 1px solid #374151;
                  overflow-x: auto;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
              }
              .console-container pre {
                  margin: 0;
                  white-space: pre-wrap;      
                  word-break: break-all;    
              }
              pre[class*="language-"],
              code[class*="language-"] {
                background: transparent !important;
                color: #8DA1B9 !important;
                white-space: pre-wrap !important;
                word-break: break-word;
              }
          </style>
      </head>
      <body>
          <h1>Console Output</h1>
          <div class="console-container">
              ${renderedHtml}
          </div>
      </body>
      </html>
    `;
  };

  const handleDownloadHTML = () => {
    const htmlContent = getConsoleHtmlContent();
    const fullHtml = htmlContent.replace(
      "<title>Console Output</title>",
      `<title>Console Output</title>\n    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-coldark-dark.min.css" rel="stylesheet" />`
    );
    downloadFile("console-output.html", fullHtml, "text/html");
  };

  const handlePrintPDF = () => {
    const htmlContent = getConsoleHtmlContent();
    const prismThemeUrl =
      "https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-coldark-dark.min.css";

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked! Please allow popups to print the PDF.");
      return;
    }

    printWindow.document.write(htmlContent);
    const link = printWindow.document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = prismThemeUrl;

    link.onload = () => {
      printWindow.focus();
      printWindow.print();
    };

    link.onerror = () => {
      console.error(
        "Failed to load print stylesheet. Printing with base styles."
      );
      printWindow.focus();
      printWindow.print();
    };

    printWindow.document.head.appendChild(link);

    printWindow.document.close();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor="output-console"
          className="text-sm font-medium text-gray-400"
        >
          Console
        </label>
      </div>

      <div
        id="output-console"
        className="relative flex flex-col flex-grow w-full bg-[#000000] text-[#8DA1B9] font-mono p-4 rounded-lg border border-gray-700 overflow-hidden"
      >
        <div className="absolute top-2 right-2 z-10 flex flex-row">
          <button
            onClick={handlePrintPDF}
            title="Save as PDF"
            className="rounded-l-md bg-[#000000] px-3 py-1.5 text-sm font-semibold text-[#8DA0B4] shadow-sm hover:text-red-400 focus-visible:outline-none transition-colors duration-200 "
          >
            <FontAwesomeIcon icon={faFilePdf} />
          </button>
          <button
            onClick={handleDownloadHTML}
            title="Download as HTML"
            className="bg-[#000000] px-3 py-1.5 text-sm font-semibold text-[#8DA0B4] shadow-sm hover:text-orange-400 focus-visible:outline-none transition-colors duration-200 "
          >
            <FontAwesomeIcon icon={faFileCode} />
          </button>
          <button
            onClick={handleDownloadMD}
            title="Download as Markdown"
            className="rounded-r-md bg-[#0000000] px-3 py-1.5 text-sm font-semibold text-[#8DA0B4] shadow-sm hover:text-blue-400 focus-visible:outline-none transition-colors duration-200 "
          >
            <FontAwesomeIcon icon={faFileLines} />
          </button>
        </div>

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
