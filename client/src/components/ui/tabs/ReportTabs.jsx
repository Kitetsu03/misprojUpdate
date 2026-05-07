import { infoCard } from "../../../data/cardsInfo.jsx";
import { ageCard } from "../../../data/cardsInfo.jsx";
import { attendanceCard } from "../../../data/cardsInfo.jsx";
import { lifeGroupCard } from "../../../data/cardsInfo.jsx";
import { financeCard } from "../../../data/cardsInfo.jsx";
import { ministryCard } from "../../../data/cardsInfo.jsx";
import { LineChart } from "../charts/LineChart.jsx";
import { BarLineChart } from "../charts/BarLineChart.jsx";
import { DoughnutChart } from "../charts/DoughnutChart.jsx";

import {
  categoryDistribution,
  ageDemographics,
  membersGrowth,
  attendanceDemographics,
  lifeGroupDemographics,
  tithesAndOfferings,
  expenses,
  offeringVsExpenses,
} from "../../../data/chartData.js";
import Card from "../Card.jsx";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useMemo } from "react";

import SearchBar from "../input/SearchBar.jsx";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";

import AttendanceModal from "../modals/attendance/AttendanceModal.jsx";

export const ReportTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);

  const users = useMemo(
    () => [
      {
        id: 1,
        name: "John Smith",
        network: "Men",
        attendance: "Present",
        timedate: "2025-01-15 | 8:20 AM",
        weeksAttended: 12,
        status: "Member",
        lgname: "Daniel",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        network: "YAN",
        attendance: "Present",
        timedate: "2025-01-15 | 8:10 AM",
        weeksAttended: 12,
        status: "Member",
        lgname: "Moses",
      },
      {
        id: 3,
        name: "Mike Peters",
        network: "KKB",
        attendance: "Present",
        timedate: "2025-01-15 | 8:05 AM",
        weeksAttended: 12,
        status: "Member",
        lgname: "Samuel",
      },
      {
        id: 4,
        name: "Lisa Chen",
        network: "Women",
        attendance: "Present",
        timedate: "2025-01-15 | 8:00 AM",
        weeksAttended: 12,
        status: "Member",
        lgname: "Esther",
      },
    ],
    [],
  );

  const filteredUsers = useMemo(() => {
    if (!query) return users;

    const q = query.toLowerCase();

    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.network.toLowerCase().includes(q),
    );
  }, [users, query]);

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
      <div className=" card w-full rounded-2xl mx-2">
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
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Demographics" {...a11yProps(1)} />
            <Tab label="Attendance" {...a11yProps(2)} />
            <Tab label="LifeGroups" {...a11yProps(3)} />
            <Tab label="Finance" {...a11yProps(4)} />
            <Tab label="Ministries" {...a11yProps(5)} />
            <Tab label="Saved Reports" {...a11yProps(6)} />
          </Tabs>
        </Box>
      </div>
      <CustomTabPanel value={value} index={0}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {infoCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
          {/* LineChart */}
          <LineChart
            title="MEMBERSHIP GROWTH"
            data={membersGrowth}
            description="Total and active members over the last 6 months"
          />
          {/* doughnut chart */}
          <DoughnutChart
            title="MEMBERSHIP DISTRIBUTION BY NETWORK"
            data={categoryDistribution}
            description="Total members by age or network"
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-2 md:p-3 font-secondary">
          <div className="col-span-1 md:col-span-2">
            <BarLineChart
              title={"MEMBERSHIP DEMOGRAPHICS"}
              data={ageDemographics}
              description={
                "Detailed breakdown of member characteristics and trends."
              }
            />
          </div>
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-3">
            {ageCard.map((info) => (
              <Card
                key={info.id}
                title={info.title}
                icon={info.icon}
                info={info.info}
                value={info.value}
                desc={info.desc}
              />
            ))}
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {attendanceCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
          <div className="col-span-1 md:col-span-4 flex justify-center items-center">
            <BarLineChart
              title="FIRST-TIMER AND ATTENDANCE"
              data={attendanceDemographics}
              description="Detailed breakdown of first-timer and attendance trends."
            />
          </div>
        </div>
        <main className="flex-1 p-1 space-y-2 font-secondary">
          <AttendanceModal
            open={attendanceModalOpen}
            onClose={() => setAttendanceModalOpen(false)}
            attendees={users}
          />
          {/* Search & Filter */}
          <div className="card p-5 rounded-xl shadow-md">
            <div className="flex gap-2 justify-between md:flex-row pb-5">
              <h2 className="font-semibold text-lg">Search & Filter</h2>
              <button
                onClick={() => setAttendanceModalOpen(true)}
                className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 font-secondary"
              >
                + Add Attendance
              </button>
            </div>
            <div className="flex gap-2 flex-col md:flex-row">
              <SearchBar
                value={searchValue}
                onChange={(v) => setSearchValue(v)}
                onSearch={() => setQuery(searchValue)}
              />

              <label
                htmlFor="network-filter"
                className="text-sm font-medium flex flex-col md:flex-row items-start md:items-center gap-1"
              >
                Filter by Network
              </label>
              <select
                id="network-filter"
                className="px-4 py-2 rounded-lg border bg-[#A7E6FF] border-black"
              >
                <option>Network</option>
                <option>Men</option>
                <option>Women</option>
                <option>KKB</option>
                <option>YAN</option>
                <option>Children</option>
              </select>
              <label
                htmlFor="from-date"
                className="text-sm font-medium flex flex-col md:flex-row items-start md:items-center gap-1"
              >
                From :
              </label>

              <input
                id="from-date"
                type="date"
                className="px-4 py-2 rounded-lg border bg-[#A7E6FF] border-black"
                placeholder="Select Date"
              />
              <label
                htmlFor="to-date"
                className="text-sm font-medium flex flex-col md:flex-row items-start md:items-center gap-1"
              >
                To :
              </label>

              <input
                id="to-date"
                type="date"
                className="px-4 py-2 rounded-lg border bg-[#A7E6FF] border-black"
                placeholder="Select Date"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#A7E6FF] p-5 rounded-xl shadow-md">
            <h2 className="font-semibold text-xl mb-1">
              Users ({filteredUsers.length})
            </h2>
            <p className="text-sm mb-4">
              Manage user accounts and their access levels.
            </p>

            {/* Desktop table (hidden on small screens) */}
            <table className="hidden md:table w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-black/20">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Network</th>
                  <th className="pb-2">Attendance</th>
                  <th className="pb-2">Time & Date</th>
                </tr>
              </thead>

              <tbody className="space-y-4">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-black/20 text-sm">
                    <td className="py-2">{u.name}</td>
                    <td>{u.network}</td>

                    {/* Roles */}
                    <td>{u.attendance}</td>

                    <td>{u.timedate}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile stacked cards (visible on small screens) */}
            <div className="md:hidden space-y-3">
              {filteredUsers.map((u) => (
                <div key={u.id} className="p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm">{u.name}</div>
                      <div className="text-xs text-gray-600">{u.network}</div>
                    </div>

                    <div className="ml-3">
                      <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                        {u.attendance}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-sm">
                    <div className="text-gray-600">
                      Last Login: <span className="text-black">2025-01-15</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        aria-label={`Edit ${u.name}`}
                        className="text-green-900"
                      >
                        <HiOutlinePencilSquare size={26} />
                      </button>
                      <button
                        aria-label={`Link ${u.name}`}
                        className="text-green-900"
                      >
                        <FiKey size={26} />
                      </button>
                      <button
                        aria-label={`Delete ${u.name}`}
                        className="text-green-900"
                      >
                        <FaRegTrashAlt size={23} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {lifeGroupCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
          <BarLineChart
            title="LIFE GROUP MEMBERSHIP"
            data={lifeGroupDemographics}
            description="Detailed breakdown of member characteristics and trends."
          />
          <DoughnutChart
            title="LIFEGROUP MEMBERSHIP BY NETWORK"
            data={lifeGroupDemographics}
            description="Total members by age or network"
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {financeCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
          <BarLineChart
            title="TITHES AND OFFERINGS"
            data={tithesAndOfferings}
            description="Quarterly tithes and offerings trends per Quarter."
          />
          <BarLineChart
            title="EXPENSES"
            data={expenses}
            description="Church expenses breakdown per Quarter."
          />
          <div className="col-span-1 md:col-span-4 flex justify-center items-center">
            <BarLineChart
              title="OFFERINGS VS EXPENSES"
              data={offeringVsExpenses}
              description="Comparison of offerings and expenses."
            />
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {ministryCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <div className="font-secondary">
          <div className="card p-5 rounded-xl shadow-md space-y-3 col-span-4">
            <h2 className="font-semibold text-lg p-2">Saved Reports</h2>
            <p className="px-2 text-sm text-gray-600">
              You have no saved reports. Create and save reports for quick
              access.
            </p>
          </div>
        </div>
      </CustomTabPanel>
    </>
  );
};
