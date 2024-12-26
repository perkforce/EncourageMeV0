"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "./Modal";

export default function ThoughtInput() {
  const [thought, setThought] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      alert("Please enter your OpenAI API key first");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thought, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Save to Supabase
      await supabase.from("thoughts").insert([
        {
          content: thought,
          encouragement: data.message,
        },
      ]);

      setEncouragement(data.message);
      setIsModalOpen(true);
      setThought("");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit thought");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-4 border border-gray-300 rounded-lg mb-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? "Generating..." : "Encourage Me"}
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        encouragement={encouragement}
      />
    </div>
  );
}
