import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Dropdown from "../../buttons/Dropdown.jsx";
import SearchBar from "../../input/SearchBar.jsx";

import { useEffect, useState, useMemo } from "react";

import { getMembers } from "../../../../services/memberService.js";

const AttendanceModal = ({ open, onClose, event }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [networkFilter, setNetworkFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [attendance, setAttendance] = useState({});

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await getMembers();

      setMembers(response);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery(searchValue);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchValue]);

  const filteredMembers = useMemo(() => {
    let filtered = [...members].filter((m) => m.member);

    const q = query.toLowerCase();

    filtered = filtered.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);

      const matchesStatus =
        !statusFilter ||
        u.member?.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesNetwork =
        !networkFilter ||
        u.member?.network?.toLowerCase() === networkFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesNetwork;
    });

    // sorting
    if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [members, query, statusFilter, networkFilter, sortBy]);

  const attendanceCount = useMemo(() => {
    return Object.values(attendance).filter(Boolean).length;
  }, [attendance]);

  const toggleAttendance = (memberId) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <div className="p-6 font-secondary">
        {/* HEADER */}
        <div className="flex mb-4 justify-between">
          <div>
            <h2 className="text-2xl font-bold">{event?.title}</h2>
            <p className="text-gray-500 text-sm">Attendance Management</p>
          </div>

          <div className="text-sm font-medium">
            <p>Total Members: {filteredMembers.length}</p>
            <p>{attendanceCount} marked present</p>
          </div>
        </div>
        {/* EVENT INFO */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4 text-sm">
          <div className="flex justify-between">
            <span>Date</span>

            <span>
              {event?.service_date
                ? new Date(event.service_date).toLocaleDateString("en-PH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </span>
          </div>

          <div className="flex justify-between mt-2">
            <span>Location</span>

            <span>{event?.location}</span>
          </div>
        </div>

        <div className="flex gap-2 flex-col md:flex-row pb-4">
          <SearchBar
            value={searchValue}
            onChange={(v) => setSearchValue(v)}
            onSearch={() => setQuery(searchValue)}
          />
          <div className="md:flex-row md:gap-2 flex md:justify-end">
            <Dropdown
              value={statusFilter}
              placeholder="Filter by status"
              onChange={(value) => setStatusFilter(value)}
              options={[
                { label: "All Status", value: "" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Visitor", value: "visitor" },
              ]}
            />

            <Dropdown
              value={networkFilter}
              placeholder="Filter by network"
              onChange={(value) => setNetworkFilter(value)}
              options={[
                { label: "All Networks", value: "" },
                { label: "Men", value: "Men" },
                { label: "Women", value: "Women" },
                { label: "KKB", value: "KKB" },
                { label: "Children", value: "Children" },
              ]}
            />
            <Dropdown
              value={sortBy}
              placeholder="Sort by name"
              onChange={(value) => setSortBy(value)}
              options={[
                { label: "Default", value: "" },
                { label: "Name A-Z", value: "name-asc" },
                { label: "Name Z-A", value: "name-desc" },
              ]}
            />
          </div>
        </div>

        {/* MEMBERS */}
        {loading ? (
          <div className="flex justify-center py-10">
            <CircularProgress />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No members found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="hidden md:table w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-black/20">
                  <th className="pb-2">Name</th>
                  <th className="pb-2 ">Status</th>
                  <th className="pb-2 ">Network</th>
                  <th className="pb-2 text-center">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.member_id}
                    className="border-b border-black/10 text-sm"
                  >
                    <td className="py-3">{member.name}</td>

                    <td>{member.member?.status || "No status"}</td>
                    <td>{member.member?.network}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`text-xs font-medium ${
                            attendance[member.member_id]
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {attendance[member.member_id] ? "Present" : "Absent"}
                        </span>

                        <Switch
                          checked={attendance[member.member_id] || false}
                          onChange={() => toggleAttendance(member.member_id)}
                          slotProps={{
                            input: {
                              "aria-label": "attendance switch",
                            },
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.member_id}
                  className="p-4 rounded-lg shadow-sm border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm">{member.name}</div>
                      <div className="text-xs text-gray-600">
                        {member.member?.network}
                      </div>
                      <div className="text-xs text-gray-600">
                        {member.member?.status || "No status"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium ${
                          attendance[member.member_id]
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {attendance[member.member_id] ? "Present" : "Absent"}
                      </span>

                      <Switch
                        checked={attendance[member.member_id] || false}
                        onChange={() => toggleAttendance(member.member_id)}
                        slotProps={{
                          input: {
                            "aria-label": "attendance switch",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </button>

          <button className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-300 hover:text-black ">
            Save Attendance
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AttendanceModal;
