function Dropdown({ value, onChange, options = [], placeholder }) {
  return (
    <>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 rounded-lg border bg-[#A7E6FF] border-black font-secondary"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  );
}
export default Dropdown;
