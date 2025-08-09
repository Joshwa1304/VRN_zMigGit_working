import { useState } from 'react';
import { TbTransitionRightFilled } from "react-icons/tb";

function TransformSection({ setLoading, setSuccess, setTransformOutput }) {
  const [targetPlatform, setTargetPlatform] = useState('');
  const [progress, setProgress] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [backendMessage, setBackendMessage] = useState(true);
  
  const sourcePlatform = "ENDEVOR";

  const TOTAL_TIME = 23000;
  const FAST_FORWARD_TIME = 100;
  const STEP_INTERVAL = 100;
  let intervalId = null;

  const handleSubmit = async () => {
    if (!targetPlatform) {
      alert("⚠ Please select a Target platform.");
      return;
    }

    setLoading(true);
    setLoadingState(true);
    setSuccess(false);
    setSuccessState(false);
    setProgress(0);

    const startTime = Date.now();

    intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const expectedProgress = (elapsed / TOTAL_TIME) * 100;
      setProgress((prev) => Math.min(expectedProgress, 100));
      if (expectedProgress >= 100) clearInterval(intervalId);
    }, STEP_INTERVAL);

    const payload = {
      sourcePlatform,
      platform: targetPlatform,
      type: "target",
    };

    try {
      const response = await fetch("http://localhost:9090/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      setTransformOutput(result);
      setBackendMessage(result);

      const currentProgress = (Date.now() - startTime) / TOTAL_TIME * 100;
      const steps = 30;
      const increment = (100 - currentProgress) / steps;
      let count = 0;

      clearInterval(intervalId);
      const fastInterval = setInterval(() => {
        count++;
        setProgress((prev) => Math.min(prev + increment, 100));
        if (count >= steps) {
          clearInterval(fastInterval);
          setProgress(100);
          setLoading(false);
          setLoadingState(false);
        }
      }, FAST_FORWARD_TIME / steps);

      if (response.ok && result.toLowerCase().includes("completed") && !result.toLowerCase().includes("invalid")) {
        setSuccess(true);
        setSuccessState(true);
      } else {
        alert("⚠ Transform ran but may not be successful.");
      }
    } catch (error) {
      console.error("Transform error:", error);
      alert("🚫 Error during transformation");
      clearInterval(intervalId);
      setLoading(false);
      setLoadingState(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      {loadingState ? (
        <>
          <div className="w-3/4 bg-gray-300 h-4 rounded-full overflow-hidden mb-4">
            <div
              className="bg-[#555] h-4 transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-800 font-medium">
            Transforming from <span className="font-bold">{sourcePlatform}</span> to <span className="font-bold">{targetPlatform}</span>... ({Math.floor(progress)}%)
          </p>
        </>
      ) : successState ? (
        <p className="text-green-700 font-semibold text-center bg-green-100 px-6 py-3 rounded-lg whitespace-pre-wrap break-words">
          {backendMessage}
        </p>
      ) : (
        <>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">Source to Target Platform</h2>
          <div className="flex flex-col sm:flex-row gap-6 mb-6 w-full justify-center">
            <div className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 bg-gray-200 text-gray-700 text-center font-semibold cursor-not-allowed select-none">
              {sourcePlatform}
            </div>
            <select
              className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
            >
              <option value="">-- TARGET --</option>
              <option value="GITHUB">GITHUB</option>
              <option value="GITLAB">GITLAB</option>
              <option value="Bitbucket">BitBucket</option>
              <option value="Azure_DevOps">Azure DevOps</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loadingState}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition font-medium text-white ${
              loadingState
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#262626] hover:bg-[#555]"
            }`}
          >
            {loadingState ? (
              "Transforming..."
            ) : (
              <>
                <TbTransitionRightFilled className="text-xl" />
                Transform Endevor to {targetPlatform || '...'}
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default TransformSection;
