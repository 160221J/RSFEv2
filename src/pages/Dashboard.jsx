export default function Dashboard() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Total Sales Today</h2>
          <p className="text-3xl font-semibold mt-2">Rs. 0</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Total Profit Today</h2>
          <p className="text-3xl font-semibold mt-2">Rs. 0</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Low Stock Items</h2>
          <p className="text-3xl font-semibold mt-2">0</p>
        </div>

      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Recent Sales</h2>

      <div className="bg-white shadow rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3">—</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
