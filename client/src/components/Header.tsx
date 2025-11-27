import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useAuthStore from "@/stores/useStore";
import { useNavigate } from "react-router-dom";

function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();

  return (
    <header className="w-full bg-black text-white shadow-md h-24 flex fixed top-0 left-0 z-10 ">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">BlogIt</h1>
        <nav className="flex gap-6">
          <Link to="/" className="hover:text-red-500 transition text-xl">
            Home
          </Link>
          {user && (
            <Link to="/profile" className="hover:text-red-500 transition text-xl">
            Profile
          </Link>
          )}
          <Link to="/blogs" className="hover:text-red-500 transition text-xl">
            Blogs
          </Link>
          {user && (
            <Link
              to="/create-blog"
              className="hover:text-red-500 transition text-xl"
            >
              Create Blog
            </Link>
          )}
          {user ? (
            ""
          ) : (
            <Link
              to="/register"
              className="hover:text-red-500 transition text-xl"
            >
              Register
            </Link>
          )}
          {!user && (
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="bg-green-700 hover:bg-green-800"
            >
              Login
            </Button>
          )}
        </nav>
        <div className="gap-6 flex justify-between">
          {user?.role === "admin" && (
          <Button
            onClick={() => {
              navigate("/admin");
            }}
            className="bg-green-700 hover:bg-green-800"
          >
            Admin Panel
          </Button>
        ) }
        {user && (
          <Button
            onClick={() => {
              logout();
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        )}
        </div>

      </div>
    </header>
  );
}

export default Header;
