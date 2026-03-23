import { useGameStore } from "./gameStore";

const SKIN_TONES = [
  { label: "Fair", color: "#f5deb3" },
  { label: "Light", color: "#e6b89c" },
  { label: "Medium", color: "#c68642" },
  { label: "Tan", color: "#8d5524" },
  { label: "Dark", color: "#4a3728" },
];

const HAIR_STYLES = [
  { id: "sleek", label: "Sleek Back", icon: "\u{1F488}" },
  { id: "fade", label: "Short Fade", icon: "\u2702\uFE0F" },
  { id: "wavy", label: "Wavy", icon: "\u3030" },
  { id: "curly", label: "Curly", icon: "\u{1F300}" },
];

const OUTFITS = [
  {
    id: "street",
    label: "Street",
    color: "#2c3e50",
    desc: "Casual streetwear",
  },
  {
    id: "business",
    label: "Business",
    color: "#1a1a4e",
    desc: "Sharp suit & tie",
  },
  {
    id: "criminal",
    label: "Criminal",
    color: "#1a1a1a",
    desc: "All black tactical",
  },
  {
    id: "sports",
    label: "Sports",
    color: "#1a3a1a",
    desc: "Athletic tracksuit",
  },
  {
    id: "luxury",
    label: "Luxury \u2605",
    color: "#1a1a3a",
    desc: "Gold-accented designer",
  },
];

export default function CustomizationPanel() {
  const {
    showCustomization,
    toggleCustomization,
    customization,
    updateCustomization,
    rank,
  } = useGameStore();

  if (!showCustomization) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 50, background: "rgba(0,0,0,0.75)" }}
      data-ocid="customize.modal"
    >
      <div
        className="rounded-lg p-6 w-[480px] max-h-[85vh] overflow-y-auto"
        style={{
          background: "#0d1420",
          border: "1px solid rgba(39,198,216,0.4)",
          boxShadow: "0 0 40px rgba(39,198,216,0.15)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2
              className="font-game text-xl tracking-widest"
              style={{ color: "#2ecfe3" }}
            >
              CHARACTER
            </h2>
            <p className="font-game text-xs" style={{ color: "#ffb34d" }}>
              SUNIL
            </p>
          </div>
          <button
            type="button"
            onClick={toggleCustomization}
            className="text-gray-500 hover:text-white font-game text-lg"
            data-ocid="customize.close_button"
          >
            &#x2715;
          </button>
        </div>

        {/* Character Preview */}
        <div
          className="rounded-lg p-4 mb-5 flex items-center justify-center"
          style={{
            background: "#080e18",
            border: "1px solid rgba(255,255,255,0.05)",
            height: 100,
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{
                background:
                  SKIN_TONES[customization.skinTone]?.color ?? "#c68642",
              }}
            >
              &#x1F60E;
            </div>
            <div
              className="font-game text-[9px] tracking-widest mt-1"
              style={{ color: "#27c6d8" }}
            >
              SUNIL &bull; RANK {rank}
            </div>
          </div>
        </div>

        {/* Skin Tone */}
        <div className="mb-5">
          <h3 className="font-game text-[11px] tracking-widest text-gray-400 mb-2">
            SKIN TONE
          </h3>
          <div className="flex gap-2" data-ocid="customize.panel">
            {SKIN_TONES.map((st, i) => (
              <button
                key={st.label}
                type="button"
                onClick={() => updateCustomization({ skinTone: i })}
                className="flex flex-col items-center gap-1 p-2 rounded transition-all"
                style={{
                  border:
                    customization.skinTone === i
                      ? "2px solid #27c6d8"
                      : "2px solid transparent",
                  background:
                    customization.skinTone === i
                      ? "rgba(39,198,216,0.1)"
                      : "rgba(255,255,255,0.03)",
                }}
                data-ocid={`customize.toggle.${i + 1}`}
              >
                <div
                  className="w-7 h-7 rounded-full"
                  style={{ background: st.color }}
                />
                <span className="text-[9px] font-ui text-gray-500">
                  {st.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hair Style */}
        <div className="mb-5">
          <h3 className="font-game text-[11px] tracking-widest text-gray-400 mb-2">
            HAIR STYLE
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {HAIR_STYLES.map((hs, i) => (
              <button
                key={hs.id}
                type="button"
                onClick={() => updateCustomization({ hairStyle: i })}
                className="p-3 rounded text-center transition-all"
                style={{
                  border:
                    customization.hairStyle === i
                      ? "2px solid #27c6d8"
                      : "2px solid rgba(255,255,255,0.08)",
                  background:
                    customization.hairStyle === i
                      ? "rgba(39,198,216,0.1)"
                      : "rgba(255,255,255,0.03)",
                }}
                data-ocid={`customize.toggle.${i + 10}`}
              >
                <div className="text-xl mb-1">{hs.icon}</div>
                <span className="font-ui text-[9px] text-gray-400">
                  {hs.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Outfit */}
        <div className="mb-5">
          <h3 className="font-game text-[11px] tracking-widest text-gray-400 mb-2">
            OUTFIT
          </h3>
          <div className="flex flex-col gap-2">
            {OUTFITS.map((outfit, i) => (
              <button
                key={outfit.id}
                type="button"
                onClick={() => updateCustomization({ outfit: i })}
                className="flex items-center gap-3 p-3 rounded text-left transition-all"
                style={{
                  border:
                    customization.outfit === i
                      ? "2px solid #27c6d8"
                      : "2px solid rgba(255,255,255,0.08)",
                  background:
                    customization.outfit === i
                      ? "rgba(39,198,216,0.08)"
                      : "rgba(255,255,255,0.03)",
                }}
                data-ocid={`customize.toggle.${i + 20}`}
              >
                <div
                  className="w-8 h-8 rounded"
                  style={{
                    background: outfit.color,
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
                <div>
                  <div
                    className="font-game text-xs tracking-wider"
                    style={{
                      color: customization.outfit === i ? "#27c6d8" : "#c7ced8",
                    }}
                  >
                    {outfit.label}
                  </div>
                  <div className="font-ui text-[10px] text-gray-500">
                    {outfit.desc}
                  </div>
                </div>
                {customization.outfit === i && (
                  <span
                    className="ml-auto font-game text-[10px]"
                    style={{ color: "#27c6d8" }}
                  >
                    &#x2713; ACTIVE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={toggleCustomization}
          className="w-full py-2.5 rounded font-game text-xs tracking-widest hover:opacity-90 transition-opacity"
          style={{
            background: "linear-gradient(135deg, #1a3a4a, #0a2030)",
            border: "1px solid rgba(39,198,216,0.4)",
            color: "#27c6d8",
          }}
          data-ocid="customize.save_button"
        >
          CONFIRM &amp; CLOSE
        </button>
      </div>
    </div>
  );
}
