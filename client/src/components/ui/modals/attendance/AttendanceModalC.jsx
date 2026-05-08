import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { getAttendanceByService } from "../../../../services/attendanceService";
import { getMembers } from "../../../../services/memberService";
import axios from "axios";

function AttendanceModal({ open, onClose, serviceId }) {
  const [attendees, setAttendees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [isEditing, setIsEditing] = useState(true);
  const [newGuestName, setNewGuestName] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterNetwork, setFilterNetwork] = useState("");

  // Load members + attendance
  useEffect(() => {
    if (!serviceId) return;

    const fetchData = async () => {
      try {
        // Fetch all members
        const members = await getMembers();

        // Fetch existing attendance for this service
        const attendanceData = await getAttendanceByService(serviceId);

        // Map existing attendance by member ID
        const attendanceMapById = {};
        attendanceData.forEach((a) => {
          if (!a.is_guest && a.member_id) {
            attendanceMapById[a.member_id._id] = a;
          }
        });

        // Merge members with attendance (show all members even if no record exists)
        const merged = members.map((m) => {
          const record = attendanceMapById[m._id];
          return (
            record || {
              service_id: serviceId,
              member_id: m,
              is_guest: false,
              status: "absent",
            }
          );
        });

        // Include any existing guests
        const guests = attendanceData.filter((a) => a.is_guest);

        const combined = [...merged, ...guests];
        setAttendees(combined);

        // Build attendance map for toggles
        const map = {};
        combined.forEach((a) => {
          const key = a.is_guest ? a.guest_name : a.member_id._id;
          map[key] = a.status;
        });

        setAttendanceMap(map);
        setTotalMembers(combined.length);
        setTotalPresent(
          Object.values(map).filter((v) => v === "present").length,
        );
        setIsEditing(true);
      } catch (err) {
        console.error("Error loading attendance:", err);
      }
    };

    fetchData();
  }, [serviceId]);

  // Toggle attendance
  const handleToggle = (attendee) => {
    if (!isEditing) return;

    const key = attendee.is_guest
      ? attendee.guest_name
      : attendee.member_id._id;
    const newStatus = attendanceMap[key] === "present" ? "absent" : "present";

    const newMap = { ...attendanceMap, [key]: newStatus };
    setAttendanceMap(newMap);
    setTotalPresent(
      Object.values(newMap).filter((v) => v === "present").length,
    );
  };

  // Save attendance (bulk)
  const handleSave = async () => {
    try {
      const records = attendees.map((a) => ({
        service_id: serviceId,
        member_id: a.is_guest ? null : a.member_id._id,
        is_guest: a.is_guest,
        guest_name: a.is_guest ? a.guest_name : null,
        status: attendanceMap[a.is_guest ? a.guest_name : a.member_id._id],
      }));

      // Include new guest
      if (newGuestName.trim()) {
        records.push({
          service_id: serviceId,
          is_guest: true,
          guest_name: newGuestName.trim(),
          status: "present",
        });
      }

      const res = await axios.post("/api/attendance/bulk", records, {
        headers: { "Content-Type": "application/json" },
      });

      const saved = res.data;
      setAttendees(saved);

      // Rebuild attendance map
      const map = {};
      saved.forEach((a) => {
        const key = a.is_guest ? a.guest_name : a.member_id._id;
        map[key] = a.status;
      });

      setAttendanceMap(map);
      setTotalMembers(saved.length);
      setTotalPresent(saved.filter((a) => a.status === "present").length);
      setNewGuestName("");
      setIsEditing(false); // lock table after save
    } catch (err) {
      console.error("Error saving attendance:", err);
    }
  };

  // Filter and search
  const filteredAttendees = attendees.filter((a) => {
    const name = a.is_guest
      ? a.guest_name
      : `${a.member_id.first_name} ${a.member_id.last_name}`;
    const network = a.is_guest ? "Guest" : a.member_id.network;
    const status = attendanceMap[a.is_guest ? a.guest_name : a.member_id._id];

    if (search && !name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filterStatus && status !== filterStatus) return false;
    if (filterNetwork && network !== filterNetwork) return false;

    return true;
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white p-6 rounded-md max-w-3xl mx-auto mt-20 font-secondary">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Attendance Management</h2>
          <div>
            Total Members: {totalMembers} | Present: {totalPresent}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Filter by status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
          <select
            value={filterNetwork}
            onChange={(e) => setFilterNetwork(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Filter by network</option>
            {[
              ...new Set(
                attendees.map((a) =>
                  a.is_guest ? "Guest" : a.member_id.network,
                ),
              ),
            ].map((net) => (
              <option key={net} value={net}>
                {net}
              </option>
            ))}
          </select>
        </div>

        {/* Add Guest */}
        {isEditing && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter guest name"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <Button variant="contained" disabled={!newGuestName.trim()}>
              Add Guest
            </Button>
          </div>
        )}

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">Status</th>
              <th className="border-b p-2 text-left">Network</th>
              <th className="border-b p-2 text-left">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.map((a) => {
              const key = a.is_guest ? a.guest_name : a.member_id._id;
              return (
                <tr key={key}>
                  <td className="border-b p-2">
                    {a.is_guest
                      ? a.guest_name
                      : `${a.member_id.first_name} ${a.member_id.last_name}`}
                  </td>
                  <td className="border-b p-2">
                    {a.is_guest ? "Guest" : a.member_id.status || "active"}
                  </td>
                  <td className="border-b p-2">
                    {a.is_guest ? "Guest" : a.member_id.network}
                  </td>
                  <td className="border-b p-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={attendanceMap[key] === "present"}
                        onChange={() => handleToggle(a)}
                        disabled={!isEditing}
                      />
                      {attendanceMap[key] === "present" ? "Present" : "Absent"}
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Attendance
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsEditing(true)}
            >
              Edit Attendance
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default AttendanceModal;
