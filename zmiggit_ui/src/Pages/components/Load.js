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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDB, selectedFile]);

  const handleLoad = async (db) => {
    setLoading(true);
    setProgress(0);
    setBackendMessage('');

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 90) clearInterval(interval);
        return next;
      });
    }, 300);

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
      clearInterval(interval);
      setProgress(100);
      setLoading(false);
    }
  };

  const handleDBSelect = (db) => {
    setSelectedDB(db);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-10">
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
            <div className="w-full max-w-md mt-8">
              <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center mt-3 font-medium text-gray-700">
                Uploading to <span className="uppercase">{selectedDB}</span>... ({progress}%)
              </p>
            </div>
          ) : (
            <p className="mt-6 text-lg font-semibold text-green-700 text-center">
              {backendMessage}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default LoadSection;
