import { useCallback } from "react";

function toUTCStringForICS(dateStr) {
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

export function AddToCalendar({ event = {} }) {
  const title = event.name || event.title || "Event";
  const description = event.topic || event.desc || "";
  const location = event.location || "";
  const start = event.start || event.datetime || null;
  const end = event.end || null;

  const makeGoogleUrl = useCallback(() => {
    if (!start || !end) return "#";
    const s = toUTCStringForICS(start);
    const e = toUTCStringForICS(end);
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${s}/${e}`,
      details: description,
      location,
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  }, [title, description, location, start, end]);

  return (
    <div className="space-y-4">
      <div>
        <div className="font-semibold">{title}</div>
        {description && <div className="text-sm text-gray-600">{description}</div>}
        {start && <div className="text-sm">Start: {new Date(start).toLocaleString()}</div>}
        {end && <div className="text-sm">End: {new Date(end).toLocaleString()}</div>}
      </div>

      <div className="flex gap-3">
        <a href={makeGoogleUrl()} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded">
          Open in Google Calendar
        </a>
      </div>
    </div>
  );
}
