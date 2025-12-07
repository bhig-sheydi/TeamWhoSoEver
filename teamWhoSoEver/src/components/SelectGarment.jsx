import React from "react"; 
import Hoodie from "../components/Hoodie";
import Tshirt from "../components/Tshirt";

const garments = [
  { name: "hoodie", Component: Hoodie },
  { name: "tshirt", Component: Tshirt },
];

const SelectGarment = ({ selectedGarment, onSelect }) => {
  return (
    <div className="flex md:flex-col flex-row gap-4 w-full md:w-36 overflow-x-auto md:overflow-y-auto p-2">
      {garments.map((garment) => {
        const SVGComponent = garment.Component;
        return (
          <div
            key={garment.name}
            onClick={() => onSelect(garment)}
            className={`flex flex-col items-center justify-center min-w-[100px] md:min-w-full p-4 rounded-xl cursor-pointer
              border-2 ${
                selectedGarment?.name === garment.name
                  ? "border-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-gray-200 dark:bg-gray-800 hover:scale-105 transform transition`}
          >
            <SVGComponent className="w-20 h-20 object-contain" />
            <span className="mt-2 font-medium text-gray-900 dark:text-gray-100">
              {garment.name.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SelectGarment;
