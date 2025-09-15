import { Prisma, User } from '@prisma/client';
import { prisma } from '../../config/db';

// create user
const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
    console.log('Creating user', payload);

    const createdUser = await prisma.user.create({
        data: payload
    });
    return createdUser;
};

// get all users from db
const getAllFromDB = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            pictures: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            posts: true
        },
        orderBy: {
            createdAt: 'desc'
        }
        // include: {
        //     posts: true
        // }
    });
    return result;
};

// get user by id from db
const getUserById = async (id: number) => {
    const result = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            pictures: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            posts: true
        }
    });
    return result;
};

// update user by id
const updateUserById = async (id: number, payload: Prisma.UserUpdateInput) => {
    const result = await prisma.user.update({
        where: {
            id
        },
        data: payload
    });

    return result;
};

// delete user by id
const deleteUserById = async (id: number) => {
    const result = await prisma.user.delete({
        where: {
            id
        }
    });
};

export const UserService = {
    createUser,
    getAllFromDB,
    getUserById,
    updateUserById,
    deleteUserById
};
