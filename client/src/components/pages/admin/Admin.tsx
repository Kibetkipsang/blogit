function Admin() {
  return (
    <div >
      <div className="flex gap-8 p-8">
        <div className="flex-1 bg-white  ">
          <h2 className="text-2xl font-bold mb-4">Admin Content Area</h2>
          <p className="text-gray-600">
            Here you can manage users, blogs, categories, and site settings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <h3 className="text-lg font-semibold">Total Blogs</h3>
              <p className="text-4xl font-bold mt-3 text-green-400">124</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <h3 className="text-lg font-semibold">Registered Users</h3>
              <p className="text-4xl font-bold mt-3 text-blue-400">58</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <h3 className="text-lg font-semibold">Pending Reviews</h3>
              <p className="text-4xl font-bold mt-3 text-red-400">6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
