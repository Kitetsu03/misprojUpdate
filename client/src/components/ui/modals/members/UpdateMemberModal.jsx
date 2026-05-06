import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect, useRef } from "react";

import DropdownAddress from "../../buttons/DropdownAddress.jsx";
import CustomTabPanel from "../../tabs/CustomTabPanel.jsx";
import { Input } from "../../input/Input.jsx";

import {
  getRegions,
  getCities,
  getProvinces,
  getBarangays,
} from "../../../../services/locationService.js";

import { saveMember } from "../../../../services/memberService.js";
import validateAll from "../../../../utils/validator.js";
import { memberPatterns } from "../../../../utils/patterns.js";

const initialForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  contact_no: "",
  sex: "",
  marital_status: "",
  birth_date: "",
  suffix: "",
  region: "",
  province: "",
  city: "",
  barangay: "",
  join_date: "",
  life_group: "",
  role: "member",
};

function UpdateMemberModal({ open, onClose, userData, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [value, setValue] = useState(0);

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const locationCache = useRef({
    regions: [],
    provinces: {},
    cities: {},
    barangays: {},
  });

  const sanitizeInput = (value) => {
    if (typeof value !== "string") return value;

    return value
      .replace(/<[^>]*>?/gm, "") // remove HTML tags
      .replace(/[<>]/g, "") // extra safety
      .replace(/javascript:/gi, "") // prevent JS injection
      .trim();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let cleanValue = value;

    cleanValue = sanitizeInput(cleanValue);

    if (["first_name", "middle_name", "last_name"].includes(name)) {
      cleanValue = cleanValue.replace(/[0-9]/g, ""); // remove numbers
    }

    if (name === "contact_no") {
      cleanValue = cleanValue.replace(/[^0-9]/g, ""); // numbers only
    }

    // (optional) suffix rules (allow letters + roman numerals)
    if (name === "suffix") {
      cleanValue = cleanValue.replace(/[^a-zA-Z\s.]/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));
  };

  const handleTabChange = (_, newValue) => setValue(newValue);

  const handleRegionChange = (value) => {
    setForm((prev) => ({
      ...prev,
      region: value,
      province: "",
      city: "",
      barangay: "",
    }));
    setProvinces([]);
    setCities([]);
    setBarangays([]);
  };

  const handleProvinceChange = (value) => {
    setForm((prev) => ({
      ...prev,
      province: value,
      city: "",
      barangay: "",
    }));
    setCities([]);
    setBarangays([]);
  };

  const handleCityChange = (value) => {
    setForm((prev) => ({
      ...prev,
      city: value,
      barangay: "",
    }));
    setBarangays([]);
  };

  const handleBrgyChange = (value) => {
    setForm((prev) => ({ ...prev, barangay: value }));
  };

  const mapUserToForm = (userData) => {
    if (!userData) return initialForm;

    return {
      ...initialForm,
      ...userData,
      region: userData.region || "",
      province: userData.province || "",
      city: userData.city || "",
      barangay: userData.barangay || "",
      birth_date: userData.birth_date
        ? userData.birth_date.split("T")[0]
        : new Date().toISOString().split("T")[0],

      join_date: userData.join_date
        ? userData.join_date.split("T")[0]
        : new Date().toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    if (userData && regions.length > 0) {
      const regionCode =
        regions.find((r) => r.label === userData.region)?.value ||
        userData.region;

      setForm({
        ...mapUserToForm(userData),
        region: regionCode,
      });
    }
  }, [userData, regions]);

  useEffect(() => {
    if (!open) return;
    setValue(0);
  }, [open]);

  // Fetch Regions
  useEffect(() => {
    const fetch = async () => {
      if (locationCache.current.regions.length) {
        setRegions(locationCache.current.regions);
        return;
      }

      setLoadingRegions(true);
      try {
        const res = await getRegions();
        const formatted = res.map((r) => ({
          label: r.name,
          value: r.code,
        }));
        locationCache.current.regions = formatted;
        setRegions(formatted);
      } finally {
        setLoadingRegions(false);
      }
    };
    fetch();
  }, []);

  // Provinces
  useEffect(() => {
    if (!form.region) return;

    const fetch = async () => {
      if (locationCache.current.provinces[form.region]) {
        setProvinces(locationCache.current.provinces[form.region]);
        return;
      }

      setLoadingProvinces(true);
      try {
        const res = await getProvinces(form.region);
        const formatted = res.map((p) => ({
          label: p.name,
          value: p.code,
        }));
        locationCache.current.provinces[form.region] = formatted;
        setProvinces(formatted);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetch();
  }, [form.region]);

  // Cities
  useEffect(() => {
    if (!form.province) return;

    const fetch = async () => {
      if (locationCache.current.cities[form.province]) {
        setCities(locationCache.current.cities[form.province]);
        return;
      }

      setLoadingCities(true);
      try {
        const res = await getCities(form.province);
        const formatted = res.map((c) => ({
          label: c.name,
          value: c.code,
        }));
        locationCache.current.cities[form.province] = formatted;
        setCities(formatted);
      } finally {
        setLoadingCities(false);
      }
    };

    fetch();
  }, [form.province]);

  // Barangays
  useEffect(() => {
    if (!form.city) return;

    const fetch = async () => {
      if (locationCache.current.barangays[form.city]) {
        setBarangays(locationCache.current.barangays[form.city]);
        return;
      }

      setLoadingBarangays(true);
      try {
        const res = await getBarangays(form.city);
        const formatted = res.map((b) => ({
          label: b.name,
          value: b.code,
        }));
        locationCache.current.barangays[form.city] = formatted;
        setBarangays(formatted);
      } finally {
        setLoadingBarangays(false);
      }
    };

    fetch();
  }, [form.city]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clean = {
      ...form,
      first_name: sanitizeInput(form.first_name),
      middle_name: sanitizeInput(form.middle_name),
      last_name: sanitizeInput(form.last_name),
      marital_status: sanitizeInput(form.marital_status),
      contact_no: form.contact_no.trim(),
    };

    const errors = validateAll(clean, memberPatterns);

    if (!clean.first_name) errors.push("First name is required");
    if (!clean.last_name) errors.push("Last name is required");
    if (!clean.sex) errors.push("Sex is required");
    if (!clean.marital_status) errors.push("Marital status is required");
    if (!clean.birth_date) errors.push("Birth date is required");
    if (!clean.region) errors.push("Region is required");
    if (!clean.province) errors.push("Province is required");
    if (!clean.city) errors.push("City is required");
    if (!clean.barangay) errors.push("Barangay is required");

    if (errors.length) {
      setSnackbar({
        open: true,
        message: errors[0],
        severity: "warning",
      });
      return;
    }

    try {
      setSubmitting(true);

      await saveMember(userData.user_id, {
        ...clean,
        address: {
          region: clean.region,
          province: clean.province,
          city: clean.city,
          barangay: clean.barangay,
        },
      });

      onSuccess?.();
      onClose();

      setForm(initialForm);

      setSnackbar({
        open: true,
        message: "Member saved successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update member",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        className="font-secondary "
      >
        <DialogTitle>
          <h3 className="text-2xl font-semibold pl-3 pt-3">Update Member</h3>
          <p className="text-gray-500 text-sm pl-3">
            Edit existing user from the church management system.
          </p>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              indicatorColor="primary"
              textColor="primary"
              sx={{
                "& .MuiTab-root": {
                  minWidth: 0,
                  width: "auto",
                  padding: "6px 0",
                  px: 2,
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.9rem",
                  },
                  whiteSpace: "nowrap",
                },
              }}
            >
              <Tab label="Personal Info" />
              <Tab label="Contact Details" />
              <Tab label="Church Info" />
            </Tabs>
          </Box>

          <form
            onSubmit={handleSubmit}
            className="w-full overflow-x-hidden font-secondary "
          >
            <CustomTabPanel value={value} index={0}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <Input
                  name="suffix"
                  value={form.suffix}
                  onChange={handleInputChange}
                  label="Enter Suffix (Leave blank if none)"
                  placeholder="Enter Suffix (Sr, Jr, III)"
                />
                <Input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleInputChange}
                  label="First Name"
                  placeholder="Enter First Name"
                />
                <Input
                  name="middle_name"
                  value={form.middle_name}
                  onChange={handleInputChange}
                  label="Middle Name (Leave blank if none)"
                  placeholder="Enter Middle Name"
                />
                <Input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleInputChange}
                  label="Last Name"
                  placeholder="Enter Last Name"
                />

                <div className="space-y-2">
                  <label htmlFor="Status" className="font-medium">
                    Sex
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-100 cursor-pointer"
                    name="sex"
                    value={form.sex}
                    onChange={handleInputChange}
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
                    className="w-full p-3 border rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-100 cursor-pointer"
                    name="marital_status"
                    value={form.marital_status}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Civil Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>
                <Input
                  name="birth_date"
                  type="date"
                  value={form.birth_date}
                  onChange={handleInputChange}
                  label="Birth Date"
                />

                <DropdownAddress
                  label="Region"
                  value={form.region}
                  onChange={handleRegionChange}
                  options={regions}
                />
                <DropdownAddress
                  label="Province"
                  value={form.province}
                  onChange={handleProvinceChange}
                  options={provinces}
                  disabled={!form.region}
                />

                <DropdownAddress
                  label="City"
                  value={form.city}
                  onChange={handleCityChange}
                  options={cities}
                  disabled={!form.province}
                />

                <DropdownAddress
                  label="Barangay"
                  value={form.barangay}
                  onChange={handleBrgyChange}
                  options={barangays}
                  disabled={!form.city}
                />
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <div className="space-y-2">
                <Input
                  name="email"
                  value={form.email}
                  disabled
                  label="Email (cannot be changed)"
                />
                <Input
                  name="contact_no"
                  value={form.contact_no}
                  onChange={handleInputChange}
                  label="Phone"
                  placeholder="Enter Contact Number"
                />
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
              <Input
                label="Join Date"
                name="join_date"
                value={form.join_date}
                onChange={handleInputChange}
                type="date"
              />
            </CustomTabPanel>

            <DialogActions>
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 font-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50 font-secondary"
                type="submit"
                disabled={submitting}
              >
                Update
              </button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UpdateMemberModal;
