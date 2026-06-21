import { IconBrokenEgg } from "../../../components/Icons";

export default function ErrorCard({ error }) {
  return (
    <section role="alert" className="card mt-8 animate-[pop_0.4s_ease-out] p-6 text-center" style={{ background: "#F8D5C8" }}>
      <div className="mb-2 flex justify-center"><IconBrokenEgg size={56} /></div>
      <p className="font-bold text-brown-700">Oops — {error}</p>
      <p className="mt-1 text-sm text-brown-500">Double-check the username, platform, and public profile settings.</p>
    </section>
  );
}
