import { ExternalLink } from "lucide-react";

interface TimelineItemProps {
  date: string;
  title: string;
  consequence: string;
  url: string | null;
}

export function TimelineItem({ date, title, consequence, url }: TimelineItemProps) {
  const domain = url ? new URL(url).hostname : null;

  return (
    <div className="group py-8 border-b border-white/10 last:border-0">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-white/50 tracking-tight">
            {date}
          </span>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-mono"
            >
              {domain}
              <ExternalLink size={10} strokeWidth={3} />
            </a>
          )}
        </div>
        <h3 className="text-xl font-bold tracking-tight leading-tight uppercase">
          {title}
        </h3>
        <p className="text-white/60 leading-relaxed text-sm">
          {consequence}
        </p>
      </div>
    </div>
  );
}

