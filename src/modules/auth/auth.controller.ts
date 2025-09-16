import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const loginWithEmailAndPassword = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.loginWithEmailAndPassword(req.body);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: (error as Error).message
        });
    }
}

export const AuthController = {
    loginWithEmailAndPassword
}