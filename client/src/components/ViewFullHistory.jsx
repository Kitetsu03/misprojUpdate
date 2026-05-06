export function ViewFullHistory({ data = [] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Full Giving History</h2>
      {data.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-auto">
          {data.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.date} — {item.type}</span>
              <span className="font-semibold">₱{item.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
