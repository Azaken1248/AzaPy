import React, { useEffect, useRef } from "react";

interface ConsoleProps {
  output: string;
}

export const Console: React.FC<ConsoleProps> = ({ output }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

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
        ref={outputRef}
        className="flex-grow w-full bg-[#000000] text-[#8DA1B9] font-mono p-4 rounded-lg border border-gray-700 overflow-y-auto"
      >
        <pre className="whitespace-pre-wrap break-words">{output}</pre>
      </div>
    </div>
  );
};
