import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/useStore";
import { Button } from "@/components/ui/button";



function AdminHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  return (
    <header className="w-full bg-gray-950 text-white py-6 px-10 shadow-lg ">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-white font-bold tracking-wide">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm">Manage site content & settings</p>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-gray-300 text-sm">
            Logged in as:{" "}
            <span className="text-green-400 font-semibold">
              {user?.userName}
            </span>
          </p>

          <Button
            onClick={() => {
                logout();
                navigate("/login")
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;