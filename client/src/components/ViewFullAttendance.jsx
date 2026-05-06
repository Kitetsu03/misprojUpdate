export function ViewFullAttendace({ data = [] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Full Attendance</h2>
      {data.length === 0 ? (
        <p>No attendance records.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-auto">
          {data.map((row, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{row.event}</div>
                <div className="text-sm text-gray-600">{row.date}</div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    row.status === "Present"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
