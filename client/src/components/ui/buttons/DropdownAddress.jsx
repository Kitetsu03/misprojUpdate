import { useState } from "react";

function DropdownAddress({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOption = options.find(
    (o) => o.value === value || o.label === value,
  );

  const selectedLabel = selectedOption?.label || value || "";

  return (
    <div className="w-full space-y-1">
      {label && <label className="font-medium">{label}</label>}

      <div className="relative">
        {/* Input */}
        <input
          type="text"
          value={open ? search : selectedLabel}
          onFocus={() => setOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* Dropdown */}
        {open && !disabled && (
          <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
            {filtered.length === 0 && (
              <div className="p-2 text-gray-500">No results</div>
            )}

            {filtered.map((opt) => (
              <div
                key={opt.value}
                onMouseDown={() => {
                  onChange(opt.value);
                  setSearch("");
                  setOpen(false);
                }}
                className="p-2 hover:bg-indigo-100 cursor-pointer"
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DropdownAddress;
