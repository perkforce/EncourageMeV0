"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

/* eslint-disable @typescript-eslint/no-unused-vars */

export default function ThoughtInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [thought, setThought] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  async function handleEncourage() {
    setIsOpen(true);
    setAiResponse(""); // Reset previous response

    try {
      const response = await fetch("/api/thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thought }),
      });

      if (!response.ok) throw new Error("Failed to get encouragement");

      const data = await response.json();
      setAiResponse(data.message);

      // Save both thought and encouragement to Supabase
      await supabase.from("thoughts").insert([
        {
          content: thought,
          encouragement: data.message, // Save the AI response in the encouragement field
        },
      ]);
    } catch (error) {
      setAiResponse("Sorry, I couldn't generate encouragement at this time.");
      console.error("Error:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await supabase.from("thoughts").insert([{ content: thought }]);
      setIsOpen(false);
      setThought("");
    } catch (error) {
      console.error("Error inserting thought:", error);
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="How are you feeling today?"
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        className="min-h-[120px]"
      />

      <div className="text-center">
        <Button onClick={handleEncourage} disabled={!thought.trim()}>
          Encourage Me
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Encouragement</DialogTitle>
            <DialogDescription>
              Here&apos;s some encouragement based on your feelings
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {aiResponse || "Loading your encouragement..."}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
