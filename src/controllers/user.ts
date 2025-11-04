import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";
import bcrypt from 'bcrypt';
import { request } from "http";
import dotenv from 'dotenv'

const client = new PrismaClient();

// get users
export const getUsers = async (req: Request, res: Response) => {
    try{
        const users = await client.user.findMany({});
        if (!users){
            return res.status(404).json({
                message: "no users found"
            });
        }
        res.status(200).json(users)
        }catch(err){
            res.status(500).json({
                message: "something went wrong"
            });
    }
}
// get users by id
export const getUserById = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const user = await client.user.findFirst({
            where: {
                id: String(id)
            }
        });
        if(!user){
            return res.status(404).json({
                message: "user not found"
            });
        }
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({
            message: "something went wrong please try again later"
        })
    }
}
// create user
export const createUser = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const {firstName, lastName, userName, emailAdress, password} = req.body
        if (!firstName || !lastName || !userName || !password){
            return res.status(400).json({
                message: "all fields are required"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await client.user.create({
            data: {
                firstName,
                lastName,
                userName,
                emailAdress,
                password: hashedPassword
            }
        });
        res.status(200).json({
            message: "Account created successfully"
        })
    }catch(e){
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        })
    }
}
// update user
export const updateUser = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const {firstName, lastName, userName} = req.body
        const updatedUser = await client.user.updateMany({
            where : {
                id: String(id)
            },
            data: {
                firstName: firstName && firstName,
                lastName: lastName && lastName,
                userName: userName && userName
            }
        });
        
        if(!updatedUser){
            res.status(404).json({
                message: "user not found"
            });
        }
        res.status(200).json({
            message: "user updated successfully"
        })
    }catch(e){
        res.status(500).json({
            message: "something went wrong please try again later"
        })
    }
}
// delete user
export const deleteUser = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const deletedUser = await client.user.update({
            where: {
                id: String(id),
                isDeleted: false
            },
            data: {
                isDeleted: true
            }
        });
        if(!deletedUser){
            return res.status(400).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "user deleted successfuly"
        })
    }catch(err){
        res.status(500).json({
            message: "Something went wrong.Please try again later"
        })
    }
}

// change password
export const changePassword = async(req: Request, res: Response) => {
    try{
        // get logged in user
        const userId = req.user.id 
        // get previous and the passord to be
        const {previousPassword, newPassword} = req.body
        if(!previousPassword || !newPassword){
            return res.status(400).json({
                message : "all fields are required"
            });
        }
        if(previousPassword === newPassword){
            return res.status(400).json({
                message: "Old password cannot be same as new password"
            });
        }
        // find the user
        const user = await client.user.findUnique({
            where:{
                id : userId
            }
        });
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        // check if previous password matches the one in the database
        const isLegit = await bcrypt.compare(previousPassword, user.password)
        if(!isLegit){
            return res.status(400).json({
                message: "wrong password"
            });
        }
        
        // hash the new password
        const freshPassword = await bcrypt.hash(newPassword, 10)
        // save to database
        const updatedPassword = await client.user.update({
            where: {
                id: userId
            },
            data: {
                password : freshPassword
            }
        });
        res.status(200).json({
            message: "password updated successfully"
        })
    }catch(e){
        res.status(500).json({
            message: "Something went wrong, please try again later"
        })
    }
}
