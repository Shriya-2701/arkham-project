import React, { useState } from "react";
import axios from "axios";

const ApiDemo = () => {
  const [newsResponse, setNewsResponse] = useState<string | null>(null);
  const [socialResponse, setSocialResponse] = useState<string | null>(null);
  const [mapResponse, setMapResponse] = useState<string | null>(null);

  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (type: "news" | "social" | "map") => {
    let url = "";
    if (type === "news") url = "https://spectrum-api-343916782787.us-central1.run.app";
    if (type === "social") url = "https://connection-api-343916782787.us-central1.run.app";
    if (type === "map") url = "https://live-map-343916782787.us-central1.run.app";

    setLoading(type);
    setError(null);

    try {
      const res = await axios.get(url);
      const data = JSON.stringify(res.data, null, 2);
      if (type === "news") setNewsResponse(data);
      if (type === "social") setSocialResponse(data);
      if (type === "map") setMapResponse(data);
    } catch (err: any) {
      setError(`Failed to fetch ${type} API`);
      if (type === "news") setNewsResponse(null);
      if (type === "social") setSocialResponse(null);
      if (type === "map") setMapResponse(null);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-mono space-y-8">
      <h1 className="text-3xl font-bold text-crimson">🔗 API Demo</h1>

      <div className="space-x-4">
        <button
          onClick={() => callApi("news")}
          className="bg-crimson px-4 py-2 rounded hover:bg-red-800 transition"
        >
          Test News API
        </button>
        <button
          onClick={() => callApi("social")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          Test Social Connection API
        </button>
        <button
          onClick={() => callApi("map")}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-800 transition"
        >
          Test Live Map API
        </button>
      </div>

      {/* Display error if any */}
      {error && <div className="text-red-400">❌ {error}</div>}

      {/* News API */}
      {loading === "news" ? (
        <div>Loading News API...</div>
      ) : (
        newsResponse && (
          <div>
            <h2 className="text-xl mt-6 mb-2">📰 News API Response:</h2>
            <pre className="bg-black/40 p-4 border border-silver/20 rounded max-h-[300px] overflow-auto text-sm">
              {newsResponse}
            </pre>
          </div>
        )
      )}

      {/* Social Connection API */}
      {loading === "social" ? (
        <div>Loading Social API...</div>
      ) : (
        socialResponse && (
          <div>
            <h2 className="text-xl mt-6 mb-2">🌐 Social API Response:</h2>
            <pre className="bg-black/40 p-4 border border-silver/20 rounded max-h-[300px] overflow-auto text-sm">
              {socialResponse}
            </pre>
          </div>
        )
      )}

      {/* Map API */}
      {loading === "map" ? (
        <div>Loading Map API...</div>
      ) : (
        mapResponse && (
          <div>
            <h2 className="text-xl mt-6 mb-2">🗺️ Live Map API Response:</h2>
            <pre className="bg-black/40 p-4 border border-silver/20 rounded max-h-[300px] overflow-auto text-sm">
              {mapResponse}
            </pre>
          </div>
        )
      )}
    </div>
  );
};

export default ApiDemo;