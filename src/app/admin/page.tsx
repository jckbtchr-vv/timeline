"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertTriangle, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [consequence, setConsequence] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedPassword = localStorage.getItem("admin_password");
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      localStorage.setItem("admin_password", password);
      setIsAuthorized(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ date, title, consequence, url }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create entry");
        if (res.status === 401) {
          setIsAuthorized(false);
          localStorage.removeItem("admin_password");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <div className="bg-white/5 border border-white/10 p-12 w-full max-w-md flex flex-col gap-6">
          <div className="flex justify-center">
            <Lock size={32} className="text-white/20" />
          </div>
          <h1 className="text-2xl font-bold text-center uppercase tracking-tighter">
            ADMIN ACCESS
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="ENTER ACCESS KEY"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-white/20 px-4 py-3 text-center font-mono focus:outline-none focus:border-white transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="bg-white text-black font-bold py-3 uppercase tracking-widest hover:bg-white/90 transition-colors"
            >
              AUTHORIZE
            </button>
          </form>
          <Link href="/" className="text-center text-xs text-white/30 hover:text-white uppercase font-mono tracking-widest transition-colors">
            Return to public view
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase font-mono text-xs tracking-widest mb-4"
        >
          <ArrowLeft size={14} />
          Back to Timeline
        </Link>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-[0.8]">
          Add Entry
        </h1>
        <div className="bg-red-950/20 border border-red-900/50 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-[0.2em]">
            <AlertTriangle size={14} />
            Warning
          </div>
          <p className="text-red-200/60 text-sm font-mono uppercase tracking-tight">
            Append-only. No edits. No deletes. Every entry is permanent. Double check everything before commitment.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Date (Required)
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/5 border border-white/10 p-4 font-mono text-white focus:outline-none focus:border-white/30 transition-colors uppercase"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Title (Required, Max 80 chars)
            </label>
            <input
              type="text"
              required
              maxLength={80}
              placeholder="THE EVENT TITLE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border border-white/10 p-4 font-bold text-xl text-white focus:outline-none focus:border-white/30 transition-colors uppercase placeholder:text-white/10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Consequence (Required, Max 160 chars)
            </label>
            <textarea
              required
              maxLength={160}
              placeholder="ONE SENTENCE CONSEQUENCE..."
              value={consequence}
              onChange={(e) => setConsequence(e.target.value)}
              className="bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-white/30 transition-colors min-h-[100px] resize-none placeholder:text-white/10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Link URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/source"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/5 border border-white/10 p-4 font-mono text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/10"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 font-mono text-xs uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-white text-black font-black py-6 text-xl uppercase tracking-[0.2em] hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            "COMMITTING..."
          ) : (
            <>
              <Plus size={24} strokeWidth={3} />
              COMMIT TO HISTORY
            </>
          )}
        </button>
      </form>
    </main>
  );
}

