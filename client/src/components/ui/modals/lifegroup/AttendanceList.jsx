export default function LifeGroupList() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-2xl font-bold">LifeGroup List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Barangay</th>
                <th className="px-6 py-4">District</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {lifeGroups.map((group) => (
                <tr
                  key={group.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{group.name}</td>

                  <td className="px-6 py-4">{group.type}</td>

                  <td className="px-6 py-4">{group.schedule}</td>

                  <td className="px-6 py-4">{group.barangay}</td>

                  <td className="px-6 py-4">{group.district}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        group.status,
                      )}`}
                    >
                      {group.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        View
                      </button>

                      <button className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Edit
                      </button>

                      <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600">
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
