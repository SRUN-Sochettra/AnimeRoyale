import { IconBrokenEgg } from '../../../components/Icons'

export default function ErrorCard({ error }) {
  return (
    <div className="card mt-8 p-6 text-center" style={{ background: '#F8D5C8' }} role="alert">
      <div className="flex justify-center mb-2">
        <IconBrokenEgg size={56} />
      </div>
      <p className="text-brown-700 font-semibold">Oops — {error}</p>
      <p className="text-brown-500 text-sm mt-1">Double-check the username and try again.</p>
    </div>
  )
}
