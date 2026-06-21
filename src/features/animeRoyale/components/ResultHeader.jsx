export default function ResultHeader({ eyebrow, title, onCopy, copyStatus }) {
  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brown-400">{eyebrow}</p>
          <h2 className="font-display text-3xl font-black text-brown-700">{title}</h2>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <button type="button" onClick={onCopy} className="btn-secondary focus-egg">Copy result</button>
          {copyStatus ? <p className="text-xs font-bold text-brown-400">{copyStatus}</p> : null}
        </div>
      </div>
    </div>
  );
}
