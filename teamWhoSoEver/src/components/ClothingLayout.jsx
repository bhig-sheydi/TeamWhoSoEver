import React, { useState, useEffect } from "react";
import SelectGarment from "./SelectGarment";
import ClothingPreview from "./ClothingPreview";
import DesignSelector from "./DesignSelector";
import { Button } from "@/components/ui/button"; // optional for modal button
import { supabase } from "@/lib/supabaseClient";

export default function ClothingCustomizer() {
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [selectedForColor, setSelectedForColor] = useState(false);
  const [color, setColor] = useState("#DD8F3D");
  const [selectedDesign, setSelectedDesign] = useState(null);

  // Orders fetched but not displayed
  const [orders, setOrders] = useState([]);

  // Modal state
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M"); // default
  const [quantity, setQuantity] = useState(1);

  const designs = ["Design 1", "Design 2", "Design 3", "Design 4"];

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedGarment");
    if (saved) setSelectedGarment(JSON.parse(saved));

    // Fetch orders for only the two products
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("product_id", [
          "6ddea40e-a842-461e-a660-d3bc8296dd71",
          "d0af761b-95d3-4c76-a9a5-a3301d1a7c3c",
        ]);

      if (error) console.error("Error fetching orders:", error);
      else setOrders(data || []);
    };

    fetchOrders();
  }, []);

  // Save to localStorage when garment changes
  const handleSelectGarment = (garment) => {
    setSelectedGarment(garment);
    localStorage.setItem("selectedGarment", JSON.stringify(garment));
  };

  // Add to cart logic
  const handleAddToCart = () => {
    setSizeModalOpen(true); // open modal to select size
  };

  const confirmAddToCart = () => {
    const product = {
      id: selectedGarment.id,
      name: selectedGarment.name,
      color,
      design: selectedDesign,
      selectedSize,
      quantity,
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id && item.selectedSize === product.selectedSize
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setSizeModalOpen(false);
    alert(`${product.name} (${selectedSize}) x${quantity} added to cart!`);
  };

  return (
    <div className="pt-14 flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row flex-1 gap-4 p-4 overflow-hidden">
        {/* Garment Selector */}
        <SelectGarment
          selectedGarment={selectedGarment}
          onSelect={handleSelectGarment}
        />

        {/* Preview */}
        <div className="flex-1 rounded-xl 
                        bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-600
                        shadow-md dark:shadow-none
                        flex flex-col justify-center items-center 
                        p-4 min-h-[200px]">
          {!selectedGarment ? (
            <p className="font-semibold text-lg">Select a garment to start customizing</p>
          ) : (
            <>
              <ClothingPreview
                garment={selectedGarment}
                color={color}
                selected={selectedForColor}
                onSelect={() => setSelectedForColor(!selectedForColor)}
                selectedDesign={selectedDesign}
              />

              {selectedGarment && selectedDesign && (
                <button
                  onClick={handleAddToCart}
                  className="mt-2 px-6 py-3 rounded-xl font-semibold 
                             bg-blue-600 text-white hover:bg-blue-700 
                             shadow transition">
                  Add to Cart
                </button>
              )}
            </>
          )}
        </div>

        {/* Design Selector */}
        <DesignSelector
          designs={designs}
          selectedDesign={selectedDesign}
          onSelect={setSelectedDesign}
        />
      </div>

      {/* Bottom Color Picker */}
      <div className="flex flex-none gap-4 p-4 
                      border-t border-gray-300 dark:border-gray-600 
                      bg-gray-200 dark:bg-gray-800 
                      items-center overflow-x-auto">
        <p className="whitespace-nowrap">
          {selectedForColor ? "Change shirt color:" : "Select shirt first"}
        </p>

        <input
          type="color"
          value={color}
          disabled={!selectedForColor}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 p-0 border-0 cursor-pointer"
        />
      </div>

      {/* Size Selection Modal */}
      {sizeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Select Size</h2>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            <div className="flex items-center space-x-2 mb-4">
              <label>Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setSizeModalOpen(false)}>Cancel</Button>
              <Button onClick={confirmAddToCart} className="bg-green-500 text-white">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
