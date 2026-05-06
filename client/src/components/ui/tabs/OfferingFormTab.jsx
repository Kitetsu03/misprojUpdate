import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SearchBar from "../input/SearchBar.jsx";
import { BlackButton } from "../buttons/BlackButton.jsx";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useState, useMemo } from "react";

export const FinanceTab = () => {
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");

  const users = useMemo(
    () => [
      {
        id: 1,
        name: "John Smith",
        network: "Men",
        tithes: "50",
        offering: "20",
        mission: "10",
        pledge: "100",
        timedate: "2025-01-15",
        refno: "001",
        cost: "Electricity",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        network: "YAN",
        tithes: "30",
        offering: "15",
        mission: "5",
        pledge: "75",
        timedate: "2025-01-14",
        refno: "002",
        cost: "Water",
      },
      {
        id: 3,
        name: "Mike Peters",
        network: "KKB",
        tithes: "25",
        offering: "10",
        mission: "8",
        pledge: "60",
        timedate: "2025-01-13",
        refno: "003",
        cost: "Internet",
      },
      {
        id: 4,
        name: "Lisa Chen",
        network: "Women",
        tithes: "40",
        offering: "25",
        mission: "15",
        pledge: "80",
        timedate: "2025-01-12",
        refno: "004",
        cost: "Supplies",
      },
    ],
    [],
  );

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, query]);

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
      <div className="card w-full rounded-2xl">
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Offerings" {...a11yProps(0)} />
            <Tab label="Expenses" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </div>
      <CustomTabPanel value={value} index={0}>
        <main className="flex-1 p-1 space-y-5 font-secondary">
          {/* Search & Filter */}
          <div className="card p-5 rounded-xl shadow-md space-y-3">
            <h2 className="font-semibold text-lg">Search & Filter</h2>
            <div className="flex gap-2 flex-col md:flex-row">
              <SearchBar
                value={searchValue}
                onChange={(v) => setSearchValue(v)}
                onSearch={() => setQuery(searchValue)}
              />

              <select className="px-4 py-2 rounded-lg border bg-[#A7E6FF] border-black">
                <option>Network</option>
                <option>Men</option>
                <option>Women</option>
                <option>KKB</option>
                <option>YAN</option>
                <option>Children</option>
              </select>
              <input
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
                  <th className="pb-2">Tithes</th>
                  <th className="pb-2">Offering</th>
                  <th className="pb-2">Mission</th>
                  <th className="pb-2">Pledge</th>
                  <th className="pb-2">Time & Date</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>

              <tbody className="space-y-4">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-black/20 text-sm">
                    <td className="py-2">{u.name}</td>
                    <td>{u.network}</td>

                    {/* Roles */}
                    <td>{u.tithes}</td>

                    <td>{u.offering}</td>
                    <td>{u.mission}</td>
                    <td>{u.pledge}</td>
                    <td>{u.timedate}</td>
                    <td className="flex gap-2 py-3">
                      <button
                        aria-label={`Edit ${u.name}`}
                        className="text-green-900"
                      >
                        <HiOutlinePencilSquare size={26} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile stacked cards (visible on small screens) */}
            <div className="md:hidden space-y-3">
              {filteredUsers.map((u) => (
                <div key={u.email} className=" p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm">{u.name}</div>
                      <div className="text-xs text-gray-600">{u.email}</div>
                    </div>

                    <div className="ml-3">
                      <span
                        className={`${u.color} text-white text-xs px-3 py-1 rounded-full`}
                      >
                        {u.role}
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
      <CustomTabPanel value={value} index={1}>
        <main className="flex-1 p-1 space-y-5 font-secondary">
          {/* Search & Filter */}
          <div className="card p-5 rounded-xl shadow-md space-y-3">
            <h2 className="font-semibold text-lg">Search & Filter</h2>
            <div className="flex gap-2 flex-col md:flex-row">
              <SearchBar
                value={searchValue}
                onChange={(v) => setSearchValue(v)}
                onSearch={() => setQuery(searchValue)}
              />

              <select className="px-4 py-2 rounded-lg border bg-[#A7E6FF] border-black">
                <option>Network</option>
                <option>Men</option>
                <option>Women</option>
                <option>KKB</option>
                <option>YAN</option>
                <option>Children</option>
              </select>
              <input
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
                  <th className="pb-2">Ref.no</th>
                  <th className="pb-2">Name of cost</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Time & Date</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>

              <tbody className="space-y-4">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-black/20 text-sm">
                    <td className="py-2">{u.refno}</td>
                    <td>{u.cost}</td>

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
                <div key={u.email} className=" p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm">{u.name}</div>
                      <div className="text-xs text-gray-600">{u.email}</div>
                    </div>

                    <div className="ml-3">
                      <span
                        className={`${u.color} text-white text-xs px-3 py-1 rounded-full`}
                      >
                        {u.role}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CustomTabPanel>
    </>
  );
};
