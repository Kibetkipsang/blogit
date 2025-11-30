// controllers/interactions.ts
import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";

const client = new PrismaClient();

// Track blog view (for all users)
export const trackView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    // Increment view count
    const updatedBlog = await client.blog.update({
      where: { id: String(id) },
      data: {
        viewCount: { increment: 1 },
      },
      select: {
        viewCount: true,
      },
    });

    res.json({
      success: true,
      viewCount: updatedBlog.viewCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get comments for a blog (for all users)
export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    // For now, return empty array since we don't have comments table yet
    res.json({
      success: true,
      comments: [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Toggle like - single endpoint for like/unlike
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    // Check if blog exists
    const blog = await client.blog.findUnique({
      where: { id: String(id) },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Since we don't have a Like model, we'll use a simple approach:
    // We can't track individual user likes, so we'll just toggle the count
    // For a proper implementation, you'd need to add a Like model

    // For now, we'll just increment/decrement without user tracking
    // This means users can like multiple times (limitation of current schema)

    const action = "like"; // Always like for now since we can't track

    const updatedBlog = await client.blog.update({
      where: { id: String(id) },
      data: {
        likesCount: { increment: 1 },
      },
      select: {
        likesCount: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Blog liked successfully",
      likesCount: updatedBlog.likesCount,
      action: action,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Unlike a blog
export const unlikeBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    // Check if blog exists
    const blog = await client.blog.findUnique({
      where: { id: String(id) },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Ensure likes count doesn't go below 0
    const newLikesCount = Math.max(0, blog.likesCount - 1);

    const updatedBlog = await client.blog.update({
      where: { id: String(id) },
      data: {
        likesCount: newLikesCount,
      },
      select: {
        likesCount: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Blog unliked successfully",
      likesCount: updatedBlog.likesCount,
      action: "unlike",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Add comment to blog
export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Check if blog exists
    const blog = await client.blog.findUnique({
      where: { id: String(id) },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment comments count
    const updatedBlog = await client.blog.update({
      where: { id: String(id) },
      data: {
        commentsCount: { increment: 1 },
      },
      select: {
        commentsCount: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      commentsCount: updatedBlog.commentsCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get user statistics (total likes, views across all posts)
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    // Get all blogs by this user with their likes and views counts
    const userBlogs = await client.blog.findMany({
      where: {
        userId: String(userId),
      },
      select: {
        likesCount: true,
        viewCount: true,
      },
    });

    // Calculate totals
    const totalLikes = userBlogs.reduce(
      (sum, blog) => sum + blog.likesCount,
      0,
    );
    const totalViews = userBlogs.reduce((sum, blog) => sum + blog.viewCount, 0);
    const postCount = userBlogs.length;

    res.json({
      success: true,
      data: {
        totalLikes,
        totalViews,
        postCount,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
