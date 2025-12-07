import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Hoodie from "../components/Hoodie";
import Tshirt from "../components/Tshirt";

import DesignAdjuster from "./DesignAdjuster";

import CrossLogo1 from "./CrossLogo1";
import CrossLogo2 from "./CrossLogo2";
import CrossLogo3 from "./CrossLogo3";
import CrossLogo4 from "./CrossLogo4";
import CrossLogo5 from "./CrossLogo5";
import CrossLogo6 from "./CrossLogo6";

import domtoimage from "dom-to-image";

// Map design names to React components
const designComponents = {
  "Design 1": CrossLogo1,
  "Design 2": CrossLogo2,
  "Design 3": CrossLogo3,
  "Design 4": CrossLogo4,
  "Design 5": CrossLogo5,
  "Design 6": CrossLogo6,
};

const dynamicBackground = (hex) => {
  if (!hex) return "#ffffff";
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  let num = parseInt(c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const amount = brightness < 128 ? 50 : -50;

  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));

  return `rgb(${r},${g},${b})`;
};

const ClothingPreview = ({ garment, color, selected, onSelect, selectedDesign }) => {
  const containerRef = useRef(null);

  const [sizePct, setSizePct] = useState(25);
  const [posPct, setPosPct] = useState({ x: 50, y: 25 });
  const [rotate, setRotate] = useState(0);
  const [isDesignSelected, setIsDesignSelected] = useState(false);
  const [containerRect, setContainerRect] = useState({ width: 0, height: 0 });
  const [selectedDesignProps, setSelectedDesignProps] = useState({
    primaryColor: "#ff0000",
    secondaryColor: "#00ff00",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);







  if (!garment) return null;

  const SVGComponent = garment.name === "hoodie" ? Hoodie : Tshirt;
  const SelectedDesignComponent = selectedDesign ? designComponents[selectedDesign] : null;

  // Track container size and mobile state
  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) setContainerRect(containerRef.current.getBoundingClientRect());
      setIsMobile(window.innerWidth <= 640);
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  const clamp = (v) => Math.min(Math.max(v, 0), 100);

  // Deselect design if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".draggable-design") && !e.target.closest(".design-controls")) {
        setIsDesignSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const nudge = (dir) => {
    const amount = 1;
    setPosPct((prev) => {
      let { x, y } = prev;
      if (dir === "up") y -= amount;
      if (dir === "down") y += amount;
      if (dir === "left") x -= amount;
      if (dir === "right") x += amount;
      return { x: clamp(x), y: clamp(y) };
    });
  };
  // Save to localStorage whenever garment changes
useEffect(() => {
  if (garment) {
    localStorage.setItem("selectedGarment", JSON.stringify(garment));
  }
}, [garment]);

  const getPixelPosition = () => ({
    left: (posPct.x / 100) * containerRect.width,
    top: (posPct.y / 100) * containerRect.height,
    width: (sizePct / 100) * containerRect.width,
  });

  const pixelPos = getPixelPosition();

  const saveImage = () => {
    if (!containerRef.current) return;
    domtoimage
      .toPng(containerRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${garment.name}-${selectedDesign || "design"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Failed to save image:", err));
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex justify-center items-center w-full h-full ${
        selected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-100" : ""
      }`}
      style={{ backgroundColor: dynamicBackground(color) }}
    >
      {/* Clothing */}
      <SVGComponent
        className="w-auto h-[400px] sm:h-[600px] md:h-[800px] lg:h-[1000px] max-w-full cursor-pointer"
        color={color}
        onClick={onSelect}
      />

      {/* Draggable Design Component */}
      {SelectedDesignComponent && containerRect.width > 0 && (
        <motion.div
          className="draggable-design"
          drag
          dragConstraints={containerRef}
          dragElastic={0.3}
          onClick={() => setIsDesignSelected(true)}
          whileDrag={{ cursor: "grabbing" }}
          style={{
            position: "absolute",
            left: pixelPos.left,
            top: pixelPos.top,
            width: pixelPos.width,
            transform: `rotate(${rotate}deg)`,
            transformOrigin: "center center",
            cursor: "grab",
          }}
          onDrag={(e, info) => {
            const rect = containerRef.current.getBoundingClientRect();
            const newX = clamp(((info.point.x - rect.left) / rect.width) * 100);
            const newY = clamp(((info.point.y - rect.top) / rect.height) * 100);
            setPosPct({ x: newX, y: newY });
          }}
        >
          {/* Wrapper for blue selection ring with padding for growth */}
          <div
            className={`relative w-full h-full ${
              isDesignSelected ? "ring-2 ring-blue-500 rounded-md" : ""
            }`}
            style={{ padding: isDesignSelected ? "4px" : "0" }}
          >
            <SelectedDesignComponent
              className="w-full h-full object-contain"
              {...selectedDesignProps}
            />
          </div>
        </motion.div>
      )}

      {/* Design Adjuster */}
      {isDesignSelected && (
        <div
          className={`design-controls ${
            isMobile
              ? "fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md"
              : "absolute bottom-6 right-6 w-[260px]"
          } p-4 rounded-2xl shadow-xl backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/20 z-50`}
        >
          <DesignAdjuster
            pos={posPct}
            size={sizePct}
            rotate={rotate}
            onChange={(data) => {
              if ("pos" in data) setPosPct(data.pos);
              if ("size" in data) setSizePct(data.size);
              if ("rotate" in data) setRotate(data.rotate);
            }}
            saveImage={saveImage}
            nudge={nudge}
            designProps={selectedDesignProps}
            onColorChange={setSelectedDesignProps}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
};

export default ClothingPreview;
