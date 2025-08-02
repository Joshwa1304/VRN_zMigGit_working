import { useState } from 'react';
import { TbReport } from "react-icons/tb";

function ValidateSection() {
  const [loadingSize, setLoadingSize] = useState(false);
  const [loadingCount, setLoadingCount] = useState(false);

  const generateReport = (type) => {
    if (type === "size") {
      setLoadingSize(true);
      setTimeout(() => {
        setLoadingSize(false);
        window.open("http://localhost:9090/reports/filesize", "_blank");
      }, 1500);
    } else {
      setLoadingCount(true);
      setTimeout(() => {
        setLoadingCount(false);
        window.open("http://localhost:9090/reports/filecount", "_blank");
      }, 1500);
    }
  };

  return (
    <div className="p-6 bg-white max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Validation Reports</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* File Size Report */}
        <div className="bg-gray-100 p-5 rounded-xl shadow flex flex-col items-center justify-between">
          <div className="flex flex-col items-center mb-4">
            <span className="text-4xl">📄</span>
            <h3 className="text-lg font-semibold mt-2">File Size Report</h3>
          </div>
          {loadingSize ? (
            <div className="w-6 h-6 border-4 border-t-transparent border-blue-600 rounded-full animate-spin" />
          ) : (
            <button
              onClick={() => generateReport("size")}
              className="flex items-center gap-2 bg-[#262626] hover:bg-[#555] text-white px-4 py-2 rounded transition"
            >
              <TbReport className="text-xl" /> Generate Report
            </button>
          )}
        </div>

        {/* File Count Report */}
        <div className="bg-gray-100 p-5 rounded-xl shadow flex flex-col items-center justify-between">
          <div className="flex flex-col items-center mb-4">
            <span className="text-4xl">📄</span>
            <h3 className="text-lg font-semibold mt-2">File Count Report</h3>
          </div>
          {loadingCount ? (
            <div className="w-6 h-6 border-4 border-t-transparent border-blue-600 rounded-full animate-spin" />
          ) : (
            <button
              onClick={() => generateReport("count")}
              className="flex items-center gap-2 bg-[#262626] hover:bg-[#555] text-white px-4 py-2 rounded transition"
            >
              <TbReport className="text-xl" /> Generate Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ValidateSection;
