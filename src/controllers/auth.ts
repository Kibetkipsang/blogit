import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'; 

dotenv.config();
const client = new PrismaClient();    


// register user
export const register = async (req: Request, res: Response) => {
    try{
        // get the body content
        const { firstName, lastName, userName, emailAdress, password } = req.body
        if(!firstName || !lastName || !userName || !emailAdress || !password){
            res.status(400).json({
                message: "All fields are required."
            });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // save user to database
        const user = await client.user.create({
            data: {
                firstName,
                lastName,
                userName,
                emailAdress,
                password : hashedPassword
            }
        });
        res.status(200).json({
            message: "User created successfully."
        });
    }catch(e){
        res.status(500).json({
            message: "Something went wrong. Please try again later."
        })
    }
}
// login

export const login = async function (req: Request, res: Response){
    try{
        // find the user with the credentials
        const {identifier, password} = req.body
        const user = await client.user.findFirst({
            where:{
                OR:[{userName: identifier}, {emailAdress: identifier}]
            }
        });
         console.log(user)
        if(!user){
            return res.status(400).json({
                message: "Wrong login credentials"
            })
        }
        // check password
        const passMatch = await bcrypt.compare(password, user.password)
        if(!passMatch){
            return res.status(400).json({
                message: "wrong login credentials"
            })
        }

        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            emailAdress: user.emailAdress
        }
        // create tokens and save it to a cookie
        const token = jwt.sign(payload, process.env.SECRET_KEY!, {expiresIn: '2h'})
        res.status(200).cookie("authToken", token).json(payload)
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}
// logout

export const logout = async (_req: Request, res: Response) => {
    try{
        res.clearCookie("authToken").status(200).json({
            message: "logged out successfully"
        })
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}