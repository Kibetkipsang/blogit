import { type Request, type Response, type NextFunction} from "express";

export function checkUserDetails (req: Request, res:Response, next: NextFunction){
    const {firstName, lastName, userName, emailAdress, password} = req.body
    if(!firstName){
        return res.status(400).json({
            message: "Please provide your first name."
        })
    }
    if(!lastName){
        return res.status(400).json({
            message: "Please provide your last name."
        })
    }
    if(!userName){
        return res.status(400).json({
            message: "Please provide your username."
        })
    }
    if(!emailAdress){
        return res.status(400).json({
            message: "Please provide your Email Adress."
        })
    }
    if(!password){
        return res.status(400).json({
            message: "Please provide your password."
        })
    }
    next()
}