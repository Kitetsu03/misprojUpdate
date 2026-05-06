import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";

function SearchBar({
  value: propValue,
  onChange,
  onSearch,
  placeholder = "Search by name or email...",
  className = "",
}) {
  const [value, setValue] = useState(propValue ?? "");

  useEffect(() => {
    if (propValue !== undefined && propValue !== value) setValue(propValue);
  }, [propValue, value]);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onSearch) onSearch(value);
    }
  };

  const handleClear = () => {
    setValue("");
    if (onChange) onChange("");
    if (onSearch) onSearch("");
  };

  return (
    <div
      className={`w-full flex-1 min-w-0 flex items-center gap-2 px-3 py-2 rounded-lg border border-black bg-white/5 ${className}`}
    >
      <CiSearch className="text-xl text-black" />
      <input
        aria-label={placeholder}
        className="w-full h-full bg-transparent border-none outline-none px-3 py-1"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {value ? (
        <button
          onClick={handleClear}
          className="text-black px-2 py-1 rounded hover:bg-white/10"
          aria-label="Clear search"
        >
          ✖
        </button>
      ) : null}
    </div>
  );
}

export default SearchBar;
