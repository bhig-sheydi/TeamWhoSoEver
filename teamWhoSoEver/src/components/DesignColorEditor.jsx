import React, { useState } from "react";

export default function DesignColorEditor({ designProps, onChange }) {
  const [openGroups, setOpenGroups] = useState({
    "Design 1": false,
    "Design 2": false,
    "Design 3": false,
    "Design 4": false,
  });

  // OPEN ONE → CLOSE OTHERS
  const toggleGroup = (group) => {
    setOpenGroups((prev) => {
      const newState = {};
      Object.keys(prev).forEach((g) => {
        newState[g] = g === group ? !prev[group] : false;
      });
      return newState;
    });
  };

  const groups = {
"Design 1": [
  "crossLogoColor",
  "curveUnder1Color",
  "curveUnder2Color",
  "underLongColor",
  "man1Color",
  "man2Color",
  "man3Color",
  "man4Color",
  "wcolor",
  "scolor",
  "vcolor",
  "ecolor",
  "rcolor",
  "curveSmallOColor",
  // Gradient 1 (id1)
  "gradient1StartColor",
  "gradient1EndColor",
  // Gradient 2 (id2)
  "gradient2StartColor",
  "gradient2EndColor",
  // Gradient 3 (id3)
  "gradient3StartColor",
  "gradient3EndColor",
  // Gradient 4 (id4)
  "gradient4StartColor",
  "gradient4EndColor",
  // Gradient 5 (id5)
  "gradient5StartColor",
  "gradient5EndColor",
  // Gradient 6 (id6)
  "gradient6StartColor",
  "gradient6MidColor",
  "gradient6EndColor",
  // Gradient 7 (id7)
  "gradient7Stop1",
  "gradient7Stop2",
  "gradient7Stop3",
  "gradient7Stop4",
  // Gradient 8 (id8)
  "gradient8StartColor",
  "gradient8EndColor",
],
"Design 2": [
  "crossfill1",
  "crossfill2",
  "crossfill3",
  "crossfill4",
  "crossfill5",
  "crossfill6",
  "crossfill7",
  "crossfill8",
  "crossfill9",
  "crossfill10",
  "crossfill11",
  "crossfill12",
  "crossfill13",
  "crossfill14",
  "crossfill15",
  "crossfill16",
  "crossfill17",
  "crossfill18",
],

"Design 3": [
  "crossfill1A",
  "crossfill2A",
  "crossfill3A",
  "crossfill4A",
  "crossfill6A",
  "crossfill7A",
  "crossfill8A",
  "crossfill9A",
  "crossfill10A",
  "crossfill11A",
  "crossfill12A",
  "crossfill13A",
  "crossfill14A",
  "crossfill15A",
  "crossfill16A",
  "crossfill17A",
  "crossfill18A",
],
"Design 4": [
  "crossfill1b",
  "crossfill2b",
  "crossfill3b",
  "crossfill4b",
  "crossfill5b",
  "crossfill6b",
  "crossfill7b",
  "crossfill8b",
  "crossfill9b",
  "crossfill10b",
  "crossfill11b",
  "crossfill12b",
  "crossfill13b",
  "crossfill14b",
  "crossfill15b",
  "crossfill16b",
  "crossfill17b",
  "crossfill18b",
  "crossfill19b",
  "crossfill20b",
  "crossfill21b",
  "crossfill22b",
  "crossfill23b",
  "crossfill24b",
  "crossfill25b",
  "crossfill26b",
  "crossfill27b",
],

  };

  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/Color|Stop|gradient/gi, "")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div
      className="
        p-4 rounded-2xl shadow-lg 
        w-full max-w-[320px]
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-md
        text-gray-900 dark:text-gray-100
      "
    >
      <h2 className="text-lg font-bold mb-3 tracking-tight">
        Design Colors
      </h2>

      {/* Smooth slim scrollbar (kept exactly as requested) */}
      <div
        className="
          max-h-[360px] overflow-y-auto space-y-4 pr-2
          scrollbar-thin scrollbar-track-transparent
          scrollbar-thumb-gray-400/40 dark:scrollbar-thumb-gray-600/40
          hover:scrollbar-thumb-gray-400/60
        "
      >
        {Object.entries(groups).map(([groupName, keys]) => (
          <div
            key={groupName}
            className="rounded-xl border border-gray-300/40 dark:border-gray-700/40 p-2"
          >
            {/* Header */}
            <button
              onClick={() => toggleGroup(groupName)}
              className="
                w-full flex items-center justify-between 
                py-1.5 px-1
                font-semibold 
                text-gray-700 dark:text-gray-300
                hover:text-gray-900 dark:hover:text-white
                transition
              "
            >
              {groupName}
              <span className="text-sm opacity-70">
                {openGroups[groupName] ? "▼" : "▶"}
              </span>
            </button>

            {/* Content */}
            {openGroups[groupName] && (
              <div className="mt-2 space-y-2 pl-1">
                {keys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-1"
                  >
                    <label className="text-xs text-gray-700 dark:text-gray-300">
                      {formatLabel(key)}
                    </label>

                    <input
                      type="color"
                      className="
                        w-7 h-7 rounded
                        border border-gray-300 dark:border-gray-600 
                        shadow-sm
                        cursor-pointer
                      "
                      value={designProps[key]}
                      onChange={(e) =>
                        onChange({ ...designProps, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
