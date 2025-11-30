import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { register, login, logout, updateProfile } from "./controllers/auth.ts";
import { passStrength } from "./middlewares/checkPasswordStrength.ts";
import { checkUserDetails } from "./middlewares/checkUserDetails.ts";
import { legitimate } from "./middlewares/checkExistingUsers.ts";
import { verifyToken } from "./middlewares/verifyToken.ts";
import { authenticateAdmin } from "./middlewares/checkUserRole.ts";
import { type Response, type Request, type NextFunction } from "express";
import {
  getUser,
  updateUser,
  userTrash,
  changePassword,
} from "./controllers/user.ts";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getUserBlogs,
  updateBlog,
  trashBlog,
  restoreTrash,
  deletePermanently,
} from "./controllers/posts.ts";

import {
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  getAllBlogs,
  disableBlog,
  enableBlog,
  getSystemStats,
  deleteBlogPermanently,
} from "./controllers/admin.ts";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./controllers/categories.ts";

// Import the interactions controller
import {
  toggleLike,
  unlikeBlog,
  addComment,
  trackView,
  getComments,
  getUserStats,
} from "./controllers/interactions.ts";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Cookie",
      "Set-Cookie",
    ],
    exposedHeaders: ["Set-Cookie", "Cookie"],
  }),
);

try {
  // authentication routes
  app.post(
    "/auth/register",
    passStrength,
    checkUserDetails,
    legitimate,
    register,
  );
  app.post("/auth/login", login);
  app.post("/auth/logout", logout);
  app.patch("/auth/updateProfile/:id", updateProfile);
  app.patch("/auth/password", verifyToken, changePassword);

  // user routes
  app.get("/profile", verifyToken, getUser);
  app.get("/profile/blogs", verifyToken, getUserBlogs);
  app.get("/profile/trash", verifyToken, userTrash);
  app.patch("/profile/:id", verifyToken, updateUser);

  // blog routes
  app.get("/blogs", getBlogs);
  app.post("/blogs/create", verifyToken, createBlog);
  app.get("/blogs/:id", getBlogById);
  app.patch("/blogs/:id", verifyToken, updateBlog);
  app.patch("/blogs/trash/:id", verifyToken, trashBlog);
  app.patch("/blogs/restore/:id", verifyToken, restoreTrash);
  app.delete("/blogs/:id", verifyToken, deletePermanently);

  // Analytics and interactions routes
  app.post("/blogs/:id/view", trackView); // Track views (no auth required)
  app.get("/blogs/:id/comments", getComments); // Get comments (no auth required)
  app.post("/blogs/:id/like", verifyToken, toggleLike);
  app.post("/blogs/:id/unlike", verifyToken, unlikeBlog);
  app.post("/blogs/:id/comment", verifyToken, addComment);
  app.get("/user/:userId/stats", getUserStats);

  // category routes
  app.get("/categories", getCategories);
  app.post(
    "/categories/create",
    verifyToken,
    authenticateAdmin,
    createCategory,
  );
  app.patch("/categories/:id", verifyToken, authenticateAdmin, updateCategory);
  app.delete("/categories/:id", verifyToken, authenticateAdmin, deleteCategory);

  // Admin routes
  app.get("/admin/users", verifyToken, authenticateAdmin, getAllUsers);
  app.patch(
    "/admin/users/:id/role",
    verifyToken,
    authenticateAdmin,
    updateUserRole,
  );
  app.patch(
    "/admin/users/:id/status",
    verifyToken,
    authenticateAdmin,
    toggleUserStatus,
  );
  app.delete(
    "/admin/blogs/:id",
    verifyToken,
    authenticateAdmin,
    deleteBlogPermanently,
  );
  app.get("/admin/blogs", verifyToken, authenticateAdmin, getAllBlogs);
  app.patch(
    "/admin/blogs/:id/disable",
    verifyToken,
    authenticateAdmin,
    disableBlog,
  );
  app.patch(
    "/admin/blogs/:id/enable",
    verifyToken,
    authenticateAdmin,
    enableBlog,
  );

  app.get("/admin/stats", verifyToken, authenticateAdmin, getSystemStats);

  const port = 5000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}...`);
  });
} catch (err) {
  console.log(err);
}
