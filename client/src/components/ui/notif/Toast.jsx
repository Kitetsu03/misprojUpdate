import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("success");

function Toast() {
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
  </Snackbar>;
}
export default Toast;
