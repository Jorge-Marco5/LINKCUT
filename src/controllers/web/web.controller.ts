import { Request, Response } from "express";

export const dashboardController = (req: Request, res: Response) => {
    try{
        res.render(`${__dirname}/../../views/index.ejs`);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error al cargar la página"
        });
    }
}

export const loginController = (req: Request, res: Response) => {
    try{
        res.render(`${__dirname}/../../views/auth/login.ejs`);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error al cargar la página"
        });
    }
}

export const signupController = (req: Request, res: Response) => {
    try{
        res.render(`${__dirname}/../../views/auth/signup.ejs`);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error al cargar la página"
        });
    }
}

export const changepasswordController = (req: Request, res: Response) => {
    try{
        res.render(`${__dirname}/../../views/auth/changepassword.ejs`);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error al cargar la página"
        });
    }
}
