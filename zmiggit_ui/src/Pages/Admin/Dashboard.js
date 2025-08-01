import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineSlowMotionVideo, MdDeleteSweep } from "react-icons/md";
import { FaFileUpload, FaDatabase, FaCheckCircle } from "react-icons/fa";
import { TbArrowsTransferUp } from "react-icons/tb";
import { VscSymbolMisc } from "react-icons/vsc";
import Source from "../components/Source";
import ExtractSection from "../components/Extract";
import LoadSection from "../components/Load";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("welcome");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadedToDB, setLoadedToDB] = useState(false);
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleLoadToMongo = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    const formData = new FormData();
    formData.append("file", selectedFile);

    return await fetch("http://localhost:9090/extract", {
      method: "POST",
      body: formData,
    });
  };

  const handleLoadToDB2 = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    const formData = new FormData();
    formData.append("file", selectedFile);

    return await fetch("http://localhost:9090/", {
      method: "POST",
      body: formData,
    });
  };



  const navItems = [
    { key: "source", label: "SCM Source", icon: <MdOutlineSlowMotionVideo /> },
    { key: "extract", label: "Endevor Output", icon: <FaFileUpload /> },
    { key: "loaddb", label: "Load DB", icon: <FaDatabase /> },
    { key: "mapping", label: "Mapping", icon: <VscSymbolMisc /> },
    { key: "transform", label: "Transform", icon: <TbArrowsTransferUp /> },
    { key: "cleanup", label: "Cleanup Transform", icon: <MdDeleteSweep /> },
    { key: "validate", label: "Validate & Report", icon: <FaCheckCircle /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-[Poppins]">
      {/* Header */}
      <header className="bg-[#840227] text-white px-6 py-4 shadow-md relative">
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          VRN zMigGIT
        </h1>
        <nav className="absolute top-6 right-6">
          <ul className="text-sm md:text-base font-semibold">
            <li
              className="hover:text-[#67c02b] cursor-pointer"
              onClick={() => navigate("/logout")}
            >
              Logout
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="m-10 flex-2">
          <div className="flex flex-col justify-around h-full">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedSection(item.key)}
                className="w-full flex items-center gap-3 px-4 py-4 bg-[#262626] hover:bg-[#555] rounded-lg text-white text-sm sm:text-base transition duration-200"
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </aside>



        {/* Main Section */}
        <main className="flex-1 bg-white p-6 overflow-y-auto shadow-lg rounded-md mt-10 mb-10 ml-10 mr-10">
          <div className="w-full h-full flex items-center justify-center">
            {selectedSection === "welcome" && (
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#3f3f3f]">
                  Welcome to zMigGIT
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Please select an action to get started.
                </p>
              </div>
            )}

            {selectedSection === "source" && <Source />}

            {selectedSection === "extract" && (
              <div className="w-full flex justify-center items-center">
                <ExtractSection
                  selectedFile={selectedFile}
                  handleFileChange={handleFileChange}
                />
              </div>
            )}

            {selectedSection === "loaddb" && (
              <LoadSection
                selectedFile={selectedFile}
                onLoadMongo={handleLoadToMongo}
                onLoadDB2={handleLoadToDB2}
                setLoadedToDB={setLoadedToDB}
              />
            )}

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#840227] text-white px-6 py-4 text-center text-sm sm:text-base">
        © 2025 zMigGIT. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;
