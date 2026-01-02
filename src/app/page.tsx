"use client";

import { useEffect, useState, useMemo } from "react";
import { TimelineItem } from "@/components/TimelineItem";
import { Search, ArrowUpDown, Clock } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  title: string;
  consequence: string;
  url: string | null;
  createdAt: string;
}

export default function TimelinePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [isOldestFirst, setIsOldestFirst] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch entries", err);
        setIsLoading(false);
      });
  }, []);

  const years = useMemo(() => {
    const yearsSet = new Set(entries.map((e) => e.date.split("-")[0]));
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.consequence.toLowerCase().includes(search.toLowerCase());
      const matchesYear = yearFilter === "all" || entry.date.startsWith(yearFilter);
      return matchesSearch && matchesYear;
    });

    return [...result].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      const createdCompare = a.createdAt.localeCompare(b.createdAt);
      
      const comparison = dateCompare !== 0 ? dateCompare : createdCompare;
      return isOldestFirst ? comparison : -comparison;
    });
  }, [entries, search, yearFilter, isOldestFirst]);

  const lastUpdated = useMemo(() => {
    if (entries.length === 0) return null;
    const latest = entries.reduce((prev, current) => {
      return new Date(prev.createdAt) > new Date(current.createdAt) ? prev : current;
    });
    return new Date(latest.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [entries]);

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-[0.8]">
          Timeline
        </h1>
        <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
          The immutable record of events.
        </p>
      </header>

      <section className="flex flex-col gap-6 sticky top-0 bg-black/80 backdrop-blur-md pt-4 pb-6 z-10 border-b border-white/5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="SEARCH ENTRIES..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-none px-10 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors uppercase font-mono tracking-tighter"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors uppercase font-mono tracking-tighter appearance-none cursor-pointer min-w-[100px]"
            >
              <option value="all">ALL YEARS</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsOldestFirst(!isOldestFirst)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-none px-4 py-3 text-sm hover:bg-white/10 transition-colors uppercase font-mono tracking-tighter"
            >
              <ArrowUpDown size={16} />
              {isOldestFirst ? "OLDEST" : "NEWEST"}
            </button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="py-20 text-center font-mono text-white/20 animate-pulse uppercase tracking-widest">
          Initializing stream...
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <TimelineItem key={entry.id} {...entry} />
            ))
          ) : (
            <div className="py-20 text-center font-mono text-white/20 uppercase tracking-widest">
              No entries found.
            </div>
          )}
        </div>
      )}

      <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col gap-2 items-center text-center">
        <div className="flex items-center gap-2 text-white/30 font-mono text-[10px] uppercase tracking-[0.2em]">
          <Clock size={10} />
          Last Updated: {lastUpdated || "Never"}
        </div>
        <div className="text-white/10 font-mono text-[10px] uppercase tracking-[0.1em]">
          Append-only architecture. No edits. No deletes.
        </div>
      </footer>
    </main>
  );
}

