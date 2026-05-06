export function ViewAllAnouncement({ data = [] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Announcements</h2>
      {data.length === 0 ? (
        <p>No announcements available.</p>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-auto">
          {data.map((a, idx) => (
            <li key={idx} className="p-3 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-gray-600">{a.desc}</div>
                </div>
                {a.date && <div className="text-sm text-gray-500">{a.date}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
