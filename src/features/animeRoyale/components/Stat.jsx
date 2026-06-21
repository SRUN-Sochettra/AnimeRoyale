export default function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border-2 border-brown-700 bg-cream p-3 shadow-eggsm">
      <dt className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-brown-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-lg font-black text-brown-700">
        {value}
      </dd>
    </div>
  )
}
