import React, { useRef, useEffect, useState } from "react";
import Hoodie from "../components/Hoodie";
import Tshirt from "../components/Tshirt";

// Use JSX design components instead of SVG images
import CrossLogo1 from "./CrossLogo1";
import CrossLogo2 from "./CrossLogo2";
import CrossLogo3 from "./CrossLogo3";
import CrossLogo4 from "./CrossLogo4";
import CrossLogo5 from "./CrossLogo5";
import CrossLogo6 from "./CrossLogo6";

const designComponents = {
  "Design 1": CrossLogo1,
  "Design 2": CrossLogo2,
  "Design 3": CrossLogo3,
  "Design 4": CrossLogo4,
  "Design 5": CrossLogo5,
  "Design 6": CrossLogo6,
};

const OrderDesignPreview = ({ designSpec }) => {
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState({ width: 0, height: 0 });

  const {
    garment,
    color,
    selectedDesign,
    pos = { x: 50, y: 25 },
    size = 25,
    rotate = 0,
    customerName = "Customer",
    deviceType = "unknown",
  } = designSpec || {};

  if (!garment) return null;

  const GarmentComponent = garment === "hoodie" ? Hoodie : Tshirt;
  const DesignComponent = selectedDesign ? designComponents[selectedDesign] : null;

  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  const getPixelPosition = () => ({
    left: (pos.x / 100) * containerRect.width,
    top: (pos.y / 100) * containerRect.height,
    width: (size / 100) * containerRect.width,
  });

  const pixelPos = getPixelPosition();

  return (
    <div ref={containerRef} className="relative flex justify-center items-center w-full h-full">
      {/* Customer Info */}
      <div className="absolute top-2 left-2 text-xs bg-white/80 dark:bg-gray-900/80 p-1 rounded-md z-50 shadow-sm">
        <div><strong>Customer:</strong> {customerName}</div>
        <div><strong>Device:</strong> {deviceType}</div>
      </div>

      {/* Garment */}
      <GarmentComponent
        className="w-auto h-[400px] sm:h-[600px] md:h-[800px] lg:h-[1000px] max-w-full cursor-default"
        color={color}
      />

      {/* Design */}
      {DesignComponent && containerRect.width > 0 && (
        <div
          style={{
            position: "absolute",
            left: pixelPos.left,
            top: pixelPos.top,
            width: pixelPos.width,
            transform: `rotate(${rotate}deg)`,
            transformOrigin: "center center",
          }}
        >
          <DesignComponent />
        </div>
      )}
    </div>
  );
};

export default OrderDesignPreview;
