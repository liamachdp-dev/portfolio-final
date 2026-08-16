"use client";

import { useState } from "react";

interface Item {
  id: string;
  name: string;
  avatar_url: string | null;
  message: string;
  created_at: string;
}

export default function AdminList({ items }: { items: Item[] }) {
  const [list, setList] = useState(items);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function act(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    const res = await fetch(`/api/recommendations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setList((prev) => prev.filter((item) => item.id !== id));
    }
    setBusyId(null);
  }

  if (list.length === 0) {
    return <p className="text-inkSoft font-mono text-sm">Nothing pending. Nice and clean.</p>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {list.map((item) => (
        <div key={item.id} className="border border-line rounded-lg px-5 py-4">
          <p className="text-ink text-sm leading-relaxed mb-2">&ldquo;{item.message}&rdquo;</p>
          <span className="text-inkSoft text-xs font-mono block mb-3">— {item.name}</span>
          <div className="flex gap-2">
            <button
              onClick={() => act(item.id, "approved")}
              disabled={busyId === item.id}
              className="text-xs font-medium bg-accent text-white px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => act(item.id, "rejected")}
              disabled={busyId === item.id}
              className="text-xs font-medium border border-line text-ink px-3 py-1.5 rounded-md hover:border-accent disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
