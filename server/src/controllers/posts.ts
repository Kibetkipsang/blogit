import { PrismaClient } from "@prisma/client";
import { createDecipheriv } from "crypto";
import { type Request, type Response } from "express";

const client = new PrismaClient();

// create blogs
export const createBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { title, synopsis, categoryId, featuredImageUrl, content } = req.body;
    if (!title) {
      res.status(400).json({
        message: "Title is required",
      });
      return;
    }
    if (!synopsis) {
      res.status(400).json({
        message: "Synopsis is required",
      });
      return;
    }
    if (!content) {
      res.status(400).json({
        message: "Blog Content is required",
      });
      return;
    }

    const blog = await client.blog.create({
      data: {
        title,
        synopsis,
        featuredImageUrl,
        content,
        user: { connect: { id: String(userId) } },
        ...(categoryId && {
          category: { connect: { id: String(categoryId) } },
        }),
      },
    });

    res.status(200).json({
      message: "Blog created successfully.",
      blogId: blog.id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
// get blogs
// get blogs
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await client.blog.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
            emailAdress: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No blogs found",
        blogs: [],
        count: 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs: blogs,
      count: blogs.length,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
// Get current user's blogs for profile page
// Get current user's blogs for profile page
export const getUserBlogs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const userBlogs = await client.blog.findMany({
      where: {
        AND: [{ userId: String(userId) }, { isDeleted: false }],
      },
      select: {
        id: true,
        title: true,
        synopsis: true,
        featuredImageUrl: true,
        content: true,
        createdAt: true,
        viewCount: true, // ADD THIS
        likesCount: true, // ADD THIS
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "User blogs retrieved successfully",
      blogs: userBlogs,
      count: userBlogs.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
// Get user's trashed blogs
export const getUserTrashedBlogs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const trashedBlogs = await client.blog.findMany({
      where: {
        AND: [
          { userId: String(userId) },
          { isDeleted: true }, // Only get deleted blogs
        ],
      },
      select: {
        id: true,
        title: true,
        synopsis: true,
        featuredImageUrl: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Trashed blogs retrieved successfully",
      blogs: trashedBlogs,
      count: trashedBlogs.length,
    });
  } catch (err) {
    console.error("Error fetching trashed blogs:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// get blog by id
// get blog by id
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Blog id is required",
      });
    }

    const blog = await client.blog.findFirst({
      where: {
        AND: [{ id: String(id) }, { isDeleted: false }],
      },
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
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
// update a blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, synopsis, categoryId, featuredImageUrl, content } = req.body;
    const updatedBlog = await client.blog.updateMany({
      where: {
        AND: [{ id: String(id) }, { userId: String(userId) }],
      },
      data: {
        title: title && title,
        synopsis: synopsis && synopsis,
        categoryId: categoryId && categoryId,
        featuredImageUrl: featuredImageUrl && featuredImageUrl,
        content: content && content,
      },
    });
    // check if blog was updated
    if (updatedBlog.count === 0) {
      return res.status(404).json({
        message: "Update details to be changed.",
      });
    }
    res.status(200).json({
      message: "Blog updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
// move blog to trash
export const trashBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Blog id is required.",
      });
    }

    // Check if blog exists and is not deleted
    const existingBlog = await client.blog.findMany({
      where: {
        AND: [
          { id: String(id) },
          { isDeleted: false }, // Looking for active blogs
        ],
      },
    });
    // check if any blog was found
    if (existingBlog.length === 0) {
      // Check why blog wasn't found
      const anyBlog = await client.blog.findFirst({
        where: { id: String(id) },
      });

      if (!anyBlog) {
        return res.status(404).json({
          message: "Blog not found",
        });
      } else {
        return res.status(400).json({
          message: "Blog is already in trash.",
        });
      }
    }

    // move blog to trash
    const trashedBlog = await client.blog.update({
      where: {
        id: String(id),
      },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      message: "Blog successfully moved to trash.",
    });
  } catch (err) {
    console.error("Error trashing blog:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
// restore blog from trash
export const restoreTrash = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false, // Add success field
        message: "Blog id is required.",
      });
    }

    // Check if blog is in trash
    const inTrash = await client.blog.findMany({
      where: {
        AND: [{ id: String(id) }, { isDeleted: true }],
      },
    });

    if (inTrash.length === 0) {
      const blog = await client.blog.findFirst({
        where: { id: String(id) },
      });

      if (!blog) {
        return res.status(404).json({
          success: false, // Add success field
          message: "Blog not found",
        });
      } else {
        return res.status(400).json({
          // ADD return
          success: false, // Add success field
          message: "Blog already restored or not in trash",
        });
      }
    }

    const restoredBlog = await client.blog.update({
      where: {
        id: String(id),
      },
      data: {
        isDeleted: false,
      },
    });

    return res.status(200).json({
      // ADD return
      success: true, // Add success field
      message: "Blog restored successfully.",
      blog: restoredBlog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      // ADD return
      success: false, // Add success field
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const deletePermanently = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false, // Add success field
        message: "Unauthorized. Please log in.",
      });
    }

    // Check if blog exists and belongs to user
    const existing = await client.blog.findMany({
      where: {
        AND: [{ id: String(id) }, { userId: String(userId) }],
      },
    });

    if (existing.length === 0) {
      return res.status(404).json({
        success: false, // Add success field
        message: "Blog not found.",
      });
    }

    const deletedBlog = await client.blog.deleteMany({
      where: {
        AND: [{ id: String(id) }, { userId: String(userId) }],
      },
    });

    // Check if any blog was actually deleted
    if (deletedBlog.count === 0) {
      return res.status(404).json({
        success: false, // Add success field
        message: "Blog not found or already deleted.",
      });
    }

    return res.status(200).json({
      // ADD return
      success: true, // Add success field
      message: "Blog deleted successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      // ADD return
      success: false, // Add success field
      message: "Something went wrong. Please try again later.",
    });
  }
};
