import { FaCloudUploadAlt } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { PiArrowFatLineDownFill } from "react-icons/pi";

function ExtractSection({ selectedFile, handleFileChange }) {
  return (
    <div className="w-[80vh] p-6 flex flex-col items-center justify-center text-center border-dashed border-4 border-light-blue-500">
      <h3 className="mt-10 text-xl font-semibold text-gray-700">Select a file</h3>

      <PiArrowFatLineDownFill className="mt-10 text-3xl text-gray-500 animate-bounce" />

      <input
        type="file"
        id="fileUpload"
        onChange={handleFileChange}
        className="hidden"
      />

      <label
        htmlFor="fileUpload"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#840227] text-white rounded-lg cursor-pointer hover:bg-[#a20334] transition-colors"
      >
        <FaCloudUploadAlt className="text-lg" />
        Browse
      </label>

      {selectedFile && (
        <p className="text-sm text-gray-700 flex items-center gap-1 mt-10">
            <FaFileAlt />
          <p>file selected successful</p>
        </p>
      )}
    </div>
  );
}

export default ExtractSection;
