export default function UsernameInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoFocus = false
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-brown-600"
      >
        {label}
      </label>

      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-brown-300"
        >
          @
        </span>

        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value.trimStart())}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          className="input-egg w-full focus-egg"
        />
      </div>
    </div>
  );
}
