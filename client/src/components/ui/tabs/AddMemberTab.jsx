import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DropdownAddress from "../buttons/DropdownAddress.jsx";
import CustomTabPanel from "./CustomTabPanel.jsx";
import { Input } from "../input/Input.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect, useRef } from "react";
import {
  getRegions,
  getCities,
  getProvinces,
  getBarangays,
} from "../../../services/locationService.js";
import { createMember } from "../../../services/memberService.js";
import validateAll from "../../../utils/validator.js";
import { memberPatterns } from "../../../utils/patterns.js";

export const AddMemberTab = ({ onSuccess, setSubmitting }) => {
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState(0);
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [brgy, setBrgy] = useState("");

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [suffix, setSuffix] = useState("");

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");

  const [maritalStatus, setMaritalStatus] = useState("");
  const [birthdate, setBirthDate] = useState("");

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [joinDate, setJoinDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [lifeGroup, setLifeGroup] = useState("");
  const [role, setRole] = useState("member");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const locationCache = useRef({
    regions: [],
    provinces: {},
    cities: {},
    barangays: {},
  });

  // Load Regions (on mount)
  useEffect(() => {
    const fetchRegions = async () => {
      if (locationCache.current.regions.length > 0) {
        setRegions(locationCache.current.regions);
        return;
      }
      try {
        setLoadingRegions(true);
        const res = await getRegions();

        const formatted = res.map((r) => ({
          label: r.name,
          value: r.code,
        }));

        locationCache.current.regions = formatted;
        setRegions(formatted);
      } catch (err) {
        setError("Failed to load Regions");
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  // Load Provinces depends on region
  useEffect(() => {
    if (!region) return;

    const fetchProvincesData = async () => {
      if (locationCache.current.provinces[region]) {
        setProvinces(locationCache.current.provinces[region]);
        return;
      }

      try {
        setLoadingProvinces(true);
        const res = await getProvinces(region);

        const formatted = res.map((p) => ({
          label: p.name,
          value: p.code,
        }));

        locationCache.current.provinces[region] = formatted;
        setProvinces(formatted);
      } catch (err) {
        setError("Failed to load Provinces");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvincesData();
  }, [region]);

  // Load Cities (depends on province)
  useEffect(() => {
    if (!province) return;

    const fetchCitiesData = async () => {
      if (locationCache.current.cities[province]) {
        setCities(locationCache.current.cities[province]);
        return;
      }

      try {
        setLoadingCities(true);
        const res = await getCities(province);

        const formatted = res.map((c) => ({
          label: c.name,
          value: c.code,
        }));
        locationCache.current.cities[province] = formatted;

        setCities(formatted);
      } catch (err) {
        setError("Failed to load Cities");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCitiesData();
  }, [province]);
  useEffect(() => {
    if (!city) return;

    const fetchBarangaysData = async () => {
      if (locationCache.current.barangays[city]) {
        setBarangays(locationCache.current.barangays[city]);
        return;
      }

      try {
        setLoadingBarangays(true);
        const res = await getBarangays(city);

        const formatted = res.map((b) => ({
          label: b.name,
          value: b.code,
        }));

        locationCache.current.barangays[city] = formatted;

        setBarangays(formatted);
      } catch (err) {
        setError("Failed to load Barangays");
      } finally {
        setLoadingBarangays(false);
      }
    };

    fetchBarangaysData();
  }, [city]);

  // To reset each drops when parent changed
  const handleRegionChange = (value) => {
    setRegion(value);
    setProvince("");
    setCity("");
    setBrgy("");

    setProvinces([]);
    setCities([]);
    setBarangays([]);
  };

  const handleProvinceChange = (value) => {
    setProvince(value);
    setCity("");
    setBrgy("");

    setCities([]);
    setBarangays([]);
  };

  const handleCityChange = (value) => {
    setCity(value);
    setBrgy("");
    setBarangays([]);
  };

  const handleBrgyChange = (value) => {
    setBrgy(value);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const sanitizeInput = (value) => {
    if (typeof value !== "string") return value;

    return value
      .replace(/<[^>]*>?/gm, "") // remove HTML tags
      .replace(/[<>]/g, "") // extra safety
      .replace(/javascript:/gi, ""); // prevent JS injection
  };

  const handleTextOnly = (setter) => (e) => {
    const value = e.target.value.replace(/[0-9]/g, "");
    setter(value);
  };

  const handleNameInput = (setter) => (e) => {
    let value = e.target.value;

    value = sanitizeInput(value);
    value = value.replace(/[0-9]/g, "");

    setter(value);
  };

  const handlePhoneInput = (setter) => (e) => {
    let value = e.target.value;

    value = sanitizeInput(value);
    value = value.replace(/[^0-9]/g, "");

    setter(value);
  };

  const resetForm = () => {
    setSex("");
    setSuffix("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setMaritalStatus("");
    setBirthDate("");
    setRegion("");
    setProvince("");
    setCity("");
    setBrgy("");
    setEmail("");
    setPhoneNumber("");
    setJoinDate("");
    setLifeGroup("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = {
      suffix: suffix.trim(),
      firstName: sanitizeInput(firstName),
      middleName: sanitizeInput(middleName),
      lastName: sanitizeInput(lastName),
      sex: sex,
      maritalStatus: sanitizeInput(maritalStatus),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
    };

    const validationErrors = validateAll(values, memberPatterns);

    if (!firstName) validationErrors.push("First Name is required.");
    if (!lastName) validationErrors.push("Last Name is required.");
    if (!sex) validationErrors.push("Sex is required.");
    if (!maritalStatus) validationErrors.push("Marital Status is required.");
    if (!email) validationErrors.push("Email is required.");
    if (!birthdate) validationErrors.push("Birthdate is required.");
    if (!joinDate) validationErrors.push("Join date is required.");
    if (!region) validationErrors.push("Region is required.");
    if (!province) validationErrors.push("Province is required.");
    if (!city) validationErrors.push("City is required.");
    if (!brgy) validationErrors.push("Barangay is required.");

    if (validationErrors.length > 0) {
      validationErrors.forEach((message) => {
        setSnackbarMessage(message);
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
      });
      return;
    }

    const memberData = {
      first_name: sanitizeInput(firstName),
      middle_name: sanitizeInput(middleName),
      last_name: sanitizeInput(lastName),
      sex: sex,
      marital_status: sanitizeInput(maritalStatus),
      suffix: sanitizeInput(suffix),
      birth_date: birthdate,
      region,
      province,
      city,
      barangay: brgy,
      role: "member",
      email: email.trim(),
      contact_no: phoneNumber.trim(),
      join_date: joinDate,
      life_group: sanitizeInput(lifeGroup),
    };

    try {
      setSubmitting(true);
      setError("");

      await createMember(memberData);

      if (onSuccess) {
        onSuccess();
      }

      resetForm();

      setSnackbarMessage(
        "Member added successfully! User account credentials were sent via email.",
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      const backendMessage =
        err.response?.data?.errors?.join("\n") ||
        err.response?.data?.message ||
        "Failed to add member.";
      setSnackbarMessage(backendMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white w-full max-w-4xl mx-auto rounded-2xl px-2 sm:px-4">
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

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            indicatorColor="primary"
            textColor="primary"
            sx={{
              "& .MuiTab-root": {
                minWidth: "unset",
                px: 2,
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.9rem",
                },
                whiteSpace: "nowrap",
              },
            }}
          >
            <Tab label="Personal Info" {...a11yProps(0)} />
            <Tab label="Contact Details" {...a11yProps(1)} />
            <Tab label="Church Info" {...a11yProps(2)} />
          </Tabs>
        </Box>
      </div>
      <form
        id="add-member-form"
        onSubmit={handleSubmit}
        className="w-full overflow-x-hidden"
      >
        <CustomTabPanel value={value} index={0}>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Input
                id="suffix"
                name="suffix"
                label="Suffix (Leave blank if none)"
                type="text"
                placeholder="Enter Suffix (ex. JR, SR, etc.)"
                value={suffix}
                onChange={handleNameInput(setSuffix)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="firstName"
                name="firstName"
                label="First Name"
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={handleNameInput(setFirstName)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="middleName"
                name="middleName"
                label="Middle Name (Leave blank if none)"
                type="text"
                placeholder="Enter Middle Name"
                value={middleName}
                onChange={handleNameInput(setMiddleName)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="lastName"
                name="lastName"
                label="Last Name"
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={handleNameInput(setLastName)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="Status" className="font-medium">
                Sex
              </label>
              <select
                id="sex"
                name="sex"
                label="Sex"
                type="text"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="w-full p-3 border rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-100 cursor-pointer"
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="Status" className="font-medium">
                Civil Status
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                label="Status"
                type="text"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full p-3 border rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Civil Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
            </div>
            <div className="space-y-1">
              <Input
                id="birthdate"
                name="birthdate"
                label="Birth Date"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            {/* Region */}
            <DropdownAddress
              label="Region"
              value={region}
              onChange={handleRegionChange}
              loading={loadingRegions}
              placeholder="Select Region"
              options={regions}
            />
            {/* Province */}
            <DropdownAddress
              label="Province"
              value={province}
              onChange={handleProvinceChange}
              loading={loadingProvinces}
              placeholder="Select Province"
              options={provinces}
              disabled={!region}
            />

            {/* City / Municipality */}
            <DropdownAddress
              label="City / Municipality"
              value={city}
              onChange={handleCityChange}
              loading={loadingCities}
              placeholder="Select City / Municipality"
              options={cities}
              disabled={!province}
            />

            {/* Barangay */}
            <DropdownAddress
              label="Barangay"
              value={brgy}
              onChange={handleBrgyChange}
              loading={loadingBarangays}
              placeholder="Select Barangay"
              options={barangays}
              disabled={!city}
            />
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="grid grid-cols-1 gap-6 ">
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                type="text"
                placeholder="0912 345 6789"
                value={phoneNumber}
                onChange={handlePhoneInput(setPhoneNumber)}
              />
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <div className="grid grid-cols-1 gap-6 ">
            <div className="space-y-2">
              <Input
                id="joinDate"
                name="joinDate"
                label="Join Date"
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
              />
            </div>
          </div>
        </CustomTabPanel>
      </form>
    </>
  );
};
