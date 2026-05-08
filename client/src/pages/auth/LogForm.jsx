import { loginPatterns } from "../../utils/patterns.js";
import validateAll from "../../utils/validator.js";
import { checkSession, getCurrentUser } from "../../module/Session.js";
import { loginUser } from "../../services/authService.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function LogForm({ setLoaderVisible }) {
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  // CHECK EXISTING SESSION
  useEffect(() => {
    const verifySession = async () => {
      const currentSession = await checkSession(getCurrentUser());

      if (currentSession && !localStorage.getItem("forcePasswordChange")) {
        navigate("/admin");
      }
    };

    verifySession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = {
      email: email.trim(),
      password: password.trim(),
    };

    const validated = validateAll(values, loginPatterns);

    //TODO I need to stack
    if (validated.length > 0) {
      validated.forEach((val) => {
        setSnackbarMessage(val);
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
      });
      return;
    }

    try {
      const response = await loginUser({
        email: email.trim(),
        passkey: password.trim(),
      });

      const { token, user } = response;

      // FORCE PASSWORD CHANGE
      if (user?.mustChangePassword) {
        localStorage.setItem("forcePasswordChange", "true");
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        setSnackbarMessage("Password reset required.");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);

        setTimeout(() => {
          navigate("/change-password", {
            state: {
              userId: user._id,
            },
          });
        }, 3000);

        return;
      }

      // STORE AUTH DATA
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSnackbarMessage("Logged in successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        switch (user?.role) {
          case "admin":
            navigate("/admin");
            break;

          case "gatekeeper":
            navigate("/gatekeeper");
            break;

          case "member":
            navigate("/member");
            break;

          default:
            setSnackbarMessage("Unknown role. Contact admin.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            navigate("/");
        }
      }, 3000);
    } catch (error) {
      const backendMessage =
        "Invalid email or password. Please try again." ||
        error.response?.data?.errors?.join("\n") ||
        error.response?.data?.message;
      setSnackbarMessage(backendMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <div className="h-auto">
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
      </div>

      <div className="container h-full w-full absolute top-[50%] left-[50%] -translate-[50%] md:h-fit md:w-120 xl:w-150 flex justify-center content-center">
        <div className="card rounded-2xl w-[95dvw] md:w-full pt-5">
          <div className="card-header">
            <div className="my-logo justify-center"></div>

            <h2 className="cursor-default text-center pb-2 text-[min(5vw,20px)] md:text-[min(5vw,30px)]">
              LOGIN ACCOUNT
            </h2>

            <hr className="p-1 border-white bg-white" />
          </div>

          <form
            onSubmit={handleSubmit}
            method="POST"
            className="card-body p-5 flex-row gap-4 text-[min(5vw,15px)] md:text-[min(5vw,20px)]"
          >
            <div className="form-group">
              <input
                id="email"
                className="form-control"
                autoComplete="email"
                name="email"
                type="text"
                placeholder=" "
                value={email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
              <label htmlFor="email">Email address</label>
            </div>

            <div className="form-group">
              <input
                id="password"
                className="form-control"
                autoComplete="current-password"
                name="password"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="card-footer flex flex-col justify-center items-center">
              <button
                className="submit cursor-pointer bg-blue-500 text-white p-1 mt-2"
                type="submit"
              >
                Login Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LogForm;
