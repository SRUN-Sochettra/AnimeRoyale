import EggLogo from '../../../components/EggLogo'

export default function Loader({ mode }) {
  return (
    <div className="card mt-8 p-7 text-center animate-pop">
      <div className="mb-4 flex justify-center">
        <EggLogo size={70} animated />
      </div>
      <p className="font-display text-2xl font-black text-brown-700">
        {mode === 'solo' ? 'Inspecting the weeb…' : 'Preparing the arena…'}
      </p>
      <p className="mt-2 text-sm font-semibold text-brown-400">
        Pulling stats, measuring yolk density, summoning the announcer.
      </p>
    </div>
  )
}
