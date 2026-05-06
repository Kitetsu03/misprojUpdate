import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { deleteUser } from "../../../../services/userService.js";

//TODO do not delete just append
function DeleteUserModal({ open, onClose, userData, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleDelete = async () => {
    if (!userData) return;

    try {
      setLoading(true);
      await deleteUser(userData.id);

      setSnackbarMessage("User deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setSnackbarMessage("Failed to delete user.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        <DialogTitle className="text-red-600 font-bold font-secondary">
          Delete User
        </DialogTitle>

        <DialogContent>
          <div className="font-secondary">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{userData?.name}</span>?
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </DialogContent>

        <DialogActions>
          <div className="pb-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-200 font-secondary"
            >
              Cancel
            </button>
          </div>
          <div className="pb-3 pr-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 font-secondary"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteUserModal;
