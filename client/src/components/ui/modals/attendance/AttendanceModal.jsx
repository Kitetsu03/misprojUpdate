import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Dropdown from "../../buttons/Dropdown.jsx";
import SearchBar from "../../input/SearchBar.jsx";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  saveAttendance,
  getAttendanceByService,
} from "../../../../services/attendanceService.js";

import { useEffect, useState, useMemo } from "react";

import { getMembers } from "../../../../services/memberService.js";

const AttendanceModal = ({ open, onClose, event }) => {
  const [guestName, setGuestName] = useState("");
  const [saving, setSaving] = useState(false);
  const [guests, setGuests] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [networkFilter, setNetworkFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});

  const [newGuestName, setNewGuestName] = useState("");
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [isEditing, setIsEditing] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const serviceId = event?._id;

  useEffect(() => {
    if (open && event?._id) {
      fetchAttendance();
    }
  }, [open, event]);

  const getMemberKey = (member) => member.member_id;

  const fetchAttendance = async () => {
    if (!serviceId) return;
    console.log("No serviceId, skipping fetch");
    try {
      setLoading(true);
      console.log("Fetching members...");
      const members = await getMembers();
      console.log("Members:", members);
      const attendance = await getAttendanceByService(serviceId);
      console.log("Fetching attendance for serviceId:", serviceId);
      console.log("Attendance:", attendance);

      const merged = members.map((m) => {
        const record = attendance.find(
          (a) => a.member_id && a.member_id._id.toString() === m._id.toString(),
        );
        return {
          member_id: m._id,
          name: m.name,
          member: m.member,
          is_guest: false,
          status: record?.status || "absent",
        };
      });
      // Include guests from attendance
      const guestsFromAttendance = attendance
        .filter((a) => a.is_guest)
        .map((g) => ({
          member_id: `guest-${g._id}`,
          name: g.guest_name,
          is_guest: true,
          status: g.status || "present",
          member: { status: "Visitor", network: "Guest" },
        }));

      const finalAttendees = [...merged, ...guestsFromAttendance, ...guests];
      setAttendees(finalAttendees);

      const map = {};
      finalAttendees.forEach((a) => (map[a.member_id] = a.status));
      setAttendanceMap(map);

      setTotalMembers(finalAttendees.length);
      setTotalPresent(
        finalAttendees.filter((a) => a.status === "present").length,
      );
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to fetch attendance");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  const isNewEvent = !event?._id;
  const handleSaveAttendance = async () => {
    try {
      setSaving(true);

      // Build attendance records
      const records = attendees.map((a) => ({
        service_id: serviceId,
        member_id: a.is_guest ? null : a.member_id,
        is_guest: a.is_guest,
        guest_name: a.is_guest ? a.name : null,
        status: attendanceMap[a.member_id] || "absent",
      }));

      if (newGuestName?.trim()) {
        records.push({
          service_id: serviceId,
          is_guest: true,
          guest_name: newGuestName.trim(),
          status: "present",
        });
      }

      // Call the attendance service instead of fetch
      const saved = await saveAttendance(records).then((res) => res.data);

      setSnackbarMessage("Attendance successfully saved");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Update state
      if (isNewEvent) {
        const map = {};
        finalAttendees.forEach((a) => {
          map[a.member_id] = a.status;
        });
        setAttendanceMap(map);
      } // else keep the current map (switches remain as the user toggled them)

      setAttendees(saved);
      setTotalMembers(saved.length);
      setTotalPresent(saved.filter((a) => a.status === "present").length);
      setNewGuestName("");
      setIsEditing(false); // lock table
    } catch (err) {
      console.error("Error saving attendance:", err);
      setSnackbarMessage("Failed to save attendance");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSaving(false);
    }
  };

  const addGuest = () => {
    if (!guestName.trim()) return;

    const newGuest = {
      member_id: `guest-${Date.now()}`,
      name: guestName,
      member: { status: "Visitor", network: "Guest" },
      is_guest: true,
    };

    setGuests((prev) => [...prev, newGuest]);
    setAttendees((prev) => [...prev, newGuest]); // <- important
    setGuestName("");
    setTotalMembers((prev) => prev + 1);
  };

  const removeGuest = (guestId) => {
    setGuests((prev) => prev.filter((g) => g.member_id !== guestId));
    setAttendees((prev) => prev.filter((a) => a.member_id !== guestId));
    setTotalMembers((prev) => prev - 1);

    // Update attendanceMap in case it exists
    setAttendanceMap((prev) => {
      const newMap = { ...prev };
      delete newMap[guestId];
      setTotalPresent(
        Object.values(newMap).filter((v) => v === "present").length,
      );
      return newMap;
    });
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery(searchValue);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchValue]);

  const filteredMembers = useMemo(() => {
    const q = query.toLowerCase();

    let filtered = attendees.filter((m) => {
      if (m.is_guest) return true;

      return m.name && m.email;
    });

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
  }, [attendees, members, guests, query, statusFilter, networkFilter, sortBy]);

  const attendanceCount = useMemo(() => {
    return Object.values(attendanceMap).filter(Boolean).length;
  }, [attendanceMap]);

  const toggleAttendance = (memberId) => {
    if (!isEditing) return;

    setAttendanceMap((prev) => {
      const current = prev[memberId] || "absent";
      const newStatus = current === "present" ? "absent" : "present";
      const newMap = { ...prev, [memberId]: newStatus };
      setTotalPresent(
        Object.values(newMap).filter((v) => v === "present").length,
      );
      return newMap;
    });
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
                              attendanceMap[member.member_id] === "present"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {attendanceMap[member.member_id] === "present"
                              ? "Present"
                              : "Absent"}
                          </span>

                          <Switch
                            checked={
                              attendanceMap[getMemberKey(member)] === "present"
                            }
                            onChange={() =>
                              toggleAttendance(getMemberKey(member))
                            }
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
                            attendanceMap[member.member_id] === "present"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {attendanceMap[member.member_id] === "present"
                            ? "Present"
                            : "Absent"}
                        </span>
                        <Switch
                          checked={
                            attendanceMap[getMemberKey(member)] === "present"
                          }
                          onChange={() =>
                            toggleAttendance(getMemberKey(member))
                          }
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

            <button
              onClick={() => {
                if (isEditing) handleSaveAttendance();
                else setIsEditing(true);
              }}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isEditing ? (saving ? "Saving..." : "Save Attendance") : "Edit"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AttendanceModal;
