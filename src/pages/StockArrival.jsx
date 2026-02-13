import { useState } from "react";
import axios from "axios";

export default function StockArrival() {
  const API = "http://localhost:8080";

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [form, setForm] = useState({
    productId: null,
    barcode: "",
    name: "",
    quantity: 1,
    costPrice: "",
    sellingPrice: "",
  });

  // ----------------------------------
  // Search products
  // ----------------------------------
  const searchProduct = async (q) => {
    setSearch(q);

    if (!q.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`${API}/products/search?q=${q}`);
      setSuggestions(res.data || []);
    } catch {
      setSuggestions([]);
    }
  };

  // ----------------------------------
  // Select existing product
  // ----------------------------------
  const selectProduct = (p) => {
    setForm({
      productId: p.id,
      barcode: p.barcode || "",
      name: p.name,
      quantity: 1,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
    });

    setSearch("");
    setSuggestions([]);
  };

  // ----------------------------------
  // Submit arrival
  // ----------------------------------
  const submitArrival = async () => {
    try {
      await axios.post(`${API}/stocks/add`, {
        productId: form.productId,
        barcode: form.barcode,
        name: form.name,
        quantity: Number(form.quantity),
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
      });

      alert("Stock added successfully");

      setForm({
        productId: null,
        barcode: "",
        name: "",
        quantity: 1,
        costPrice: "",
        sellingPrice: "",
      });

    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Stock Arrival</h1>

      {/* Search existing */}
      <div className="relative mb-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Search existing product (name / barcode)"
          value={search}
          onChange={(e) => searchProduct(e.target.value)}
        />

        {suggestions.length > 0 && (
          <ul className="absolute bg-white border w-full shadow rounded z-10 max-h-48 overflow-y-auto">
            {suggestions.map((p) => (
              <li
                key={p.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectProduct(p)}
              >
                {p.name} — Rs. {p.sellingPrice}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded shadow space-y-4">

        <input
          className="border p-2 w-full rounded"
          placeholder="Barcode (optional)"
          value={form.barcode}
          onChange={(e) => setForm({ ...form, barcode: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="flex gap-3">
          <input
            type="number"
            min={1}
            className="border p-2 rounded w-32"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <input
            type="number"
            step="0.01"
            className="border p-2 rounded w-32"
            placeholder="Cost Price"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
          />

          <input
            type="number"
            step="0.01"
            className="border p-2 rounded w-32"
            placeholder="Selling Price"
            value={form.sellingPrice}
            onChange={(e) =>
              setForm({ ...form, sellingPrice: e.target.value })
            }
          />
        </div>

        <button
          onClick={submitArrival}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Add Stock
        </button>
      </div>
    </div>
  );
}
