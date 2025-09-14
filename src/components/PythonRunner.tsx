import React, { useState, useEffect, useRef } from "react";
import { usePythonEngine } from "../hooks/usePythonEngine";
import { Header } from "./Header";
import { CodeEditor } from "./CodeEditor";
import { Console } from "./Console";
import { LoadingSpinner } from "./LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode, faTerminal } from "@fortawesome/free-solid-svg-icons";

const initialCode = `import sys

def main():
    print("Hello, world!")

if __name__ == "__main__":
    main()
`;

type Command = {
  command: string;
  description: string;
};

function wrapText(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if ((line + word).length > width) {
      lines.push(line.trimEnd());
      line = word + " ";
    } else {
      line += word + " ";
    }
  }
  if (line) lines.push(line.trimEnd());
  return lines;
}

function formatTable(commands: Command[], maxWidth = 80): string {
  const maxCmdLen = Math.max(
    ...commands.map((c) => c.command.length),
    "Command".length
  );
  const descWidth = maxWidth - (maxCmdLen + 7);

  const pad = (text: string, length: number): string =>
    text + " ".repeat(length - text.length);

  const line = `+${"-".repeat(maxCmdLen + 2)}+${"-".repeat(descWidth + 2)}+`;
  let table = line + "\n";
  table += `| ${pad("Command", maxCmdLen)} | ${pad(
    "Description",
    descWidth
  )} |\n`;
  table += line + "\n";

  for (const row of commands) {
    const wrappedDesc = wrapText(row.description, descWidth);
    const firstLine = `| ${pad(row.command, maxCmdLen)} | ${pad(
      wrappedDesc[0],
      descWidth
    )} |\n`;
    table += firstLine;

    for (let i = 1; i < wrappedDesc.length; i++) {
      table += `| ${" ".repeat(maxCmdLen)} | ${pad(
        wrappedDesc[i],
        descWidth
      )} |\n`;
    }
  }

  table += line;
  return table;
}

const commands: Command[] = [
  { command: "man, help", description: "Shows this list of commands." },
  { command: "clear", description: "Clears the console screen." },
  {
    command: "echo [text]",
    description: "Prints the given text back to the console.",
  },
  { command: "<python>", description: "Run any Python syntax." },
];

type ActiveView = "editor" | "console";

export const PythonRunner: React.FC = () => {
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string>("");
  const { isLoading, isRunning, error, runPython } = usePythonEngine();

  const [activeView, setActiveView] = useState<ActiveView>("editor");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: {
    name: string;
    key: ActiveView;
    icon: any;
    activeClass: string;
  }[] = [
    {
      name: "Editor",
      key: "editor",
      icon: faFileCode,
      activeClass: "border-indigo-500 text-indigo-400",
    },
    {
      name: "Console",
      key: "console",
      icon: faTerminal,
      activeClass: "border-yellow-500 text-yellow-400",
    },
  ];

  const handleRun = async () => {
    setOutput((prev) => prev + `\n--- Running Script ---\n`);
    setActiveView("console");

    const result = await runPython(code);
    setOutput((prev) => prev + result + "\n--- Script Finished ---\n");
  };

  const handleCommandSubmit = async (command: string) => {
    setOutput((prevOutput) => prevOutput + `> ${command}\n`);

    const trimmedCommand = command.trim();
    const commandName = trimmedCommand.split(/\s+/)[0].toLowerCase();

    switch (commandName) {
      case "cls":
      case "clear":
        setOutput("");
        const plotDivs = document.querySelectorAll('div[id^="matplotlib_"]');
        plotDivs.forEach((div) => div.remove());
        break;

      case "man":
      case "help":
        setOutput((prev) => prev + formatTable(commands) + "\n");
        break;

      case "echo":
        setOutput(
          (prev) =>
            prev +
            (trimmedCommand.startsWith("echo ")
              ? trimmedCommand.slice(5)
              : "") +
            "\n"
        );

        break;
      default:
        try {
          const result = await runPython(trimmedCommand);
          setOutput((prev) => prev + result + "\n");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred.";
          setOutput((prev) => prev + `Error: ${errorMessage}\n`);
        }
        break;
    }
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
    if (!file) return;

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
      setOutput(
        error
          ? `Error: ${error}`
          : "Python Environment Ready\ntype 'help' to see the list of commands\n"
      );
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

      <main className="flex-grow flex flex-col overflow-hidden">
        <div className="mb-2 border-b border-zinc-700 md:hidden">
          <nav className="-mb-px flex space-x-6 px-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                className={`${
                  activeView === tab.key
                    ? tab.activeClass
                    : "border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300"
                } flex items-center whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium`}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-grow flex flex-col md:flex-row md:gap-4 overflow-hidden p-4">
          <div
            className={`
              ${activeView === "editor" ? "flex" : "hidden"}
              flex-col flex-grow
              md:flex md:flex-1
              overflow-hidden
            `}
          >
            <CodeEditor
              onRun={handleRun}
              onSave={handleSave}
              code={code}
              setCode={setCode}
              isBusy={isLoading || isRunning}
              onUploadClick={handleUploadClick}
            />
          </div>

          <div
            className={`
              ${activeView === "console" ? "flex" : "hidden"}
              flex-col flex-grow
              md:flex md:flex-1
              overflow-hidden
            `}
          >
            <Console output={output} onCommandSubmit={handleCommandSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
};
