import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { updateUserRole } from "../../../../services/userService.js";

function RoleUpdateModal({ open, onClose, userData, onSuccess }) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (userData) {
      setRole(userData.role || "");
    }
  }, [userData]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setSnackbar({
        open: true,
        message: "Please select a role.",
        severity: "warning",
      });
      return;
    }

    // Prevent unnecessary update
    if (role === userData.role) {
      setSnackbar({
        open: true,
        message: "No role changes detected.",
        severity: "info",
      });
      return;
    }

    try {
      setLoading(true);

      // ROLE-ONLY UPDATE
      await updateUserRole(userData.id, role);

      setSnackbar({
        open: true,
        message: "Role updated successfully!",
        severity: "success",
      });

      if (onSuccess) {
        await onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to update role. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open || !userData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-10">
        <h2 className="text-2xl font-semibold mb-2">Update User Role</h2>

        <p className="text-gray-500 text-sm mb-6">
          Change role for{" "}
          <span className="font-semibold">
            {userData.name || userData.username}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-medium block mb-2">Role</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Role</option>
              <option value="gatekeeper">Gatekeeper</option>
              <option value="member">Member</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default RoleUpdateModal;
