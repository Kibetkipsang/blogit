import "./App.css";
import Home from "./components/pages/Home";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import CreateBlog from "./components/pages/CreateBlog";
import Blogs from "./components/pages/Blogs";

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
