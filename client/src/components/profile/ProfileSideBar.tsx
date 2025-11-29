import { NavLink } from "react-router-dom";
import { Home, User, LogOut, Key } from "lucide-react";
import useAuthStore from "@/stores/useStore";
import { useNavigate } from "react-router-dom";

type Props = {
  onEditProfile: () => void;
  onChangePassword: () => void;
};

function ProfileSidebar({ onEditProfile, onChangePassword }: Props) {
  const logout = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/blogs"); 
  };

  const menuItems = [
    { name: "Dashboard", path: "/profile", icon: Home },
    { name: "Edit Profile", action: onEditProfile, icon: User, color: "green" },
    { name: "Change Password", action: onChangePassword, icon: Key, color: "green" },
    { name: "Logout", action: handleLogout, icon: LogOut, color: "red" },
  ];

  return (
    <aside className="w-64 bg-black text-white h-screen flex-col sticky top-0">
      <div className="px-6 py-6 text-center border-b border-green-900">
        <h1 className="text-xl font-bold text-green-500 uppercase">My Profile</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) =>
          item.path ? (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium ${
                  isActive
                    ? "bg-green-700 text-white"
                    : "hover:bg-green-900 text-gray-200"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ) : (
            <button
              key={item.name}
              onClick={item.action}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium w-full text-left ${
                item.color === "green"
                  ? "hover:bg-green-900 text-white"
                  : "hover:bg-red-700 text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          )
        )}
      </nav>

      <div className="px-4 py-6 border-t border-green-900">
        <button
          onClick={() => window.history.back()}
          className="w-full text-green-500 font-bold hover:text-red-600 flex items-center gap-2"
        >
          ← Back
        </button>
      </div>
    </aside>
  );
}

export default ProfileSidebar;