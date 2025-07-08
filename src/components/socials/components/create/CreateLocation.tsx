import React, { useState } from "react";

export const CreateLocation = () => {
  const [placeName, setPlaceName] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locationData = { placeName, address, details, image };
    console.log("Location submitted:", locationData);
    // TODO: Send locationData to backend API
    alert("Location posted!");
    setPlaceName("");
    setAddress("");
    setDetails("");
    setImage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-black/30 p-6 rounded-lg border border-white/10 text-white">
      <h2 className="text-xl mb-2">Post a Location</h2>
      <input
        type="text"
        placeholder="Place Name"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        className="w-full p-2 rounded bg-black/20 border border-white/10"
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 rounded bg-black/20 border border-white/10"
        required
      />
      <textarea
        placeholder="Details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="w-full p-2 rounded bg-black/20 border border-white/10"
        rows={3}
        required
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full p-2 rounded bg-black/20 border border-white/10"
      />
      <div className="text-right">
      <button
        type="submit"
        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors"
      >
        Post Location
      </button>
      </div>
    </form>
  );
};