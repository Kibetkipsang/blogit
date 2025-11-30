import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";

const client = new PrismaClient();

// get categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await client.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json({
      message: "Categories fetched successfully.",
      categories,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

// create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        message: "Category name is required",
      });
      return;
    }

    const existing = await client.category.findUnique({
      where: {
        name,
      },
    });
    if (existing) {
      res.status(400).json({
        message: "category already exists.",
      });
    }
    const newCategory = await client.category.create({
      data: {
        name: name,
      },
    });
    res.status(201).json({
      message: "Category created successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong.Please try again later.",
    });
  }
};

// UPDATE a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Category id is required." });
    }
    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }
    const category = await client.category.update({
      where: { id },
      data: { name },
    });
    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update category" });
  }
};

// DELETE a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Category id is required." });
    }

    const blogs = await client.blog.findMany({ where: { categoryId: id } });
    if (blogs.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with blogs." });
    }

    await client.category.delete({ where: { id } });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
