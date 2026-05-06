import axios from "axios";

const API = axios.create({
  baseURL: "https://psgc.gitlab.io/api",
});

export const getRegions = async () => {
  const res = await API.get("/regions");
  return res.data;
};

export const getProvinces = async (regionCode) => {
  const res = await API.get(`/regions/${regionCode}/provinces`);
  return res.data;
};

export const getCities = async (provinceCode) => {
  const res = await API.get(`/provinces/${provinceCode}/cities-municipalities`);
  return res.data;
};

export const getBarangays = async (cityCode) => {
  const res = await API.get(`/cities-municipalities/${cityCode}/barangays`);
  return res.data;
};
