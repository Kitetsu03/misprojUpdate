import { useState } from "react";

function BlackButton({ val, exc, comp }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        className="flex items-center gap-2 bg-[#A7E6FF] px-4 py-2 rounded-full border shadow hover:bg-tertiary hover:text-white font-secondary"
        onClick={handleClick}
      >
        {val}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleClose}
          />

          {/* modal */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
            {/* <UserAccess onClose={handleClose} /> */}

            {comp}

            <div className="mt-4 text-right">
              <div className="flex justify-end gap-4 mt-8">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button className="px-5 py-2 bg-black text-white rounded-lg">
                  {exc}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default BlackButton;
