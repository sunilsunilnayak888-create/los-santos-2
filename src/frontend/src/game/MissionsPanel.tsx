import { MISSION_DEFS, useGameStore } from "./gameStore";

export default function MissionsPanel() {
  const {
    showMissions,
    toggleMissions,
    completedMissions,
    activeMissionId,
    setActiveMission,
    money,
  } = useGameStore();

  if (!showMissions) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 50, background: "rgba(0,0,0,0.7)" }}
      data-ocid="missions.modal"
    >
      <div
        className="rounded-lg p-6 w-[520px] max-h-[80vh] overflow-y-auto"
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
              MISSIONS
            </h2>
            <p className="font-ui text-xs text-gray-500 mt-0.5">
              ${money.toLocaleString()} total earned
            </p>
          </div>
          <button
            type="button"
            onClick={toggleMissions}
            className="text-gray-500 hover:text-white font-game text-lg"
            data-ocid="missions.close_button"
          >
            &#x2715;
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {MISSION_DEFS.map((mission, idx) => {
            const isCompleted = completedMissions.includes(mission.id);
            const isActive = activeMissionId === mission.id;
            return (
              <div
                key={mission.id}
                className="rounded p-4"
                style={{
                  background: isActive
                    ? "rgba(39,198,216,0.1)"
                    : isCompleted
                      ? "rgba(118,210,106,0.05)"
                      : "rgba(255,255,255,0.03)",
                  border: isActive
                    ? "1px solid rgba(39,198,216,0.5)"
                    : isCompleted
                      ? "1px solid rgba(118,210,106,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
                data-ocid={`missions.item.${idx + 1}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-game text-xs tracking-widest"
                    style={{
                      color: isCompleted
                        ? "#76d26a"
                        : isActive
                          ? "#2ecfe3"
                          : "#c7ced8",
                    }}
                  >
                    {isCompleted
                      ? "\u2713 "
                      : isActive
                        ? "\u25b6 "
                        : `0${idx + 1}. `}
                    {mission.name.toUpperCase()}
                  </span>
                  <span
                    className="ml-auto font-game text-xs"
                    style={{ color: "#ffb34d" }}
                  >
                    ${mission.reward.toLocaleString()}
                  </span>
                </div>
                <p className="font-ui text-xs text-gray-400 mb-2">
                  {mission.description}
                </p>
                <p
                  className="font-ui text-[11px]"
                  style={{ color: "#27c6d8", opacity: 0.8 }}
                >
                  &#9656; {mission.objective}
                </p>

                {!isCompleted && (
                  <div className="flex gap-2 mt-3">
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => setActiveMission(null)}
                        className="flex-1 py-1.5 rounded font-game text-xs tracking-wider text-gray-400 hover:text-white transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                        data-ocid={`missions.cancel_button.${idx + 1}`}
                      >
                        CANCEL MISSION
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveMission(mission.id)}
                        className="flex-1 py-1.5 rounded font-game text-xs tracking-wider hover:opacity-90 transition-opacity"
                        style={{
                          background:
                            "linear-gradient(135deg, #1a3a4a, #0a2030)",
                          border: "1px solid rgba(39,198,216,0.4)",
                          color: "#27c6d8",
                        }}
                        data-ocid={`missions.primary_button.${idx + 1}`}
                      >
                        START MISSION
                      </button>
                    )}
                  </div>
                )}
                {isCompleted && (
                  <div className="mt-2">
                    <span
                      className="font-game text-[10px] tracking-wider"
                      style={{ color: "#76d26a" }}
                    >
                      &#x2713; COMPLETED &mdash; +$
                      {mission.reward.toLocaleString()} EARNED
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="mt-5 pt-4"
          style={{ borderTop: "1px solid rgba(39,198,216,0.15)" }}
        >
          <p className="font-ui text-xs text-gray-600 text-center">
            {completedMissions.length}/{MISSION_DEFS.length} missions completed
          </p>
        </div>
      </div>
    </div>
  );
}
