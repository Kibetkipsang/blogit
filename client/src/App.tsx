import "./App.css";
import Home from "./components/pages/Home";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./components/profile/Profile";
import CreateBlog from "./components/pages/CreateBlog";
import Blogs from "./components/pages/Blogs";
import BlogDetails from "./components/pages/BlogDetails";
import Admin from "./components/pages/admin/Admin";
import CreateCategories from "./components/pages/admin/CreateCategories";
import AdminLayout from "./components/pages/admin/AdminLayout";
import AdminCategories from "./components/pages/admin/adminCategories";
import EditCategoryModal from "./components/pages/admin/EditCategories";
import BlogArticleHeader from "./components/pages/BlogsHeader";
import ProfileLayout from "./components/profile/ProfileLayout";
import ProfileHeader from "./components/profile/ProfileHeader";
import Trash from "./components/profile/UserTrash";


function App() {

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isBlogDetails = /^\/blogs\/[^/]+$/.test(location.pathname); 
  const isProfile = location.pathname.startsWith("/profile"); 
  return (
    <>
      <div>
        {isBlogDetails ? (
  <BlogArticleHeader />
) : isProfile ? null  
: !isAdminRoute ? (
  <Header />
) : null}
  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfileLayout />}>
  <Route index element={<Profile />} />
  <Route path="header" element={<ProfileHeader />} />
  <Route path="trash" element={<Trash />} />
</Route>

          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Admin />} />
              <Route path="createCategories" element={<CreateCategories />} />
              <Route path="adminCategories" element={<AdminCategories />} />
              <Route path="editCategory" element={<EditCategoryModal category={{ id: "", name: '' }} open={false} onClose={() => {}}/>} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
