import { useEffect, useState } from "react";
import axios from "axios";

export default function StockManagement() {
  const API = "http://localhost:8080";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // ------------------------------------------------
  // Fetch products
  // ------------------------------------------------
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data || []);
    } catch (err) {
      alert("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // Local edit handler
  // ------------------------------------------------
  const updateField = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // ------------------------------------------------
  // Save product
  // ------------------------------------------------
  const saveProduct = async (product) => {
    try {
      setSavingId(product.id);

      await axios.put(`${API}/products/${product.id}`, {
        barcode: product.barcode,
        name: product.name,
        costPrice: Number(product.costPrice),
        sellingPrice: Number(product.sellingPrice),
        quantity: Number(product.quantity),
      });

      alert("Product updated");

    } catch (err) {
      alert("Update failed: " + (err.response?.data || err.message));
    } finally {
      setSavingId(null);
    }
  };

  // ------------------------------------------------
  // Filtered list (search)
  // ------------------------------------------------
  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.barcode}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Stock Management</h1>

      {/* Search */}
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Search by name or barcode"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading stock...</p>}

      {!loading && (
        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3">Barcode</th>
                <th className="p-3">Name</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Cost</th>
                <th className="p-3 text-right">Selling</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  {/* Barcode */}
                  <td className="p-2">
                    <input
                      className="border p-1 w-28"
                      value={p.barcode || ""}
                      onChange={(e) =>
                        updateField(p.id, "barcode", e.target.value)
                      }
                    />
                  </td>

                  {/* Name */}
                  <td className="p-2">
                    <input
                      className="border p-1 w-full"
                      value={p.name}
                      onChange={(e) =>
                        updateField(p.id, "name", e.target.value)
                      }
                    />
                  </td>

                  {/* Quantity */}
                  <td className="p-2 text-right">
                    <input
                      type="number"
                      className="border p-1 w-20 text-right"
                      value={p.quantity}
                      onChange={(e) =>
                        updateField(p.id, "quantity", e.target.value)
                      }
                    />
                  </td>

                  {/* Cost */}
                  <td className="p-2 text-right">
                    <input
                      type="number"
                      step="0.01"
                      className="border p-1 w-24 text-right"
                      value={p.costPrice}
                      onChange={(e) =>
                        updateField(p.id, "costPrice", e.target.value)
                      }
                    />
                  </td>

                  {/* Selling */}
                  <td className="p-2 text-right">
                    <input
                      type="number"
                      step="0.01"
                      className="border p-1 w-24 text-right"
                      value={p.sellingPrice}
                      onChange={(e) =>
                        updateField(p.id, "sellingPrice", e.target.value)
                      }
                    />
                  </td>

                  {/* Save */}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => saveProduct(p)}
                      disabled={savingId === p.id}
                      className={`px-3 py-1 rounded text-white ${
                        savingId === p.id
                          ? "bg-gray-400"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {savingId === p.id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
