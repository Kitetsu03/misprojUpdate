import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DropdownAddress from "../../buttons/DropdownAddress.jsx";
import CustomTabPanel from "../../tabs/CustomTabPanel.jsx";
import { Input } from "../../input/Input.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect, useRef } from "react";
import {
  getRegions,
  getCities,
  getProvinces,
  getBarangays,
} from "../../../../services/locationService.js";
import { createMember } from "../../../../services/memberService.js";
import validateAll from "../../../../utils/validator.js";
import { memberPatterns } from "../../../../utils/patterns.js";

function CreaterServiceModal({ open, onClose, userData, onSuccess }) {
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
    return value.replace(/[<>/"'`;(){}]/g, "").trim();
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
      sex,
      marital_status,
      suffix: sanitizeInput(suffix),
      birthdate,
      region,
      province,
      city,
      barangay: brgy,
      role,
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
      setRole("member");
      setEmail("");
      setPhoneNumber("");
      setJoinDate("");
      setLifeGroup("");

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
      {" "}
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
                    label="Suffix"
                    type="text"
                    placeholder="Enter Suffix (optional)"
                    value={suffix}
                    onChange={(e) => setFirstName(e.target.value)}
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
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="middleName"
                    name="middleName"
                    label="Middle Name"
                    type="text"
                    placeholder="Enter Middle Name (optional)"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
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
                    onChange={(e) => setLastName(e.target.value)}
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
                    className="w-full p-3 border rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="Status" className="font-medium">
                    Marital Status
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
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorsed">Divorsed</option>
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

                <div className="md:col-span-1 space-y-1">
                  <label className="font-medium">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="member">Member</option>
                  </select>
                </div>
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
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
export default CreateServiceModal;
