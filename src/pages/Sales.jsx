import { useState, useEffect } from "react";
import axios from "axios";

export default function Sales() {
  const [rows, setRows] = useState([
    { barcode: "", name: "", quantity: 1, price: "", suggestions: [] }
  ]);

  const API = "http://localhost:8080";

  // Handle input changes
  const handleChange = async (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    // If typing name → show autocomplete
    if (field === "name" && value.trim() !== "") {
      try {
        const res = await axios.get(`${API}/products/search?q=${value}`);
        updated[index].suggestions = res.data || [];
      } catch (e) {
        updated[index].suggestions = [];
      }
    }

    // If barcode typed → search by barcode
    if (field === "barcode" && value.length > 2) {
      try {
        const res = await axios.get(`${API}/products/search?q=${value}`);
        const match = res.data && res.data.length ? res.data[0] : null;

        if (match) {
          updated[index].name = match.name;
          updated[index].price = match.markedPrice || match.marked_price || "";
        }
      } catch (err) {}
    }

    setRows(updated);
  };

  // When selecting item from suggestions
  const selectSuggestion = (index, item) => {
    const updated = [...rows];
    updated[index].name = item.name;
    updated[index].price = item.markedPrice || item.marked_price || "";
    updated[index].suggestions = [];
    setRows(updated);
  };

  // Add new empty row
  const addRow = () => {
    setRows([...rows, { barcode: "", name: "", quantity: 1, price: "", suggestions: [] }]);
  };

  // Remove selected row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Submit bulk sale
  const handleSubmit = async () => {
    const payload = rows.map((r) => ({
      name: r.name,
      quantity: parseInt(r.quantity),
      sale_price: parseFloat(r.price)
    }));

    try {
      const res = await axios.post(`${API}/sales/bulk`, payload, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Sale successful!");

      // Reset form
      setRows([{ barcode: "", name: "", quantity: 1, price: "", suggestions: [] }]);

    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Record Sales</h1>

      <div className="space-y-6">
        {rows.map((row, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow relative">

            {/* Barcode */}
            <input
              type="text"
              className="border p-2 rounded w-full mb-3"
              placeholder="Scan Barcode or enter manually"
              value={row.barcode}
              onChange={(e) => handleChange(index, "barcode", e.target.value)}
            />

            {/* Name Input + Autocomplete */}
            <div className="relative">
              <input
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Item name"
                value={row.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />

              {/* Suggestions Dropdown */}
              {row.suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white shadow-lg border max-h-40 overflow-y-auto z-10">
                  {row.suggestions.map((item, i) => (
                    <li
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectSuggestion(index, item)}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity + Price */}
            <div className="flex gap-4 mt-3">

              <input
                type="number"
                className="border p-2 rounded w-32"
                value={row.quantity}
                min={1}
                onChange={(e) => handleChange(index, "quantity", e.target.value)}
              />

              <input
                type="number"
                className="border p-2 rounded w-32"
                step="0.01"
                placeholder="Price"
                value={row.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
              />

              {/* Calculated total */}
              <div className="p-2 text-lg font-semibold text-gray-700">
                Rs. {(row.quantity * row.price || 0).toFixed(2)}
              </div>
            </div>

            {/* Remove Row Button */}
            {rows.length > 1 && (
              <button
                onClick={() => removeRow(index)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                X
              </button>
            )}

          </div>
        ))}

        {/* Add New Row */}
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Item
        </button>

        {/* Submit Button */}
        <div>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-3 rounded shadow text-lg"
          >
            Submit Sale
          </button>
        </div>

      </div>
    </div>
  );
}
