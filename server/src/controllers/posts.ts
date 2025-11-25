import { PrismaClient } from '@prisma/client';
import { createDecipheriv } from 'crypto';
import { type Request, type Response } from 'express';

const client = new PrismaClient();

// create blogs
export const createBlog = async(req: Request, res: Response) => {
    try{
        const userId = req.user?.id
        // if (!userId) {
        //   return res.status(401).json({ message: "Unauthorized. Please log in." });
        // }

        const { title, synopsis, featuredImageUrl, content } = req.body
        if (!title || !synopsis || !featuredImageUrl || !content){
            res.status(400).json({
                message: "All fields are required"
            });
            return;
        }
        // check if title already exists
        const existingBlog = await client.blog.findFirst({
            where: {
                title: title
            }
        });
        if (existingBlog){
            return  res.status(409).json({
                message: "Blog with this title already exists"
            });
        }

        const blog = await client.blog.create({
            data: {
                title,
                synopsis,
                featuredImageUrl,
                content,
                user: {connect: {id: String(userId)}}
            }
        });
        
        
        res.status(200).json({
            message: "Blog created successfully."
        })
    }catch(err){
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        })
    }
}
// get blogs
export const getBlog = async(req: Request, res: Response) => {
    try{
        const blogs = await client.blog.findMany({
            where:{
                isDeleted: false,
            },
            select: {
                    id:true,
                    title: true,
                    synopsis: true,
                    featuredImageUrl: true,
                    content: true
                },
            orderBy: {
                createdAt: 'desc'
            }
        })
        if (!blogs){
            return res.status(404).json({
                message: "No blogs found"
            });
        }
       
        res.status(200).json(blogs)
    }catch(err){
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        })
    }
}
// get blog by id
export const getBlogById = async(req: Request, res: Response) => {
    try{
        const {id} = req.params
        if(!id){
            return res.status(400).json({
                message: "Blog id is required"
            });
        }

        const blog = await client.blog.findFirst({
            where: {
                AND: [{id: String(id)}, {isDeleted: false}]
            }
        });
        if (!blog){
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        res.status(200).json(blog)
    }catch(err){
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        })
    }
}
// update a blog
export const updateBlog = async(req: Request, res: Response) => {
    try{
        const {id} = req.params
        const userId = req.user?.id
        const { title, synopsis, featuredImageUrl, content } = req.body
        const updatedBlog = await client.blog.updateMany({
            where: {
                AND: [{id : String(id)}, {userId: String(userId)}]
            },
            data: {
                title: title && title,
                synopsis: synopsis && synopsis,
                featuredImageUrl: featuredImageUrl && featuredImageUrl,
                content: content && content
            }
        });
        // check if blog was updated
        if (updatedBlog.count === 0){
            return res.status(404).json({
                message: "Update details to be changed."
            });
        }
        res.status(200).json({
            message: "Blog updated successfully"
        })
    }catch(err){
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        })
    }
}
// move blog to trash
export const trashBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Blog id is required."
            });
        }

        // Check if blog exists and is not deleted
        const existingBlog = await client.blog.findMany({
            where: {
                AND: [
                    { id: String(id) },
                    { isDeleted: false } // Looking for active blogs
                ]
            }
        });
        // check if any blog was found
        if (existingBlog.length === 0) {
            // Check why blog wasn't found
            const anyBlog = await client.blog.findFirst({
                where: { id: String(id) }
            });
            
            if (!anyBlog) {
                return res.status(404).json({
                    message: "Blog not found"
                });
            } else {
                return res.status(400).json({
                    message: "Blog is already in trash."
                });
            }
        }

        // move blog to trash
        const trashedBlog = await client.blog.update({
            where: {
                id: String(id)
            },
            data: {
                isDeleted: true
            }
        });
        
        res.status(200).json({
            message: "Blog successfully moved to trash."
        });
    } catch (err) {
        console.error("Error trashing blog:", err);
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        });
    }
}
// restore blog from trash
export const restoreTrash = async(req: Request, res: Response) => {
    try{
        const {id} = req.params
        if (!id) {
            return res.status(400).json({
                message: "Blog id is required."
            });
        }
        // check if trash already resored
        const inTrash = await client.blog.findMany({
            where: {
                AND: [{id: String(id)}, {isDeleted: true}]
            }
        });
        if (inTrash.length === 0) {
            const blog = await client.blog.findFirst({
                where: {id: String(id)}
            });
            if(!blog){
                return res.status(404).json({
                    message: "Blog not found"
                });
            }else{
                res.status(200).json({
                    message: "Blog already restored"
                });
            }
        }
        const trashedBlog = await client.blog.update({
            where: {
                id: String(id)
            },
            data:{
                isDeleted: false
            }
        });
        res.status(200).json({
            message: "Blog restored successfully.",
            blog: trashedBlog
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        })
    }
}

// get trashed  blogs
// export const getTrashedBlogs = async(req: Request, res: Response) => {
//     try{
//         const trashedBlogs = await client.blog.findMany({
//             where: {
//                 isDeleted: true
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             }
//         });
//         if (trashedBlogs.length === 0){
//             return res.status(404).json({
//                 message: "No trashed blogs found."
//             })
//         }
//         res.status(200).json(trashedBlogs)
//     }catch(err){
//         res.status(500).json({
//             message: "Something went wrong. Please try again later."
//         })
//     }
// }
// permanent delete 
export const deletePermanently = async(req: Request, res: Response) => {
    try{
        const {id} = req.params
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please log in."
            });
        }
        // check if blog exists
        const existing = await client.blog.findMany({
            where: {
                AND: [{id: String(id)}, {userId: String(userId)}]
            }
        });
        if(existing.length === 0){
            return res.status(404).json({
                message: "Blog not found."
            })
        }
        const deletedBlog = await client.blog.deleteMany({
            where: {
                AND: [{id: String(id)}, {userId: String(userId)}]
            }
        });
        res.status(200).json({
            message: "Blog deleted successfully."
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        })
    }
}