"use client";
import { Thought } from "@/types/database";
import { Trash2 } from "lucide-react";

interface ThoughtsListProps {
  thoughts: Thought[];
  onDelete: (id: string) => void;
}

export default function ThoughtsList({
  thoughts,
  onDelete,
}: ThoughtsListProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {thoughts.map((thought) => (
        <div key={thought.id} className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-800 mb-4">{thought.content}</p>
          {thought.encouragement && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 italic">
                &ldquo;{thought.encouragement}&rdquo;
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {new Date(thought.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <button
            onClick={() => onDelete(thought.id)}
            className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
