import { useState, useEffect } from "react";
import { SiMongodb } from "react-icons/si";
import { LuDatabaseBackup } from "react-icons/lu";

function LoadSection({ selectedFile, onLoadMongo, onLoadDB2, setLoadedToDB }) {
  const [selectedDB, setSelectedDB] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    if (selectedFile && selectedDB) {
      handleLoad(selectedDB);
    }
    else{
      setBackendMessage("No file selected. Please choose a file from the Endevor Output section.")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDB, selectedFile]);
  const handleLoad = async (db) => {
    setLoading(true);
    setProgress(0);
    setBackendMessage('');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 90) {
        clearInterval(interval); // Stop before 100%, wait for backend
      }
    }, 200); // animation speed

    try {
      let response;
      if (db === 'mongo') {
        response = await onLoadMongo();
      } else if (db === 'db2') {
        response = await onLoadDB2();
      }

      const text = await response.text();
      const cleanedText = text.trim().toLowerCase();
      setBackendMessage(text);

      if (
        cleanedText.includes("ok") ||
        cleanedText.includes("success") ||
        cleanedText.includes("already exists")
      ) {
        setLoadedToDB(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setBackendMessage("🚫 Error while uploading.");
    } finally {
      // Wait briefly to simulate progress completion
      setTimeout(() => {
        setProgress(100);
        setLoading(false);
      }, 500); // adjust delay if needed
    }
  };


  const handleDBSelect = (db) => {
    setSelectedDB(db);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      {!selectedDB ? (
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => handleDBSelect('mongo')}
            className="bg-[#262626] hover:bg-[#555] text-white font-semibold py-3 px-6 rounded-md shadow flex items-center gap-2 transition-all"
          >
            <SiMongodb className="text-lg" />
            Load to MongoDB
          </button>
          <button
            onClick={() => handleDBSelect('db2')}
            className="bg-[#262626] hover:bg-[#555] text-white font-semibold py-3 px-6 rounded-md shadow flex items-center gap-2 transition-all"
          >
            <LuDatabaseBackup className="text-lg" />
            Load to DB2
          </button>
        </div>
      ) : (
        <>
          {loading ? (
            <>
              <div className="w-3/4 bg-gray-300 h-4 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-[#555] h-4 transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-gray-800 font-medium">
                Uploading to <span className="uppercase">{selectedDB}</span>... ({progress}%)
              </p>
            </>
          ) : (
            <p className="text-green-700 font-semibold text-center bg-green-100 px-6 py-3 rounded-lg">
              {backendMessage}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default LoadSection;
