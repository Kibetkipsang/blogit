import { Link } from "react-router-dom";


function AdminSidebar() {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-6 shadow-xl h-full">
      <h2 className="text-xl font-bold mb-6 tracking-wide text-green-400">Admin Menu</h2>

      <ul className="space-y-4 text-lg ">
        <li className="hover:text-black hover:font-bold  hover:bg-green-600 hover:text-white transition cursor-pointer  p-2 rounded-lg">
          <Link to="/admin">Admin Home</Link>
        </li>

        <li className="hover:text-black hover:font-bold  hover:bg-green-600 hover:text-white transition cursor-pointer  p-2 rounded-lg">
          <Link to="/admin/users">Manage Users</Link>
        </li>

        <li className="hover:text-black hover:font-bold  hover:bg-green-600 hover:text-white transition cursor-pointer  p-2 rounded-lg">
          <Link to="/admin/adminCategories">Manage Categories</Link>
        </li>

        <li className="hover:text-black hover:font-bold  hover:bg-green-600 hover:text-white transition cursor-pointer  p-2 rounded-lg">
          <Link to="/admin/blogs">Manage Blogs</Link>
        </li>

        <li className="hover:text-black hover:font-bold  hover:bg-green-600 hover:text-white transition cursor-pointer  p-2 rounded-lg">
          <Link to="/admin/settings">Site Settings</Link>
        </li>
        <button
      onClick={() => window.history.back()}
      className="text-green-500 mt-10 font-bold hover:text-red-600 text-md flex items-center gap-1"
    >
      ← Back
    </button>
      </ul>
    </div>
  );
}

export default AdminSidebar;