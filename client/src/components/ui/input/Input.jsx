export function Input({
  disabled,
  name,
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  rightElement,
  autoComplete,
}) {
  return (
    <div className="space-y-2">
      <label className="font-medium" htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
