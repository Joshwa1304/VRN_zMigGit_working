import React, { useEffect, useState } from "react";
import { MdAutoDelete } from "react-icons/md";

function Refresh({
  setFileUploaded,
  setLoadedToDB,
  setTransformed,
  setSelectedFile,
  setPlatform
}) {
  const [structure, setStructure] = useState(null);
  const [status, setStatus] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchStructure();
  }, []);

  const fetchStructure = async () => {
    try {
      const response = await fetch("http://localhost:9090/folder-structure");
      const data = await response.json();

      if (Object.keys(data).length === 0) {
        setStatus("📁 Folder is already empty.");
      } else {
        setStructure(data);
        setStatus("");
      }
    } catch (error) {
      console.error("Error fetching structure:", error);
      setStatus("🚫 Failed to load folder structure.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch("http://localhost:9090/cleanup", {
        method: "GET",
      });
      if (response.ok) {
        const msg = await response.text();
        setStatus(`${msg}`);
        setStructure(null);

        setFileUploaded(false);
        setLoadedToDB(false);
        setTransformed(false);
        setSelectedFile(null);
        setPlatform('');
      } else {
        setStatus("❌ Failed to delete files.");
      }
    } catch (error) {
      console.error("Error during delete:", error);
      setStatus("🚫 Server error while deleting files.");
    } finally {
      setDeleting(false);
    }
  };

  const renderTree = (node, depth = 0, isLast = true) => {
    const entries = Object.entries(node);
    return entries.map(([key, value], index) => {
      const isFolder = typeof value === 'object';
      const prefix = depth === 0 ? '' :
        `${'│   '.repeat(depth - 1)}${isLast && index === entries.length - 1 ? ' └── ' : ' ├── '}`;

      return (
        <div key={key} className="ml-2">
          <div className="text-sm font-mono whitespace-pre">
            {prefix}📁 {key}
          </div>
          {isFolder && renderTree(value, depth + 1, index === entries.length - 1)}
        </div>
      );
    });
  };

  return (
    <div className="p-7 items-center">
      {structure && (
        <div>
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Folder Structure (to be deleted):
            </h3>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-64 border border-gray-300">
              {renderTree(structure)}
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 bg-[#262626] hover:bg-[#555] text-white font-semibold px-4 py-2 ml-[18%] rounded transition disabled:opacity-60"
          >
            <MdAutoDelete size={20} />
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      )}

      {status && (
        <p className="text-green-700 font-semibold text-center bg-green-100 px-6 py-3 rounded-lg">{status}</p>
      )}
    </div>
  );
}

export default Refresh;
