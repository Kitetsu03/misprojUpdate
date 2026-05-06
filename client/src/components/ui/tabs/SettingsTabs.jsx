import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { BlackButton } from "../buttons/BlackButton";
import { Input } from "../input/Input";
import { useState } from "react";

export const SettingsTabs = () => {
  const [value, setValue] = useState(0);

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

  return (
    <>
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
              <BlackButton val="+ Add Event" />
            </div>
          </div>
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
