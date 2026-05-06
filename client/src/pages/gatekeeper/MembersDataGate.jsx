import Papa from "papaparse";
import * as XLSX from "xlsx";
import { importMembers } from "../../services/memberService.js";
import GatekeeperNav from "../../components/GatekeeperNav.jsx";
import Card from "../../components/ui/Card.jsx";
import { ImStack } from "react-icons/im";
import { BsWindowSidebar } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import SearchBar from "../../components/ui/input/SearchBar.jsx";
import Dropdown from "../../components/ui/buttons/Dropdown.jsx";
import { SlPeople } from "react-icons/sl";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useState, useMemo, useEffect } from "react";
import { BlackButton } from "../../components/ui/buttons/BlackButton.jsx";
import { AddNewMember } from "../../components/ui/buttons/AddNewMember.jsx";
import { getMembers } from "../../services/memberService.js";
import DeleteMemberModal from "../../components/ui/modals/members/DeleteMemberModal.jsx";
import UpdateMemberModal from "../../components/ui/modals/members/UpdateMemberModal.jsx";

function MembersData() {
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [members, setMembers] = useState([]);
  const [error, setError] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUserToDelete(null);
  };

  //Import Logic
  const handleCSVImport = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await processImportedData(results.data);
      },
    });
  };

  const handleExcelImport = (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      await processImportedData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const processImportedData = async (rows) => {
    try {
      const formattedMembers = rows.map((row) => ({
        first_name: row.first_name || "",
        middle_name: row.middle_name || "",
        last_name: row.last_name || "",
        email: row.email || "",
        contact_no: row.contact_no || "",
        status: (row.status || "active").toLowerCase(),
        category: row.category || "Category 1",
        attendance: Number(row.attendance) || 0,
        last_visit: row.last_visit || null,
      }));

      await importMembers(formattedMembers);
      fetchMembers();
      alert("Import successful!");
    } catch (err) {
      console.error(err);
      alert("Import failed.");
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      handleCSVImport(file);
    } else {
      handleExcelImport(file);
    }
  };

  const handleEdit = (user) => {
    if (!user?.raw) return;
    console.log("EDIT USER:", user);
    console.log("CLICKED EDIT", user);

    const { member, member_id, user: userInfo, user_id } = user.raw;

    const formattedData = {
      user_id,
      member_id: member_id || null,
      email: userInfo?.email || "",

      // member fields if exists

      first_name: member?.first_name || "",
      middle_name: member?.middle_name || "",
      last_name: member?.last_name || "",
      suffix: member?.suffix || "",

      birth_date: member?.birth_date || "",
      marital_status: member?.marital_status || "",
      sex: member?.sex || "",

      contact_no: member?.contact_no || "",

      // address for form
      region: member?.address?.region || "",
      province: member?.address?.province || "",
      city: member?.address?.city || "",
      barangay: member?.address?.barangay || "",
    };

    setSelectedUser(formattedData);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  const getRoleColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-yellow-500";
      case "visitor":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery(searchValue);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchValue]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const mapMemberToRow = (u) => {
    const member = u.member;
    const user = u.user;

    const fullName = member
      ? [member.first_name, member.middle_name, member.last_name]
          .filter(Boolean)
          .join(" ")
      : "Incomplete Profile";

    const status = (member?.status || "incomplete").toLowerCase();

    return {
      id: member?._id || u.user_id,
      raw: u,

      name: fullName,
      role: user?.role || "N/A",
      contact: member?.contact_no || "N/A",
      email: user?.email || "N/A",

      status,
      category: u.category || "N/A",
      attendance: u.attendance ?? 0,
      lastVisit: u.lastLogin || "N/A",

      color: getRoleColor(status),
    };
  };

  const fetchMembers = async () => {
    try {
      setError(null);

      const res = await getMembers();
      console.log("MEMBERS FROM API:", res);

      const formatted = res.map(mapMemberToRow);

      setMembers(formatted);
    } catch (err) {
      console.error("Fetch members error:", err);
      setError("Failed to fetch members");
    }
  };

  const infos = [
    {
      id: 1,
      title: "CATEGORY 1",
      icon: <SlPeople size={36} />,
      info: "Total Members",
      value: 150,
      desc: "+ 6 from last month",
    },
    {
      id: 2,
      title: "CATEGORY 2",
      icon: <ImStack size={36} />,
      info: "Worship Attending Members",
      value: 90,
      desc: "+ 3 from last month",
    },
    {
      id: 3,
      title: "TITHES & OFFERINGS",
      icon: <BsWindowSidebar size={36} />,
      info: "Total Tithes & Offerings This Month",
      value: "₱10K",
      desc: "+ 8.2% from last month",
    },
    {
      id: 4,
      title: "ACTIVE LIFEGROUPS",
      icon: <FaRegHeart size={36} />,
      info: "Current Active Lifegroups",
      value: 4,
      desc: "+ 1 new group this month",
    },
  ];

  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    const q = query.toLowerCase();

    filtered = filtered.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);

      const matchesStatus = !statusFilter || u.status === statusFilter;
      const matchesCategory =
        !categoryFilter ||
        u.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // SORTING
    if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [members, query, statusFilter, categoryFilter, sortBy]);

  const downloadCSVTemplate = () => {
    const headers = [
      "first_name",
      "middle_name",
      "last_name",
      "suffix",
      "birth_date",
      "marital_status",
      "sex",
      "contact_no",
      "email",
      "province",
      "city",
      "barangay",
      "region",
      "status",
      "is_enabled",
    ];

    const sample = [
      "John",
      "A",
      "Doe",
      "Jr",
      "1995-06-15",
      "single",
      "male",
      "09123456789",
      "john@example.com",
      "Laguna",
      "San Pablo",
      "Barangay 1",
      "Region IV-A",
      "active",
      "true",
    ];

    const csv = [headers, sample].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "members_template.csv";
    a.click();
  };

  const downloadExcelTemplate = () => {
    const data = [
      {
        first_name: "John",
        middle_name: "A",
        last_name: "Doe",
        suffix: "Jr",
        birth_date: "1995-06-15",
        marital_status: "single",
        sex: "male",
        contact_no: "09123456789",
        email: "john@example.com",
        province: "Laguna",
        city: "San Pablo",
        barangay: "Barangay 1",
        region: "Region IV-A",
        status: "active",
        is_enabled: true,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    XLSX.writeFile(workbook, "members_template.xlsx");
  };

  return (
    <>
      <div className="min-h-dvh grid grid-cols-[auto_1fr]">
        <GatekeeperNav />
        <div className="p-4 md:p-5 font-secondary">
          <header className="mb-6 text-2xl md:text-5xl text-white">
            <h1 className="text-2xl md:text-5xl font-extrabold">
              MEMBERS DATA
            </h1>
            <p className="text-sm text-muted-foreground">
              Overview & statistics
            </p>
          </header>
          <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
            {infos.map((info) => (
              <Card
                key={info.id}
                title={info.title}
                icon={info.icon}
                info={info.info}
                value={info.value}
                desc={info.desc}
              />
            ))}
            <div className="card p-5 rounded-xl shadow-md space-y-3 col-span-4">
              <div className="flex gap-2 ">
                <h2 className="font-semibold text-lg p-2">Search & Filter</h2>
                <div className="flex flex-1 gap-2 justify-end">
                  <p className="text-sm text-muted-foreground self-center">
                    Use the template to avoid import errors.
                  </p>
                  <button
                    onClick={downloadCSVTemplate}
                    className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 font-secondary"
                  >
                    CSV Template
                  </button>

                  <button
                    onClick={downloadExcelTemplate}
                    className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 font-secondary"
                  >
                    Excel Template
                  </button>

                  <button
                    className="bg-black text-white px-5 py-2 rounded-lg"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    Import
                  </button>

                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileImport}
                    className="hidden"
                    id="file-upload"
                  />

                  <BlackButton val="Export" exc="Export Members" />
                  <BlackButton
                    val="+ Add Member"
                    comp={
                      <AddNewMember
                        onSuccess={fetchMembers}
                        setSubmitting={setSubmitting}
                      />
                    }
                    submitLabel="Add Member"
                    formId="add-member-form"
                    loading={submitting}
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-col md:flex-row">
                <SearchBar
                  value={searchValue}
                  onChange={(v) => setSearchValue(v)}
                  onSearch={() => setQuery(searchValue)}
                />
                <div className="md:flex-row md:gap-2 flex md:justify-end">
                  <Dropdown
                    value={statusFilter}
                    placeholder="Filter by status"
                    onChange={(value) => setStatusFilter(value)}
                    options={[
                      { label: "All Status", value: "" },
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                      { label: "Visitor", value: "visitor" },
                    ]}
                  />

                  <Dropdown
                    value={categoryFilter}
                    placeholder="Filter by category"
                    onChange={(value) => setCategoryFilter(value)}
                    options={[
                      { label: "All Categories", value: "" },
                      { label: "Category 1", value: "Category 1" },
                      { label: "Category 2", value: "Category 2" },
                      { label: "Category 3", value: "Category 3" },
                    ]}
                  />
                  <Dropdown
                    value={sortBy}
                    placeholder="Sort by name"
                    onChange={(value) => setSortBy(value)}
                    options={[
                      { label: "Default", value: "" },
                      { label: "Name A-Z", value: "name-asc" },
                      { label: "Name Z-A", value: "name-desc" },
                    ]}
                  />
                </div>
              </div>
            </div>
            {/* Users Table */}
            <div className="bg-[#A7E6FF] p-5 rounded-xl shadow-md w-full col-span-4">
              <h2 className="font-semibold text-xl mb-1">
                Members ({filteredMembers.length})
              </h2>
              <p className="text-sm mb-4">
                Complete member database with attendance and engagement
                tracking.
              </p>
              {filteredMembers.length === 0 && (
                <div className="text-center py-6 text-gray-600">
                  No users found.
                </div>
              )}
              {/* Desktop table (hidden on small screens) */}
              <table className="hidden md:table w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-black/20">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Contact</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Attendance</th>
                    <th className="pb-2">Last Visit</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>

                <tbody className="space-y-4">
                  {filteredMembers.map((u) => (
                    <tr key={u.id} className="border-b border-black/20 text-sm">
                      <td className="py-2">{u.name}</td>
                      <td>{u.contact}</td>
                      <td>{u.email}</td>
                      <td>{u.status}</td>

                      {/* status */}
                      <td>
                        <span
                          className={`${u.color} text-white text-xs px-3 py-1 rounded-full`}
                        >
                          {u.category}
                        </span>
                      </td>

                      <td>{u.attendance}%</td>
                      <td>{u.lastVisit}</td>

                      <td className="flex gap-2 py-3">
                        <button
                          aria-label={`Edit ${u.name}`}
                          className="text-green-900 hover:text-green-500"
                          onClick={() => handleEdit(u)}
                        >
                          <HiOutlinePencilSquare size={26} />
                        </button>

                        <button
                          aria-label={`Delete ${u.name}`}
                          className="text-green-900 hover:text-red-600"
                          onClick={() => handleDeleteClick(u)}
                        >
                          <FaRegTrashAlt size={23} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile stacked cards (visible on small screens) */}
              <div className="md:hidden space-y-3">
                {filteredMembers.map((u) => (
                  <div key={u.id} className=" p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-sm">{u.name}</div>
                        <div className="text-xs text-gray-600">{u.email}</div>
                      </div>

                      <div className="ml-3">
                        <span
                          className={`${u.color} text-white text-xs px-3 py-1 rounded-full`}
                        >
                          {u.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-sm">
                      <div className="text-gray-600">
                        Last Login:{" "}
                        <span className="text-black">2025-01-15</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          aria-label={`Edit ${u.name}`}
                          className="text-green-900 hover:text-green-500"
                          onClick={() => handleEdit(u)}
                        >
                          <HiOutlinePencilSquare size={26} />
                        </button>

                        <button
                          aria-label={`Delete ${u.name}`}
                          className="text-green-900 hover:text-red-600"
                          onClick={() => handleDeleteClick(u)}
                        >
                          <FaRegTrashAlt size={23} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <UpdateMemberModal
              open={openEditModal}
              onClose={handleCloseModal}
              userData={selectedUser}
              onSuccess={fetchMembers}
            />
            <DeleteMemberModal
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              userData={userToDelete}
              onSuccess={fetchMembers}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default MembersData;
