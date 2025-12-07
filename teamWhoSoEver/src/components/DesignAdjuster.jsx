import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DesignColorEditor from "./DesignColorEditor";

export default function DesignAdjuster({
  pos,
  size,
  rotate,
  onChange,
  saveImage,
  isMobile,
  nudge,
  designProps,
  onColorChange,
}) {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [showColorEditor, setShowColorEditor] = useState(false);

  const update = (field, value) => {
    onChange({
      pos,
      size,
      rotate,
      [field]: value,
    });
  };

  const Panel = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="design-controls p-4 rounded-2xl shadow-xl backdrop-blur-xl
                 bg-white/90 dark:bg-gray-900/90 border border-white/20
                 dark:border-gray-700/20 flex flex-col gap-4 z-50 w-60 relative"
    >
      {/* SIZE */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold opacity-70">Size</span>
        <input
          type="range"
          min="10"
          max="100"
          value={size}
          onChange={(e) => update("size", Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* ROTATION */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold opacity-70">Rotation</span>
        <input
          type="range"
          min="-180"
          max="180"
          value={rotate}
          onChange={(e) => update("rotate", Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* NUDGE BUTTONS */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => nudge("up")}
          className="p-1 px-3 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ▲
        </button>

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => nudge("left")}
            className="p-1 px-3 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ◀
          </button>

          <button
            onClick={() => nudge("right")}
            className="p-1 px-3 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ▶
          </button>
        </div>

        <button
          onClick={() => nudge("down")}
          className="p-1 px-3 mt-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ▼
        </button>
      </div>

      {/* BUTTON ROW */}
      <div className="flex items-center gap-2 mt-2 relative">
        <motion.div
          layout
          className="absolute bg-blue-300 dark:bg-blue-700 w-[2px] h-6 left-16 top-1/2 -translate-y-1/2"
        />

        <button
          onClick={() => setShowColorEditor((prev) => !prev)}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
        >
          Colors
        </button>

        {saveImage && (
          <button
            onClick={saveImage}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Save
          </button>
        )}
      </div>

      {/* FIXED-HEIGHT COLOR EDITOR DRAWER */}
      <AnimatePresence>
        {showColorEditor && designProps && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 180, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-y-auto mt-1 rounded-lg border border-gray-300 dark:border-gray-700 p-2 bg-white/80 dark:bg-gray-800/80"
          >
            <DesignColorEditor
              designProps={designProps}
              onChange={onColorChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // MOBILE
  if (isMobile) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        <button
          className="mobile-panel-toggle mb-2 w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center"
          onClick={() => setIsOpen((o) => !o)}
        >
          ⚙️
        </button>

        {isOpen && Panel}
      </div>
    );
  }

  // DESKTOP
  return (
    <div className="absolute bottom-3 right-7 -translate-x-1/2">
      {Panel}
    </div>
  );
}
