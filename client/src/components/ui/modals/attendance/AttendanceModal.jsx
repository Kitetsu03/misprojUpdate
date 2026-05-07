import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function AttendanceModal({
  open,
  onClose,
  attendees = [],
  onToggle,
  loadingIds = [],
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <h2 className="text-2xl font-semibold">Worship Attendance</h2>

        <p className="text-sm text-gray-500">One-click attendance checking</p>
      </DialogTitle>

      <DialogContent dividers>
        {!attendees.length ? (
          <div className="border rounded-lg p-6 text-center text-gray-500">
            No attendees found.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 bg-gray-100 font-semibold px-4 py-3">
              <span>Name</span>
              <span>Present</span>
            </div>

            {/* Rows */}
            {attendees.map((person) => {
              const isLoading = loadingIds.includes(person._id || person.id);

              const fullName = person.is_guest
                ? person.guest_name
                : person.name ||
                  `${person.first_name || ""} ${person.last_name || ""}`;

              return (
                <div
                  key={person._id || person.id}
                  className="grid grid-cols-2 px-4 py-3 border-t items-center"
                >
                  <span className="truncate">{fullName}</span>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        person.status === "present" ||
                        person.attendance === "Present"
                      }
                      onChange={() => onToggle?.(person)}
                      disabled={isLoading}
                    />

                    {isLoading && <CircularProgress size={16} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200">
          Close
        </button>

        <button className="px-4 py-2 rounded-lg bg-black text-white">
          Save Attendance
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default AttendanceModal;
