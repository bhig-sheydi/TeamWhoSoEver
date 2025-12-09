import React, { useState, useEffect, useRef } from "react";  
import SelectGarment from "./SelectGarment";
import ClothingPreview from "./ClothingPreview";
import DesignSelector from "./DesignSelector";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import domtoimage from "dom-to-image";

export default function ClothingCustomizer() {
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [selectedForColor, setSelectedForColor] = useState(false);
  const [color, setColor] = useState("#DD8F3D"); // Always HEX
  const [selectedDesign, setSelectedDesign] = useState(null);

  const [productData, setProductData] = useState(null);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const designs = ["Design 1", "Design 2", "Design 3", "Design 4"];
  const garmentToProductId = {
    hoodie: "6ddea40e-a842-461e-a660-d3bc8296dd71",
    tshirt: "d0af761b-95d3-4c76-a9a5-a3301d1a7c3c",
  };

  const previewRef = useRef();

  const fetchProductById = async (id) => {
    if (!id) return;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("product_id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      setProductData(null);
    } else {
      setProductData(data);
    }
  };

  useEffect(() => {
    const savedGarment = JSON.parse(localStorage.getItem("selectedGarment"));
    if (savedGarment) {
      setSelectedGarment(savedGarment);
      const id = garmentToProductId[savedGarment.name.toLowerCase()];
      fetchProductById(id);
    }
  }, []);

  const handleSelectGarment = (garment) => {
    setSelectedGarment(garment);
    localStorage.setItem("selectedGarment", JSON.stringify(garment));
    const id = garmentToProductId[garment.name.toLowerCase()];
    fetchProductById(id);
  };

  const handleAddToCart = () => setSizeModalOpen(true);

  // ✅ Capture preview safely using dom-to-image
  const capturePreviewAsBase64 = async () => {
    if (!previewRef.current) return null;
    try {
      const dataUrl = await domtoimage.toPng(previewRef.current);
      return dataUrl;
    } catch (err) {
      console.error("Error capturing preview:", err);
      return null;
    }
  };

  const confirmAddToCart = async () => { 
    if (!productData) return alert("Product data not loaded yet!");
  
    // Capture the preview as Base64
    const base64Image = await capturePreviewAsBase64();
    if (!base64Image) {
      alert("Failed to capture the custom design. Please try again.");
      return;
    }
  
    // Prepare product object for cart
    const product = {
      id: productData.product_id,
      name: productData.product_name,
      color,
      design: selectedDesign,
      selectedSize,
      quantity,
      price: productData.selling_price,
      image: productData.product_image_url,
      base64: base64Image, // store captured image under 'base64' key
    };
  
    // Load existing cart or initialize empty array
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Check if the same item (same id, size, design) already exists
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedSize === product.selectedSize &&
        item.design === product.design
    );
  
    if (existingIndex !== -1) {
      // Update existing item
      cart[existingIndex].quantity += quantity;
      cart[existingIndex].base64 = base64Image; // update Base64 string
    } else {
      // Add new item
      cart.push(product);
    }
  
    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  
    console.log("Captured preview stored in cart (Base64):", base64Image);
  
    setSizeModalOpen(false);
    alert(`${product.name} (${selectedSize}) x${quantity} added to cart!`);
  };
  

  return (
    <div className="pt-14 flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row flex-1 gap-4 p-4 overflow-hidden">
        <SelectGarment selectedGarment={selectedGarment} onSelect={handleSelectGarment} />

        <div
          ref={previewRef}
          style={{ backgroundColor: "#ffffff" }} // force hex background for capture
          className="flex-1 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-md flex flex-col justify-center items-center p-4 min-h-[200px] relative"
        >
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

              {selectedDesign && productData && (
                <button
                  onClick={handleAddToCart}
                  className="
                    mt-4 px-7 py-4 rounded-2xl font-bold 
                    bg-blue-600 text-white hover:bg-blue-700 
                    shadow-xl transition transform hover:scale-[1.03]
                    fixed bottom-10 right-1/2 translate-x-1/2 z-[9999999]
                    pointer-events-auto
                  "
                >
                  🚀 Add to Cart
                </button>
              )}
            </>
          )}
        </div>

        <DesignSelector designs={designs} selectedDesign={selectedDesign} onSelect={setSelectedDesign} />
      </div>

      <div className="flex flex-none gap-4 p-4 border-t border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 items-center overflow-x-auto">
        <p className="whitespace-nowrap">{selectedForColor ? "Change shirt color:" : "Select shirt first"}</p>
        <input
          type="color"
          value={color}
          disabled={!selectedForColor}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 p-0 border-0 cursor-pointer"
        />
      </div>

      {sizeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999999]">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Select Size</h2>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700"
            >
              {["XS", "S", "M", "L", "XL"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
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
