import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { register, login, logout } from "./controllers/auth.ts";
import { passStrength } from "./middlewares/checkPasswordStrength.ts";
import { checkUserDetails } from "./middlewares/checkUserDetails.ts";
import { legitimate } from "./middlewares/checkExistingUsers.ts";
import { verifyToken } from "./middlewares/verifyToken.ts";
import { getUsers, getUserById, createUser, updateUser, deleteUser, changePassword } from "./controllers/user.ts";
import { createBlog, getBlog, getBlogById, updateBlog, trashBlog, restoreTrash, deletePermanently } from "./controllers/posts.ts";

dotenv.config()
const app = express();
app.use(express.json());
app.use(cookieParser());

try{


// authentication routes
app.post("/auth/register", passStrength, checkUserDetails, legitimate, register);
app.post("/auth/login", login);
app.post("/auth/logout", logout);

// user routes
app.get("/users", getUsers);
app.get("/users/:id", getUserById);
app.post("/users", createUser);
app.patch("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);
app.patch("/users/:id", changePassword);

// blog routes
app.get("/blogs", getBlog);
app.post("/blogs", verifyToken, createBlog);
app.get("/blogs/:id", getBlogById);
app.patch("/blogs/:id", verifyToken, updateBlog);
app.patch("/blogs/trash/:id", verifyToken, trashBlog);
app.patch("/blogs/restore/:id", verifyToken, restoreTrash);
app.delete("/blogs/:id", verifyToken, deletePermanently);

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}...`);
});

}catch(err){
    console.log(err)
}