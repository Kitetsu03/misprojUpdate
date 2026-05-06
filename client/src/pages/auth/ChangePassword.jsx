import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { changePassword } from "../../services/authService.js";

function ChangePassword() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { currentPassword, newPassword, confirmPassword } = formData;

  useEffect(() => {
    const forcePasswordChange = localStorage.getItem("forcePasswordChange");

    if (!userId || !forcePasswordChange) {
      navigate("/", { replace: true });
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return showMessage("All fields are required.", "warning");
    }

    if (newPassword.length < 8) {
      return showMessage(
        "New password must be at least 8 characters long.",
        "warning",
      );
    }

    if (newPassword !== confirmPassword) {
      return showMessage("Passwords do not match.", "warning");
    }

    try {
      setLoading(true);

      const response = await changePassword({
        userId,
        currentPassword,
        newPassword,
      });

      showMessage(response.message || "Password changed successfully!");

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("forcePasswordChange");
        navigate("/");
      }, 1500);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        "Failed to change password. Please try again.";

      showMessage(backendMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-auto">
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
      </div>

      <div className="container h-full w-full absolute top-[50%] left-[50%] -translate-[50%] md:h-fit md:w-120 xl:w-150 flex justify-center content-center">
        <div className="card rounded-2xl w-[95dvw] md:w-full pt-5">
          <div className="card-header">
            <div className="my-logo justify-center"></div>

            <h2 className="cursor-default text-center pb-2 text-[min(5vw,20px)] md:text-[min(5vw,30px)]">
              CHANGE PASSWORD
            </h2>

            <p className="text-center text-sm pb-3 px-4">
              You must update your temporary password before continuing.
            </p>

            <hr className="p-1 border-white bg-white" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="card-body p-5 flex-row gap-4 text-[min(5vw,15px)] md:text-[min(5vw,20px)]"
          >
            <div className="form-group">
              <input
                id="currentPassword"
                className="form-control"
                autoComplete="current-password"
                name="currentPassword"
                type="password"
                placeholder=" "
                value={currentPassword}
                onChange={handleChange}
              />
              <label htmlFor="currentPassword">Current Password</label>
            </div>

            <div className="form-group">
              <input
                id="newPassword"
                className="form-control"
                autoComplete="new-password"
                name="newPassword"
                type="password"
                placeholder=" "
                value={newPassword}
                onChange={handleChange}
              />
              <label htmlFor="newPassword">New Password</label>
            </div>

            <div className="form-group">
              <input
                id="confirmPassword"
                className="form-control"
                autoComplete="new-password"
                name="confirmPassword"
                type="password"
                placeholder=" "
                value={confirmPassword}
                onChange={handleChange}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>

            <div className="card-footer flex flex-col justify-center items-center">
              <button
                className="submit cursor-pointer bg-blue-500 text-white p-1 mt-2 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex justify-center items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
