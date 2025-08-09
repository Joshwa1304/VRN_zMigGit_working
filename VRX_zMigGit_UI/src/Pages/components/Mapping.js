import { useEffect, useState } from 'react';

function Mapping() {
  const [mappingData, setMappingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setRawResponse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const response = await fetch('http://localhost:9090/mapping');

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const text = await response.text();
        setRawResponse(text);

        try {
          const json = JSON.parse(text);
          if (json && typeof json === 'object') {
            setMappingData(json);
          } else {
            setError('⚠️ Invalid JSON structure.');
          }
        } catch (jsonError) {
          setError('⚠️ Response is not valid JSON. Check backend.');
        }
      } catch (err) {
        setError(`❌ Fetch error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMapping();
  }, []);

  return (
    <div className="w-full p-4 sm:p-4 font-[Poppins]">
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-[#3f3f3f]">
        SOURCE & TARGET EQUIVALENCE
      </h2>

      {loading ? (
        <>
        </>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : mappingData ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-[#840227] text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ENDEVOR</th>
                <th className="border border-gray-300 px-4 py-2">GIT BASED</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mappingData).map(([key, value]) => (
                <tr key={key} className="odd:bg-gray-50 even:bg-white">
                  <td className="border border-gray-300 px-4 py-2 whitespace-pre-wrap break-words">
                    {key}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-pre-wrap break-words">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-yellow-600 text-center">⚠️ No mapping data found.</p>
      )}
    </div>
  );
}

export default Mapping;
