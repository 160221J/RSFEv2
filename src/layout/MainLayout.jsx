import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-5 space-y-4">
        <h2 className="text-xl font-bold mb-6">Shop System</h2>

        <nav className="flex flex-col space-y-2">
          <Link to="/" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/sales" className="hover:text-blue-600">Sales</Link>
          <Link to="/stocks" className="hover:text-blue-600">Stock Management</Link>
          <Link to="/withdrawals" className="hover:text-blue-600">Withdrawals</Link>
          <Link to="/profit" className="hover:text-blue-600">Daily Profit</Link>
          <Link to="/settings" className="hover:text-blue-600">Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>

    </div>
  );
}
