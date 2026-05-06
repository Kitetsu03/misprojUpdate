import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Input } from "../../input/Input.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { registerPatterns, loginPatterns } from "../../../../utils/patterns.js";
import validateAll from "../../../../utils/validator.js";
import { updateUser } from "../../../../services/userService.js";

function UpdateUserModal({ open, onClose, userData, onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (userData) {
      setEmail(userData.email || "");
      setPassword("");
      setConfirmPassword("");
    }
  }, [userData]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!userData?.id) {
      return;
    }

    const values = {
      email: email,
      password,
      confirmPassword,
    };

    // Only include password rules if user typed something
    let patternsToUse = [...loginPatterns];

    if (password) {
      patternsToUse = [...patternsToUse, ...registerPatterns];
    } else {
      values.confirmPassword = "";
    }

    const errors = validateAll(values, patternsToUse);

    if (errors.length > 0) {
      setSnackbarMessage(errors.join("\n"));
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      const payload = {
        email: email,
      };

      if (password) {
        payload.passkey = password;
      }
      console.log("Payload:", payload);
      console.log("Updating user:", userData);

      await updateUser(userData.id, payload);

      if (onSuccess) onSuccess();
      setSnackbarMessage("User updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      onClose();
    } catch (error) {
      const backendMessage =
        error.response?.data?.errors?.join("\n") ||
        error.response?.data?.message ||
        "Update failed. Please try again.";

      setSnackbarMessage(backendMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        <DialogTitle>
          <h1 className="text-2xl font-semibold pl-3 pt-3">Update User</h1>
          <p className="text-gray-500 text-sm pl-3">
            Edit existing user from the church management system.
          </p>
        </DialogTitle>

        <DialogContent>
          <form
            id="update-member-form"
            onSubmit={handleUpdate}
            className="space-y-4 mt-2 font-secondary p-3"
          >
            <Input
              id="email"
              type="text"
              label="Email (cannot be changed)"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={
                <span
                  className="select-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              }
            />

            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              rightElement={
                <span
                  className="select-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              }
            />
          </form>
        </DialogContent>

        <DialogActions>
          <div className="pb-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 font-secondary"
            >
              Cancel
            </button>
          </div>
          <div className="pb-3 pr-3">
            <button
              type="submit"
              form="update-form"
              disabled={!email}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50 font-secondary"
            >
              Update
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateUserModal;
