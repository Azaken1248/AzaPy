import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { faPython } from "@fortawesome/free-brands-svg-icons";

interface HeaderProps {
  onSave: () => void;
  onDownload: () => void;
  onUploadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSave,
  onDownload,
  onUploadClick,
}) => (
  <header className="bg-[#18181B] p-3 flex items-center justify-between flex-shrink-0 z-10">
    <div className="flex items-center">
      <h1 className="text-2xl font-bold text-gray-200">
        <FontAwesomeIcon icon={faPython} className="mr-3 text-gray-200" />
        WebPython
      </h1>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={onSave}
        title="Force save to cloud (Not implemented)"
        className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <FontAwesomeIcon icon={faCloudArrowUp} className="mr-2" />
        Save
      </button>
      <button
        onClick={onDownload}
        title="Download session (Not implemented)"
        className="rounded bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-500"
      >
        <FontAwesomeIcon icon={faDownload} className="mr-2" />
        Download
      </button>
      <button
        onClick={onUploadClick}
        title="Upload session (Not implemented)"
        className="rounded bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-500"
      >
        <FontAwesomeIcon icon={faUpload} className="mr-2" />
        Upload
      </button>
    </div>
  </header>
);
