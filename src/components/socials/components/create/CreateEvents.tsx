import React, { useState } from "react";

export const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = { title, date, description, image };
    console.log("Event submitted:", eventData);
    // TODO: Send eventData to backend API
    alert("Event posted!");
    setTitle("");
    setDate("");
    setDescription("");
    setImage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-black/30 p-6 rounded-lg border border-white/10 text-white">
      <h2 className="text-xl  mb-2">Post an Event</h2>
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded bg-black/20 border border-white/10"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 rounded bg-black/20 border border-white/10"
        required
        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
      />
      <textarea
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
        Post Event
      </button>
      </div>
    </form>
  );
};