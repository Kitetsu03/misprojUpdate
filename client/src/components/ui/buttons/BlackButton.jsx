import { useState } from "react";

export function BlackButton({
  val,
  comp,
  icon,
  submitLabel = "Submit",
  formId = "",
  loading = false,
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => {
    if (!loading) setOpen(false); // Prevent closing while submitting
  };

  return (
    <>
      {/* Open Modal Button */}
      <button
        type="button"
        className="bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 font-secondary"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          {icon} {val}
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            {comp}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`px-4 py-2 rounded font-secondary ${
                  loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                form={formId}
                disabled={loading}
                className={`px-5 py-2 rounded-lg font-secondary text-white flex items-center justify-center gap-2 min-w-[140px] ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  submitLabel
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
