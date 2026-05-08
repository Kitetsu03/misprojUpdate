import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Dropdown from "../../buttons/Dropdown.jsx";
import SearchBar from "../../input/SearchBar.jsx";
import { CiCircleMinus } from "react-icons/ci";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import {
  saveAttendance,
  getAttendanceByService,
  deleteGuestAttendance,
} from "../../../../services/attendanceService.js";

import { useEffect, useState, useMemo } from "react";

const LifegroupAttendanceModal = ({ open, onClose, event }) => {
  const [attendees, setAttendees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});

  const [guestName, setGuestName] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [networkFilter, setNetworkFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [isEditing, setIsEditing] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const serviceId = event?._id;

  const getMemberKey = (member) => {
    return member.member_id?.toString();
  };

  useEffect(() => {
    if (open && serviceId) {
      fetchAttendance();
    }
  }, [open, serviceId]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const data = await getAttendanceByService(serviceId);

      setAttendees(data);

      const map = {};

      data.forEach((member) => {
        map[getMemberKey(member)] = member.status;
      });

      setAttendanceMap(map);
    } catch (err) {
      console.error(err);

      setSnackbarMessage("Failed to fetch attendance");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAttendance = (memberId) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [memberId]: prev[memberId] === "present" ? "absent" : "present",
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);

      const records = attendees.map((member) => ({
        service_id: serviceId,

        member_id: member.is_guest ? null : member.member_id,

        is_guest: member.is_guest,

        guest_name: member.is_guest ? member.name : null,

        status: attendanceMap[getMemberKey(member)] || "absent",
      }));

      await saveAttendance(records);

      setSnackbarMessage("Attendance saved successfully");

      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      fetchAttendance();
    } catch (err) {
      console.error(err);

      setSnackbarMessage("Failed to save attendance");

      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSaving(false);
    }
  };

  const addGuest = () => {
    if (!guestName.trim()) return;

    const guest = {
      member_id: `guest-${Date.now()}`,
      name: guestName,
      is_guest: true,
      status: "present",

      member: {
        network: "Guest",
        status: "visitor",
      },
    };

    setAttendees((prev) => [...prev, guest]);

    setAttendanceMap((prev) => ({
      ...prev,
      [guest.member_id]: "present",
    }));

    setGuestName("");
  };

  const filteredMembers = useMemo(() => {
    const q = searchValue.toLowerCase();

    let filtered = attendees.filter((member) =>
      member.name?.toLowerCase().includes(q),
    );

    if (statusFilter) {
      filtered = filtered.filter(
        (member) =>
          member.member?.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    if (networkFilter) {
      filtered = filtered.filter(
        (member) =>
          member.member?.network?.toLowerCase() === networkFilter.toLowerCase(),
      );
    }

    if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [attendees, searchValue, statusFilter, networkFilter, sortBy]);

  const attendanceCount = useMemo(() => {
    return Object.values(attendanceMap).filter((v) => v === "present").length;
  }, [attendanceMap]);

  const handleDeleteGuest = async (guestId) => {
    try {
      await deleteGuestAttendance(guestId);

      setAttendees((prev) => prev.filter((a) => a._id !== guestId));

      setSnackbarMessage("Guest removed");

      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      console.error(err);

      setSnackbarMessage("Failed to remove guest");

      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={open}
        onClose={!saving ? onClose : undefined}
        fullWidth
        maxWidth="md"
      >
        <div className="p-6 font-secondary">
          {/* HEADER */}
          <div className="flex mb-4 justify-between">
            <div>
              <h2 className="text-2xl font-bold">{event?.title}</h2>

              <p className="text-gray-500 text-sm">Attendance Management</p>
            </div>

            <div className="text-sm font-medium">
              <p>Total Members: {filteredMembers.length}</p>

              <p>{attendanceCount} Marked as Present</p>
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

          {/* FILTERS */}
          <div className="flex gap-2 flex-col md:flex-row pb-4">
            <SearchBar
              value={searchValue}
              onChange={(v) => setSearchValue(v)}
            />

            <div className="md:flex-row md:gap-2 flex md:justify-end">
              <Dropdown
                value={statusFilter}
                placeholder="Filter by status"
                onChange={(value) => setStatusFilter(value)}
                options={[
                  {
                    label: "All Status",
                    value: "",
                  },
                  {
                    label: "Active",
                    value: "active",
                  },
                  {
                    label: "Inactive",
                    value: "inactive",
                  },
                  {
                    label: "Visitor",
                    value: "visitor",
                  },
                ]}
              />

              <Dropdown
                value={networkFilter}
                placeholder="Filter by network"
                onChange={(value) => setNetworkFilter(value)}
                options={[
                  {
                    label: "All Networks",
                    value: "",
                  },
                  {
                    label: "Men",
                    value: "Men",
                  },
                  {
                    label: "Women",
                    value: "Women",
                  },
                  {
                    label: "KKB",
                    value: "KKB",
                  },
                  {
                    label: "Children",
                    value: "Children",
                  },
                ]}
              />

              <Dropdown
                value={sortBy}
                placeholder="Sort by name"
                onChange={(value) => setSortBy(value)}
                options={[
                  {
                    label: "Default",
                    value: "",
                  },
                  {
                    label: "Name A-Z",
                    value: "name-asc",
                  },
                  {
                    label: "Name Z-A",
                    value: "name-desc",
                  },
                ]}
              />
            </div>
          </div>

          {/* ADD GUEST */}
          <div className="bg-gray-100 rounded-xl p-4 mb-4">
            <h3 className="font-semibold mb-3">Add Guest</h3>

            <div className="flex gap-2 flex-col md:flex-row">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter guest name"
                className="flex-1 px-4 py-2 border rounded-lg"
              />

              <button
                onClick={addGuest}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
              >
                Add Guest
              </button>
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
              {/* Desktop */}
              <table className="hidden md:table w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-black/20">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Network</th>
                    <th className="pb-2 text-center">Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => {
                    const key = getMemberKey(member);

                    return (
                      <tr
                        key={key}
                        className="border-b border-black/10 text-sm"
                      >
                        <td className="py-3">{member.name}</td>

                        <td>{member.member?.status || "No status"}</td>

                        <td>{member.member?.network}</td>

                        <td className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={`text-xs font-medium ${
                                attendanceMap[key] === "present"
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {attendanceMap[key] === "present"
                                ? "Present"
                                : "Absent"}
                            </span>

                            <Switch
                              checked={attendanceMap[key] === "present"}
                              onChange={() => handleToggleAttendance(key)}
                            />
                            {member.is_guest && (
                              <button
                                onClick={() => handleDeleteGuest(member._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <CiCircleMinus size={23} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile */}
              <div className="md:hidden space-y-3">
                {filteredMembers.map((member) => {
                  const key = getMemberKey(member);

                  return (
                    <div key={key} className="p-4 rounded-lg shadow-sm border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">
                            {member.name}
                          </div>

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
                              attendanceMap[key] === "present"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {attendanceMap[key] === "present"
                              ? "Present"
                              : "Absent"}
                          </span>

                          <Switch
                            checked={attendanceMap[key] === "present"}
                            onChange={() => handleToggleAttendance(key)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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

            <button
              onClick={handleSaveAttendance}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default LifegroupAttendanceModal;
