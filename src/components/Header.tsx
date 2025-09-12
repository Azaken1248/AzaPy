import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPython } from "@fortawesome/free-brands-svg-icons";

export const Header: React.FC = () => (
  <header className="bg-[#18181B] p-3 flex items-center justify-between flex-shrink-0 z-10">
    <div className="flex items-center">
      <h1 className="text-2xl font-bold text-gray-200">
        <FontAwesomeIcon icon={faPython} className="mr-3 text-gray-200" />
        WebPython
      </h1>
    </div>

    <div className="flex items-center gap-2"></div>
  </header>
);
