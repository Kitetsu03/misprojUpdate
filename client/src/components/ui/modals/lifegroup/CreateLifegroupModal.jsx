import { useState } from "react";

export default function CreateLifeGroupModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    lifegroup_name: "",
    type: "",
    gender_profile: "",
    address: "",
    contact_number: "",
    host_name: "",
    schedule: "",
    opened_date: "",
    barangay: "",
    district: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">Create Lifegroup</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            {/* LifeGroup Name */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Lifegroup Name
              </label>
              <input
                type="text"
                name="lifegroup_name"
                value={formData.lifegroup_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter LifeGroup name"
              />
            </div>
            {/* Type */}
            <div>
              <label className="mb-1 block text-sm font-medium">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="homogenous">Homogenous</option>
                <option value="heterogenous">Heterogenous</option>
              </select>
            </div>
            {/* Gender Profile */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Gender Profile
              </label>
              <select
                name="gender_profile"
                value={formData.gender_profile}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            {/* Contact Number */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Contact Number
              </label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="09XXXXXXXXX"
              />
            </div>
            {/* Host Name */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Host Name
              </label>
              <input
                type="text"
                name="host_name"
                value={formData.host_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter host name"
              />
            </div>
            {/* Schedule */}
            <div>
              <label className="mb-1 block text-sm font-medium">Schedule</label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Friday • 7:00 PM"
              />
            </div>
            {/* Opened Date */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Opened Date
              </label>
              <input
                type="date"
                name="opened_date"
                value={formData.opened_date}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Barangay */}
            <div>
              <label className="mb-1 block text-sm font-medium">Barangay</label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter barangay"
              />
            </div>
            {/* District */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Purok/Sitio
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Purok/Sitio"
              />
            </div>
            {/* Address */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full address"
              />
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            {" "}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-600"
            >
              Create Lifegroup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
