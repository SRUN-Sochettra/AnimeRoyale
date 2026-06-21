import { IconMagnifier } from "../../../components/Icons";
import { MODE_OPTIONS, PLATFORM_OPTIONS } from "../constants";
import ChoiceGroup from "./ChoiceGroup";
import UsernameInput from "./UsernameInput";

export default function AnimeRoyaleForm({ mode, platform, usernameOne, usernameTwo, loading, canSubmit, error, onModeChange, onPlatformChange, onUsernameOneChange, onUsernameTwoChange, onSubmit, onFillExamples }) {
  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-6">
      <fieldset disabled={loading} className="space-y-6">
        <legend className="sr-only">AnimeRoyale scan controls</legend>
        <ChoiceGroup label="Judgement type" options={MODE_OPTIONS} value={mode} onChange={onModeChange} name="mode" />
        <ChoiceGroup label="Anime platform" options={PLATFORM_OPTIONS} value={platform} onChange={onPlatformChange} name="platform" />
        <div className="space-y-3">
          <UsernameInput id="username-one" label={mode === "solo" ? "Username" : "Challenger one"} value={usernameOne} onChange={onUsernameOneChange} placeholder={platform === "anilist" ? "anilist-username" : "mal-username"} autoFocus />
          {mode === "battle" ? <UsernameInput id="username-two" label="Challenger two" value={usernameTwo} onChange={onUsernameTwoChange} placeholder={platform === "anilist" ? "rival-anilist" : "rival-mal"} /> : null}
        </div>
        {error ? <p className="rounded-2xl border-2 border-brown-700 bg-[#F8D5C8] px-4 py-3 text-sm font-bold text-brown-700">{error}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={!canSubmit} title={canSubmit ? "Start AnimeRoyale judgement" : "Enter the required username first"} className="btn-primary focus-egg flex flex-1 items-center justify-center gap-2">
            <IconMagnifier size={20} />
            {loading ? "Cracking…" : mode === "solo" ? "Inspect weeb" : "Start battle"}
          </button>
          <button type="button" onClick={onFillExamples} disabled={loading} className="btn-secondary focus-egg">Fill demo</button>
        </div>
      </fieldset>
    </form>
  );
}
