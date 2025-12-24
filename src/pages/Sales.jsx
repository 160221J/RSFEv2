import { useState } from "react";
import axios from "axios";

export default function Sales() {
  const API = "http://localhost:8080"; // Backend root

  const [rows, setRows] = useState([
    { productId: null, barcode: "", name: "", quantity: 1, salePrice: "", suggestions: [] }
  ]);

  // --------------------------------------------
  //  Handle field changes
  // --------------------------------------------
  const handleChange = async (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    // SEARCH by name or barcode
    if ((field === "name" || field === "barcode") && value.trim() !== "") {
      try {
        const res = await axios.get(
          `${API}/products/search?q=${encodeURIComponent(value)}`
        );

        updated[index].suggestions = res.data || [];
      } catch (err) {
        console.error("Search error:", err);
        updated[index].suggestions = [];
      }
    }

    setRows(updated);
  };

  // --------------------------------------------
  //  When user selects a suggested product
  // --------------------------------------------
  const selectSuggestion = (index, product) => {
    const updated = [...rows];

    updated[index].productId = product.id;           // ✅ Save productId
    updated[index].name = product.name;              // Show name
    updated[index].salePrice = product.sellingPrice; // Default selling price
    updated[index].suggestions = [];                 // Clear suggestions

    setRows(updated);
  };

  // --------------------------------------------
  //  Add new row
  // --------------------------------------------
  const addRow = () => {
    setRows([
      ...rows,
      { productId: null, barcode: "", name: "", quantity: 1, salePrice: "", suggestions: [] }
    ]);
  };

  // --------------------------------------------
  //  Remove a row
  // --------------------------------------------
  const removeRow = (i) => {
    setRows(rows.filter((_, idx) => idx !== i));
  };

  // --------------------------------------------
  //  Submit Sales
  // --------------------------------------------
  const submitSales = async () => {
    const payload = rows.map((r) => ({
      productId: r.productId,
      quantity: Number(r.quantity),
      salePrice: Number(r.salePrice),
    }));

    try {
      await axios.post(`${API}/sales/bulk`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Sales successfully recorded!");

      // Reset
      setRows([
        { productId: null, barcode: "", name: "", quantity: 1, salePrice: "", suggestions: [] }
      ]);

    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Record Sales</h1>

      <div className="space-y-6">
        {rows.map((row, index) => (
          <div key={index} className="bg-white p-4 rounded shadow relative">

            {/* Barcode field */}
            <input
              className="border p-2 w-full rounded mb-3"
              placeholder="Scan barcode"
              value={row.barcode}
              onChange={(e) => handleChange(index, "barcode", e.target.value)}
            />

            {/* Name field with suggestions */}
            <div className="relative">
              <input
                className="border p-2 w-full rounded"
                placeholder="Search item name"
                value={row.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />

              {/* Suggestion Dropdown */}
              {row.suggestions.length > 0 && (
                <ul className="absolute bg-white w-full shadow max-h-48 overflow-y-auto z-10 border rounded">
                  {row.suggestions.map((p) => (
                    <li
                      key={p.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectSuggestion(index, p)}
                    >
                      {p.name} — Rs. {p.sellingPrice}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity + Price */}
            <div className="flex gap-3 mt-3">
              <input
                type="number"
                min={1}
                className="border p-2 rounded w-24"
                value={row.quantity}
                onChange={(e) => handleChange(index, "quantity", e.target.value)}
              />

              <input
                type="number"
                step="0.01"
                className="border p-2 rounded w-32"
                placeholder="Sale Price"
                value={row.salePrice}
                onChange={(e) => handleChange(index, "salePrice", e.target.value)}
              />

              <div className="p-2 font-semibold">
                Rs {(row.quantity * row.salePrice || 0).toFixed(2)}
              </div>
            </div>

            {/* Remove row */}
            {rows.length > 1 && (
              <button
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => removeRow(index)}
              >
                X
              </button>
            )}
          </div>
        ))}

        {/* Add new row */}
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>

        {/* Submit */}
        <button
          onClick={submitSales}
          className="bg-green-600 text-white px-6 py-3 rounded text-lg"
        >
          Submit Sale
        </button>
      </div>
    </div>
  );
}
