export default function ChoiceGroup({ label, options, value, onChange, name }) {
  return (
    <div>
      <p className="mb-2 text-sm font-black text-brown-600">
        {label}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const active = value === option.id;
          const screenReaderLabel = active
            ? "Selected " + name + ": " + option.label
            : "Select " + name + ": " + option.label;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={[
                "focus-egg rounded-2xl border-2 border-brown-700 p-4 text-left shadow-eggsm transition",
                active
                  ? "bg-yolk text-brown-700"
                  : "bg-white/50 text-brown-600 hover:bg-butter"
              ].join(" ")}
            >
              <span className="block font-display text-xl font-black">
                {option.label}
              </span>

              <span
                className={[
                  "mt-1 block text-sm font-semibold",
                  active ? "text-brown-700" : "text-brown-500"
                ].join(" ")}
              >
                {option.helper}
              </span>

              <span className="sr-only">{screenReaderLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
