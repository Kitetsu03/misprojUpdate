import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import SearchBar from "../input/SearchBar.jsx";
import Dropdown from "../buttons/Dropdown.jsx";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useState, useMemo, useEffect } from "react";
import AttendanceModal from "../modals/attendance/AttendanceModal.jsx";
import { getServices } from "../../../services/worshipEventService.js";

import { motion } from "motion/react";

export const AttendanceTabs = () => {
  const [value, setValue] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleOpenAttendance = (event) => {
    setSelectedEvent(event);
    setAttendanceModalOpen(true);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getServices();
      setEvents(response.data);
      console.log("Services fetched:", response.data);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || "Failed to fetch events.",
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    if (!eventTypeFilter) return events;

    return events.filter(
      (event) => event.title?.toLowerCase() === eventTypeFilter.toLowerCase(),
    );

    console.log(events);
  }, [events, eventTypeFilter]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  // ANIMATIONS
  const cardSpring = {
    type: "spring",
    stiffness: 300,
    damping: 26,
  };

  const cardAnim = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

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

      <div className="card w-full rounded-2xl">
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Worship Service" {...a11yProps(0)} />
            <Tab label="Lifegroup" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </div>

      <div className="card w-full mx-2 rounded-2xl gap-2 mt-2 p-2 flex flex-col font-secondary">
        <CustomTabPanel value={value} index={0}>
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
            <div>
              <h2 className="font-semibold text-lg">Service Schedule</h2>
              <p className="text-sm text-gray-600 mb-8">
                Manage service times and locations.
              </p>
            </div>
            <div className="w-full md:w-64">
              <Dropdown
                color="bg-[#A7E6FF]"
                value={eventTypeFilter}
                placeholder="Filter by event title"
                onChange={(value) => setEventTypeFilter(value)}
                options={[
                  { label: "All Events", value: "" },
                  { label: "Worship Service", value: "sunday service" },
                  { label: "Special Service", value: "special service" },
                  { label: "Prayer Meeting", value: "prayer meeting" },
                  { label: "Youth Service", value: "youth service" },
                ]}
              />
            </div>
          </div>

          {/* EVENTS */}
          {loading ? (
            <div className="text-gray-500 text-sm">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-gray-500 text-sm">No events found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  onClick={() => handleOpenAttendance(event)}
                  className="card p-5 rounded-2xl text-green-950 flex flex-col cursor-pointer inset-shadow-2xs shadow-md"
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.99 }}
                  transition={cardSpring}
                  initial={cardAnim.initial}
                  animate={cardAnim.animate}
                >
                  {/* TITLE */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xl">{event.title}</h3>
                    </div>
                    <button
                      onClick={() => handleOpenAttendance(event)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      <HiOutlinePencilSquare size={16} /> Edit
                    </button>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="font-medium">Date</span>

                      <span className="text-right font-medium">
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

                    <div className="flex justify-between gap-3">
                      <span className="font-medium">Location</span>

                      <span className="text-right font-medium">
                        {event.location}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CustomTabPanel>
      </div>

      <CustomTabPanel value={value} index={1}></CustomTabPanel>

      <AttendanceModal
        open={attendanceModalOpen}
        onClose={() => {
          setAttendanceModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </>
  );
};
