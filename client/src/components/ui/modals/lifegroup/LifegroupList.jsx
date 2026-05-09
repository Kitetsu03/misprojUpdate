import { useEffect, useState } from "react";

import {
  getLifeGroups,
  archiveLifeGroup,
  createLifeGroup,
} from "../../../../services/lifegroupService";

import CreateLifeGroupModal from "./CreateLifegroupModal";

export default function LifegroupList() {
  const [lifeGroups, setLifeGroups] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [loading, setLoading] = useState(false);

  /* FETCH */
  const fetchLifeGroups = async () => {
    try {
      setLoading(true);

      const data = await getLifeGroups();

      setLifeGroups(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ARCHIVE */
  const handleArchive = async (id) => {
    try {
      const confirmArchive = window.confirm("Archive this LifeGroup?");

      if (!confirmArchive) return;

      await archiveLifeGroup(id);

      setLifeGroups((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  /* CREATE */
  const handleCreate = async (formData) => {
    try {
      const newGroup = await createLifeGroup(formData);

      setLifeGroups((prev) => [newGroup, ...prev]);

      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLifeGroups();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";

      case "inactive":
        return "bg-red-500";

      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="font-secondary">
      {/* HEADER */}

      {/* CONTAINER */}
      <div className="card rounded-2xl p-5 shadow-md">
        {/* TOPBAR */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Lifegroup List ({lifeGroups.length})
            </h2>

            <p className="text-sm text-muted-foreground">
              Complete lifegroup records and schedules.
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            + Create Lifegroup
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-black/10">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#A7E6FF]">
                <tr className="text-left text-sm border-b border-black/10">
                  <th className="px-6 py-4 font-semibold">Name</th>

                  <th className="px-6 py-4 font-semibold">Type</th>

                  <th className="px-6 py-4 font-semibold">Schedule</th>

                  <th className="px-6 py-4 font-semibold">Barangay</th>

                  <th className="px-6 py-4 font-semibold">Purok/Sitio</th>

                  <th className="px-6 py-4 font-semibold">Status</th>

                  <th className="px-6 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm">
                      Loading lifegroups...
                    </td>
                  </tr>
                ) : lifeGroups.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm">
                      No lifegroups found.
                    </td>
                  </tr>
                ) : (
                  lifeGroups.map((group) => (
                    <tr
                      key={group._id}
                      className="border-b border-black/10 text-sm hover:bg-black/[0.02]"
                    >
                      <td className="px-6 py-4 font-medium">
                        {group.lifegroup_name}
                      </td>

                      <td className="px-6 py-4 capitalize">{group.type}</td>

                      <td className="px-6 py-4">{group.schedule}</td>

                      <td className="px-6 py-4">{group.barangay}</td>

                      <td className="px-6 py-4">{group.district}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`${getStatusColor(
                            group.status,
                          )} rounded-full px-3 py-1 text-xs font-semibold text-white`}
                        >
                          {group.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5">
                            View
                          </button>

                          <button className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5">
                            Edit
                          </button>

                          <button
                            onClick={() => handleArchive(group._id)}
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <CreateLifeGroupModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
