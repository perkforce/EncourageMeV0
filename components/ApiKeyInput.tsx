"use client";
import { useState, useEffect } from "react";

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
  };

  const handleSave = () => {
    localStorage.setItem("openai_api_key", apiKey);
    alert("API Key saved successfully!");
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <h1 className="text-3xl font-bold text-center mb-6">Encourage Me</h1>
      <div className="relative">
        <input
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="sk-..."
          className="w-full p-3 border border-gray-300 rounded-lg pr-20"
        />
        <button
          onClick={() => setShowKey(!showKey)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showKey ? "Hide" : "Show"}
        </button>
      </div>
      <button
        onClick={handleSave}
        className="w-full mt-3 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Save API Key
      </button>
    </div>
  );
}
