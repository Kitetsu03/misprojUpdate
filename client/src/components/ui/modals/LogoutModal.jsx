import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await API.post("/auth/logout", {}, { withCredentials: true });

    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                No
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
