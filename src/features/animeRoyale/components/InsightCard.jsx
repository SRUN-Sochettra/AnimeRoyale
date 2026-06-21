export default function InsightCard({ title, icon, children }) {
  return (
    <article className="card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-brown-700 bg-butter shadow-eggsm">{icon}</div>
        <h3 className="font-display text-2xl font-black text-brown-700">{title}</h3>
      </div>
      {children}
    </article>
  );
}
