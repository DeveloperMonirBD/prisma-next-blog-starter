import { Request, Response } from 'express';
import { PostService } from './post.service';

// create post
const createPost = async (req: Request, res: Response) => {
    try {
        const result = await PostService.createPost(req.body);

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create post',
            error: (error as Error).message
        });
    }
};

// get all posts
const getAllPosts = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = (req.query.search as string) || '';
        const isFeatured = req.query.isFeatured ? req.query.isFeatured === 'true' : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(',') : [];

        const result = await PostService.getAllPosts({ page, limit, search, isFeatured, tags });

        res.status(200).json({
            success: true,
            message: 'Posts retrieved successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve posts',
            error: (error as Error).message
        });
    }
};

// get post by id
const getPostById = async (req: Request, res: Response) => {
    try {
        const result = await PostService.getPostById(Number(req.params.id));

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Post retrieved successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve posts',
            error: (error as Error).message
        });
    }
};

// update post by id
const updatePostById = async (req: Request, res: Response) => {
    try {
        const result = await PostService.updatePostById(Number(req.params.id), req.body);

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update post',
            error: (error as Error).message
        });
    }
};

// delete post by id
const deletePostById = async (req: Request, res: Response) => {
    try {
        const result = await PostService.deletePostById(Number(req.params.id));
        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete post',
            error: (error as Error).message
        });
    }
};

export const PostController = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById
};
