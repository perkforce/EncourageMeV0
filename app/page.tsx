"use client";
import { useEffect, useState } from "react";
import ThoughtInput from "@/components/ThoughtInput";
import ThoughtsList from "@/components/ThoughtsList";
import { supabase } from "@/lib/supabase";
import { Thought } from "@/types/database";

export default function Home() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  useEffect(() => {
    getThoughts();

    const channel = supabase
      .channel("thoughts-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "thoughts" },
        (payload: { new: Thought }) => {
          // Add new thought to the beginning of the list
          setThoughts((prev) => [payload.new as Thought, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "thoughts" },
        (payload) => {
          // Remove deleted thought from the list
          setThoughts((prev) =>
            prev.filter((thought) => thought.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getThoughts() {
    const { data } = await supabase
      .from("thoughts")
      .select("*")
      .order("created_at", { ascending: false });
    setThoughts(data || []);
  }

  async function handleDelete(id: string) {
    try {
      await supabase.from("thoughts").delete().eq("id", id);
    } catch (error) {
      console.error("Error deleting thought:", error);
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Daily Encouragement
        </h1>
        <ThoughtInput />
        <div className="mt-12">
          <ThoughtsList thoughts={thoughts} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}
