import { Request, Response } from 'express';
import { UserService } from './user.service';

// create user
const createUser = async (req: Request, res: Response) => {
    try {
        const result = await UserService.createUser(req.body);
        // console.log("User created from controller : ", result)
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result
        });
    } catch (error) {
        // console.log("Error creating user: ", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error
        });
    }
};

// get all users
const getAllFromDB = async (req: Request, res: Response) => {
    try {
        const result = await UserService.getAllFromDB();
        // console.log("Users retrieved from controller : ", result)

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result
        });
    } catch (error) {
        // console.log("Error retrieving users: ", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error
        });
    }
};

// get user by id
const getUserById = async (req: Request, res: Response) => {
    try {
        const result = await UserService.getUserById(Number(req.params.id));

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: error
        });
    }
};

// update user by id
const updateUserById = async (req: Request, res: Response) => {
    try {
        const result = await UserService.updateUserById(Number(req.params.id), req.body);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: error
        });
    }
};

// delete user by id
const deleteUserById = async (req: Request, res: Response) => {
    try {
        const result = await UserService.deleteUserById(Number(req.params.id));
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: error
        });
    }
};

export const UserController = {
    createUser,
    getAllFromDB,
    getUserById,
    updateUserById,
    deleteUserById
};
