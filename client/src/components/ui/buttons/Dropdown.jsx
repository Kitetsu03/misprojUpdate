function Dropdown({ value, onChange, options = [], placeholder, color }) {
  return (
    <>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-4 py-2 rounded-lg border ${color} border-black font-secondary`}
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
