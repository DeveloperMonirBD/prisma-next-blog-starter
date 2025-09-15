import { post, Prisma } from '@prisma/client';
import { prisma } from '../../config/db';

// create post
const createPost = async (payload: Prisma.postCreateInput): Promise<post> => {
    const result = await prisma.post.create({
        data: payload,
        include: {
            author: {
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
                    deletedAt: true
                    // posts: true
                }
            }
        }
    });

    return result;
};

// get all posts from db
const getAllPosts = async () => {
    const result = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            thumbnail: true,
            isFeatured: true,
            tags: true,
            views: true,
            authorId: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return result;
};

// get post by id from db
const getPostById = async (id: number) => {
    const result = await prisma.post.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            content: true,
            thumbnail: true,
            isFeatured: true,
            tags: true,
            views: true,
            authorId: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true
        }
    });

    return result;
}

// update post by id
const updatePostById = async (id: number, payload: Prisma.postUpdateInput) => {
    const result = await prisma.post.update({
        where: {
            id
        },
        data: payload
    })
}

// detele post by id
const deletePostById = async (id: number) => {
    const result = await prisma.post.delete({
        where: {
            id
        }
    })
}

export const PostService = {
    createPost,
    getAllPosts,
    getPostById, 
    updatePostById,
    deletePostById
};
