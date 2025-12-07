import React from "react";
import { motion } from "framer-motion";

import CrossLogo1 from "./CrossLogo1";
import CrossLogo2 from "./CrossLogo2";
import CrossLogo3 from "./CrossLogo3";
import CrossLogo4 from "./CrossLogo4";
import CrossLogo5 from "./CrossLogo5";
import CrossLogo6 from "./CrossLogo6";

export default function DesignSelector({
  designs = [],
  selectedDesign,
  onSelect,
}) {
  const designComponents = {
    "Design 1": CrossLogo1,
    "Design 2": CrossLogo2,
    "Design 3": CrossLogo3,
    "Design 4": CrossLogo4,
    "Design 5": CrossLogo5,
    "Design 6": CrossLogo6,
  };

  return (
    <div className="flex md:flex-col flex-row md:w-36 w-full border rounded-xl border-gray-300 dark:border-gray-600 p-3 gap-3 overflow-x-auto md:overflow-y-auto">
      {designs.map((design) => {
        const isSelected = selectedDesign === design;
        const SVGComponent = designComponents[design];

        return (
          <motion.div
            key={design}
            whileHover={{ scale: 1.08 }}
            animate={
              isSelected
                ? { boxShadow: ["0 0 10px #3b82f6", "0 0 18px #3b82f6"] }
                : { boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }
            }
            transition={{
              duration: isSelected ? 0.8 : 0.3,
              repeat: isSelected ? Infinity : 0,
              repeatType: "reverse",
            }}
            onClick={() => onSelect(design)}
            className={`min-w-[100px] md:min-w-full h-32 flex items-center justify-center 
              rounded-xl cursor-pointer overflow-hidden p-2
              ${
                isSelected
                  ? "border-2 border-blue-500"
                  : "border border-gray-300 dark:border-gray-600"
              }
              bg-white dark:bg-gray-700`}
          >
            {SVGComponent && (
              <SVGComponent className="w-full h-full object-contain" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
