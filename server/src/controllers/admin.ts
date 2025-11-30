import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";

const client = new PrismaClient();

// Get all users (admin only) - FIXED to match your schema
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await client.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        emailAdress: true,
        role: true,
        isDeleted: true, // Using isDeleted since isActive doesn't exist
        dateJoined: true, // Using dateJoined since createdAt doesn't exist
        lastUpdated: true,
      },
      orderBy: {
        dateJoined: "desc",
      },
    });

    // Add blog counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const blogCount = await client.blog.count({
          where: {
            userId: user.id,
            isDeleted: false,
          },
        });

        return {
          ...user,
          _count: {
            blogs: blogCount,
          },
        };
      }),
    );

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: usersWithCounts,
      count: usersWithCounts.length,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Update user role (admin only) - FIXED
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Valid role (user/admin) is required",
      });
    }

    const updatedUser = await client.user.update({
      where: { id: String(id) },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        emailAdress: true,
        role: true,
        isDeleted: true, // Using isDeleted since isActive doesn't exist
      },
    });

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Toggle user status - FIXED to use isDeleted
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await client.user.findUnique({
      where: { id: String(id) },
      select: { isDeleted: true, userName: true }, // Using isDeleted
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await client.user.update({
      where: { id: String(id) },
      data: { isDeleted: !user.isDeleted }, // Using isDeleted for suspension
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        emailAdress: true,
        role: true,
        isDeleted: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `User ${!updatedUser.isDeleted ? "activated" : "suspended"} successfully`,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error toggling user status:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get all blogs with moderation capabilities - FIXED for current schema
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const whereClause: any = {};

    if (status === "active") {
      whereClause.isDeleted = false;
      whereClause.isDisabled = false;
    } else if (status === "disabled") {
      whereClause.isDisabled = true;
    } else if (status === "trashed") {
      whereClause.isDeleted = true;
    }

    const blogs = await client.blog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
            emailAdress: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs: blogs,
      count: blogs.length,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Disable blog - FIXED: Uses isDisabled, not isDeleted
export const disableBlog = async (req: Request, res: Response) => {
  try {
    console.log("🛑 DISABLE BLOG - START");
    const { id } = req.params;
    const { reason } = req.body;

    console.log("Blog ID to disable:", id);
    console.log("Disable reason:", reason);

    // Check if blog exists
    const blog = await client.blog.findUnique({
      where: { id: String(id) },
    });

    console.log("Current blog state BEFORE update:", {
      id: blog?.id,
      title: blog?.title,
      isDeleted: blog?.isDeleted,
      isDisabled: blog?.isDisabled,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Cannot disable a blog that is already in trash",
      });
    }

    // ✅ CORRECT: Update isDisabled, NOT isDeleted
    const updatedBlog = await client.blog.update({
      where: { id: String(id) },
      data: {
        isDisabled: true, // This is what should change
        disabledReason: reason,
        disabledAt: new Date(),
        // ❌ DO NOT modify isDeleted here
      },
    });

    console.log("Blog state AFTER update:", {
      id: updatedBlog.id,
      isDisabled: updatedBlog.isDisabled,
      isDeleted: updatedBlog.isDeleted,
      disabledReason: updatedBlog.disabledReason,
    });

    console.log("✅ BLOG DISABLED SUCCESSFULLY");

    res.status(200).json({
      success: true,
      message: "Blog disabled successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    console.error("❌ Error disabling blog:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Enable blog - FIXED: Uses isDisabled, not isDeleted
export const enableBlog = async (req: Request, res: Response) => {
  try {
    console.log("🔓 ENABLE BLOG - START");
    const { id } = req.params;

    console.log("Blog ID to enable:", id);

    const blog = await client.blog.findUnique({
      where: { id: String(id) },
    });

    console.log("Current blog state BEFORE enable:", {
      id: blog?.id,
      title: blog?.title,
      isDeleted: blog?.isDeleted,
      isDisabled: blog?.isDisabled,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // ✅ CORRECT: Update isDisabled, NOT isDeleted
    const updatedBlog = await client.blog.update({
      where: { id: String(id) },
      data: {
        isDisabled: false, // This is what should change
        disabledReason: null,
        disabledAt: null,
        // ❌ DO NOT modify isDeleted here
      },
    });

    console.log("Blog state AFTER enable:", {
      id: updatedBlog.id,
      isDisabled: updatedBlog.isDisabled,
      isDeleted: updatedBlog.isDeleted,
    });

    console.log("✅ BLOG ENABLED SUCCESSFULLY");

    res.status(200).json({
      success: true,
      message: "Blog enabled successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    console.error("❌ Error enabling blog:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Delete blog permanently (admin only)
export const deleteBlogPermanently = async (req: Request, res: Response) => {
  try {
    console.log("🗑️ DELETE BLOG PERMANENTLY - START");
    const { id } = req.params;

    console.log("Blog ID to delete permanently:", id);

    // Check if blog exists
    const blog = await client.blog.findUnique({
      where: { id: String(id) },
    });

    console.log("Current blog state BEFORE deletion:", {
      id: blog?.id,
      title: blog?.title,
      isDeleted: blog?.isDeleted,
      isDisabled: blog?.isDisabled,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete the blog permanently from database
    await client.blog.delete({
      where: { id: String(id) },
    });

    console.log("✅ BLOG DELETED PERMANENTLY");

    res.status(200).json({
      success: true,
      message: "Blog deleted permanently",
    });
  } catch (err) {
    console.error("❌ Error deleting blog permanently:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get system statistics - FIXED for current schema
export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalBlogs,
      activeBlogs,
      disabledBlogs,
      trashedBlogs,
      totalCategories,
    ] = await Promise.all([
      client.user.count(),
      client.blog.count(),
      client.blog.count({
        where: {
          isDeleted: false,
          isDisabled: false,
        },
      }),
      client.blog.count({
        where: {
          isDisabled: true,
        },
      }),
      client.blog.count({
        where: {
          isDeleted: true,
        },
      }),
      client.category.count(),
    ]);

    res.status(200).json({
      success: true,
      message: "System stats fetched successfully",
      stats: {
        users: {
          total: totalUsers,
        },
        blogs: {
          total: totalBlogs,
          active: activeBlogs,
          disabled: disabledBlogs,
          trashed: trashedBlogs,
        },
        content: {
          categories: totalCategories,
        },
      },
    });
  } catch (err) {
    console.error("Error fetching system stats:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
