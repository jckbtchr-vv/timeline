export interface Entry {
  id: string;
  date: string;
  title: string;
  consequence: string;
  url: string | null;
  createdAt: string;
}

const unavailable = "The timeline service is unavailable. Please try again.";
const invalidResponse = "The timeline service returned an invalid response. Please try again.";

function isEntry(value: unknown): value is Entry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  if (!["id", "date", "title", "consequence", "createdAt"].every(
    (key) => typeof entry[key] === "string"
  )) return false;
  if (entry.url === null) return true;
  if (typeof entry.url !== "string") return false;
  try {
    const url = new URL(entry.url);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function fetchTimelineEntries(fetcher: typeof fetch = fetch): Promise<Entry[]> {
  let response: Response;
  try {
    response = await fetcher("/api/entries", { cache: "no-store" });
  } catch {
    throw new Error(unavailable);
  }
  if (!response.ok) throw new Error(unavailable);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error(invalidResponse);
  }
  if (!Array.isArray(data) || !data.every(isEntry)) throw new Error(invalidResponse);
  return data;
}
