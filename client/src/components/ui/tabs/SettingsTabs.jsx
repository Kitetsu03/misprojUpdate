import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { BlackButton } from "../buttons/BlackButton";
import { Input } from "../input/Input";
import { useEffect, useState } from "react";
import CreateServiceModal from "../modals/service/CreateServiceModal.jsx";
import { getServices } from "../../../services/worshipEventService.js";

export const SettingsTabs = () => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await getServices();

      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);

      setSnackbarMessage(
        error.response?.data?.message || "Failed to fetch events.",
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventCreated = () => {
    fetchEvents();
    setSnackbarMessage("Event added successfully.");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <div className="card mx-2 w-full rounded-2xl">
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
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
      <div className="card mx-2 w-full rounded-2xl">
        <Box sx={{ maxWidth: { xs: 510, sm: 1800 } }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            indicatorColor="primary"
            textColor="bg-black"
            sx={{
              width: "100%",
              "& .MuiTabs-flexContainer": {
                justifyContent: {
                  xs: "flex-start",
                  md: "center",
                },
              },
              "& .MuiTab-root": {
                minWidth: "unset",
                px: 2,
                flexShrink: 0,
                fontWeight: 700,
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                  md: "1rem",
                  lg: "1.05rem",
                },
                whiteSpace: "nowrap",
              },
            }}
          >
            <Tab label="Church Info" {...a11yProps(0)} />
            <Tab label="Services" {...a11yProps(1)} />
            <Tab label="Ministries" {...a11yProps(2)} />
          </Tabs>
        </Box>
      </div>
      <div className="card w-full mx-2 rounded-2xl gap-2 mt-2 p-2 flex flex-col font-secondary">
        <CustomTabPanel value={value} index={0}>
          <h2 className="font-semibold text-lg">Church Information</h2>
          <p className="px-2 text-sm text-gray-600 mb-8">
            Basic church details and contact information.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Input
              label="Church Name"
              value={"Jesus Is Lord Church Atimonan"}
              disabled={true}
            />
            <Input
              label="Church Address"
              value={"Iskong Bantay St. Brgy. Zone IV Poblacion"}
              disabled={true}
            />
          </div>
          <h2 className="font-semibold text-lg pt-8">About Us</h2>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold text-lg">Service Schedule</h2>
              <p className="text-sm text-gray-600 mb-8">
                Manage service times and locations.
              </p>
            </div>
            <div>
              <button
                onClick={() => setOpen(true)}
                className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 font-secondary"
              >
                + Add Event
              </button>
              <CreateServiceModal
                open={open}
                onClose={() => setOpen(false)}
                onSuccess={handleEventCreated}
              />
            </div>
          </div>
          {/* EVENTS */}
          {loading ? (
            <div className="text-gray-500 text-sm">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-gray-500 text-sm">No events found.</div>
          ) : (
            <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="border rounded-2xl p-5 shadow-md bg-white/30 hover:shadow-md transition"
                >
                  {/* TITLE */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Date</span>

                      <span className="text-sm font-medium">
                        {new Date(event.service_date).toLocaleDateString(
                          "en-PH",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Time</span>

                      <span className="font-medium">{event.time}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">Location</span>

                      <span className="font-medium">{event.location}</span>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-5 flex justify-end gap-2">
                    <button className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-100">
                      Edit
                    </button>

                    <button className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold text-lg">Ministry Management</h2>
              <p className="text-sm text-gray-600 mb-8">
                Configure church ministries and leadership assignments.
              </p>
            </div>
            <div>
              <BlackButton val="+ Add Ministry" />
            </div>
          </div>
        </CustomTabPanel>
      </div>
    </>
  );
};
