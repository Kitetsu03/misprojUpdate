import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { Input } from "../../input/Input.jsx";
import { createService } from "../../../../services/worshipEventService.js";

function CreateServiceModal({ open, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const serviceOptions = [
    "Sunday Service",
    "Youth Service",
    "Prayer Meeting",
    "Special Service",
  ];

  const timeOptions = ["8:00 AM", "10:00 AM", "3:00 PM", "6:00 PM"];

  // Disable past dates
  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    setServiceDate(selectedDate);

    const day = new Date(selectedDate).getDay();

    if (day === 0) {
      setTitle("Sunday Service");
    }
  };

  const getNextSunday = () => {
    const today = new Date();
    const nextSunday = new Date(today);
    const daysUntilSunday = (7 - today.getDay()) % 7;

    nextSunday.setDate(today.getDate() + daysUntilSunday);
    return nextSunday.toISOString().split("T")[0];
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !serviceDate || !time || !location) {
      setSnackbarMessage("All fields are required.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      const payload = {
        title,
        service_date: serviceDate,
        time,
        location,
      };

      await createService(payload);

      setSnackbarMessage("Service created successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      if (onSuccess) onSuccess();

      setTitle("");
      setServiceDate("");
      setTime("");
      setLocation("");
      onClose();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Failed to create service.";

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
          <h1 className="text-2xl font-semibold pl-3 pt-3">Create Event</h1>

          <p className="text-gray-500 text-sm pl-3">
            Add a new worship service schedule.
          </p>
        </DialogTitle>

        <DialogContent>
          <form
            id="create-service-form"
            onSubmit={handleCreate}
            className="space-y-4 mt-2 font-secondary p-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 font-secondary p-3">
              <TextField
                select
                label="Service Title"
                value={title}
                onChange={(e) => {
                  const selectedTitle = e.target.value;
                  setTitle(selectedTitle);
                  if (selectedTitle === "Sunday Service") {
                    setServiceDate(getNextSunday());
                    setLocation("Main Church");
                  }
                }}
                fullWidth
              >
                {serviceOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Service Time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Input
                id="service_date"
                type="date"
                label="Service Date"
                value={serviceDate}
                min={today}
                onChange={handleDateChange}
              />
              <Input
                id="location"
                type="text"
                label="Location"
                value={location}
                placeholder="Main Church"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
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
              form="create-service-form"
              disabled={!title || !serviceDate || !time || !location}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50 font-secondary"
            >
              Create
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateServiceModal;
