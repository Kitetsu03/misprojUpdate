import AdminNav from "../../components/AdminNav";
import { BlackButton } from "../../components/ui/buttons/BlackButton";
import Dropdown from "../../components/ui/buttons/Dropdown";
import SearchBar from "../../components/ui/input/SearchBar";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useState, useMemo, useEffect } from "react";
import CreateNewUser from "../../components/ui/buttons/CreateNewUser";
import ConfigureButton from "../../components/ui/buttons/ConfigureButton";
import ConfigurePermission from "../../components/ConfigurePermission";
import UpdateUserModal from "../../components/ui/modals/users/UpdateUserModal.jsx";
import DeleteUserModal from "../../components/ui/modals/users/DeleteUserModal.jsx";
import RoleUpdateModal from "../../components/ui/modals/users/UpdateRoleModal.jsx";
import { getUsers } from "../../services/userService.js";

function UserAccess() {
  const [roleFilter, setRoleFilter] = useState("");

  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedRoleUser, setSelectedRoleUser] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "gatekeeper":
        return "bg-yellow-500";
      case "member":
        return "bg-green-500";
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      const formatted = res.map((u) => ({
        id: u._id,
        name:
          [
            u.member_id?.first_name,
            u.member_id?.middle_name,
            u.member_id?.last_name,
          ]
            .filter(Boolean)
            .join(" ") || "N/A",
        email: u.email,
        role: u.role,
        lastLogin: u.lastLogin || "N/A",
        createdAt: u.createdAt
          ? new Date(u.createdAt).toLocaleString("en-PH", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "N/A",
        color: getRoleColor(u.role),
      }));
      setUsers(formatted);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUserToDelete(null);
  };

  const handleRoleUpdate = (user) => {
    if (!user) return;
    setSelectedRoleUser(user);
    setOpenRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
    setSelectedRoleUser(null);
  };

  const handleEdit = (user) => {
    if (!user) return;
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  // state
  const [sortOrder, setSortOrder] = useState("");

  // filtered + sorted users
  const filteredUsers = useMemo(() => {
    const q = (query || "").toLowerCase().trim();

    let filtered = users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();

      const matchesSearch = name.includes(q) || email.includes(q);

      const matchesRole = !roleFilter || role === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });

    // Sorting
    if (sortOrder === "az") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    if (sortOrder === "za") {
      filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    return filtered;
  }, [users, query, roleFilter, sortOrder]);

  return (
    <div className="min-h-dvh grid grid-cols-[auto_1fr]">
      <AdminNav />

      <main className="flex-1 p-6 space-y-6 font-secondary">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-5xl font-bold text-white">
              USER & ACCESS MANAGEMENT
            </h1>
            <p className="text-white/90 text-sm">
              Manage user accounts, roles, and permissions for your system.
            </p>
          </div>
          <BlackButton
            val="+ Add User"
            comp={<CreateNewUser onSuccess={fetchUsers} />}
            submitLabel="Create User"
            formId="create-user-form"
          />
        </div>

        {/* Search & Filter */}
        <div className="card p-5 rounded-xl shadow-md space-y-3">
          <h2 className="font-semibold text-lg">Search & Filter by Roles</h2>

          <div className="flex gap-2 flex-col md:flex-row">
            <SearchBar
              value={searchValue}
              onChange={(v) => setSearchValue(v)}
              onSearch={() => setQuery(searchValue)}
            />
            <Dropdown
              value={roleFilter}
              onChange={(value) => setRoleFilter(value)}
              placeholder="Filter by Role"
              options={[
                { label: "All Roles", value: "" },
                { label: "Admin", value: "admin" },
                { label: "Gatekeeper", value: "gatekeeper" },
                { label: "Member", value: "member" },
              ]}
            />

            <Dropdown
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
              placeholder="Sort by Name"
              options={[
                { label: "Default", value: "" },
                { label: "Name A-Z", value: "az" },
                { label: "Name Z-A", value: "za" },
              ]}
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
          {filteredUsers.length === 0 && (
            <div className="text-center py-6 text-gray-600">
              No users found.
            </div>
          )}
          {/* Desktop table (hidden on small screens) */}
          <table className="hidden md:table w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-black/20">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Last Login</th>
                <th className="pb-2">Created At</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>

            <tbody className="space-y-4">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-black/20 text-sm">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>

                  {/* Roles */}
                  <td>
                    <span
                      className={`${u.color} text-white text-xs px-3 py-1 rounded-full`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td>{u.lastLogin}</td>
                  <td>{u.createdAt}</td>

                  <td className="flex gap-2 py-3 ">
                    <button
                      aria-label={`Edit ${u.name}`}
                      className="text-green-900 hover:text-green-500"
                      onClick={() => handleEdit(u)}
                    >
                      <HiOutlinePencilSquare size={26} />
                    </button>
                    <button
                      aria-label={`Update role for ${u.name}`}
                      className="text-green-900 hover:text-yellow-500"
                      onClick={() => handleRoleUpdate(u)}
                    >
                      <FiKey size={26} />
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
            {filteredUsers.map((u) => (
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
                      {u.role}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-sm">
                  <div className="text-gray-600">
                    Last Login:{" "}
                    <span className="text-black">{u.lastLogin}</span>
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
                      aria-label={`Update role for ${u.name}`}
                      className="text-green-900 hover:text-yellow-500"
                      onClick={() => handleRoleUpdate(u)}
                    >
                      <FiKey size={26} />
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

          <UpdateUserModal
            open={openEditModal}
            onClose={handleCloseModal}
            userData={selectedUser}
            onSuccess={fetchUsers}
          />
          <RoleUpdateModal
            open={openRoleModal}
            onClose={handleCloseRoleModal}
            userData={selectedRoleUser}
            onSuccess={fetchUsers}
          />
          <DeleteUserModal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            userData={userToDelete}
            onSuccess={fetchUsers}
          />
        </div>

        {/* Role Definitions
        <div className="bg-[#A7E6FF] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Role Definitions</h2>
          <p className="text-gray-700 text-sm mb-6">
            Configure role permissions to access levels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Admin",
                desc: "Full System Access",
              },
              {
                title: "Gatekeeper",
                desc: "Financial and Sensitive Data Access",
              },
              {
                title: "Leader",
                desc: "LifeGroup and Ministry Leadership",
              },
              {
                title: "Volunteer",
                desc: "Basic Volunteer Access",
              },
              {
                title: "Member",
                desc: "Limited member portal access",
              },
            ].map((r) => (
              <div
                key={r.title}
                className="bg-[#82CDEB] p-5 rounded-xl border shadow-sm"
              >
                <h3 className="font-bold text-lg">{r.title}</h3>
                <p className="text-sm text-gray-700 mb-4">{r.desc}</p>

                <ConfigureButton
                  val="Configure Permmision"
                  exc="Save Changes"
                  comp={<ConfigurePermission />}
                />
              </div>
            ))}
          </div>
        </div> */}
      </main>
    </div>
  );
}

export default UserAccess;
