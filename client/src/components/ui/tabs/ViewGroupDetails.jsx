export function ViewGroupDetails({ group = {} }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{group.name || "Group Details"}</h2>
      {group.schedule && <div className="text-sm text-gray-600 mb-2">{group.schedule}</div>}
      {group.topic && <div className="mb-4"><i>Topic: "{group.topic}"</i></div>}

      <div>
        <h3 className="font-semibold mb-2">Members</h3>
        {(!group.members || group.members.length === 0) ? (
          <p>No members listed.</p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-auto">
            {group.members.map((m, i) => (
              <li key={i} className="flex justify-between">
                <span>{m.name || m}</span>
                {m.role && <span className="text-sm text-gray-600">{m.role}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
