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
const getAllPosts = async ({ page = 1, limit = 10, search, isFeatured, tags }: { page?: number; limit?: number; search?: string; isFeatured?: boolean; tags?: string[] }) => {
    const skip = (page - 1) * limit;
    console.log({ tags });

    const where: any = {
        AND: [
            search && {
                OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }]
            },
            typeof isFeatured === 'boolean' && { isFeatured },
            tags && tags.length > 0 && { tags: { hasEvery: tags } }
        ].filter(Boolean)
    };

    const result = await prisma.post.findMany({
        skip,
        take: limit,
        where,
        select: {
            id: true,
            title: true,
            content: true,
            thumbnail: true,
            isFeatured: true,
            tags: true,
            views: true,
            authorId: true,
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
                }
            },
            published: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    // return result;

    const totalPosts = await prisma.post.count({ where });
    return {
        data: result,
        pagination: {
            page,
            limit,
            totalPosts,
            totalPages: Math.ceil(result.length / limit) || 1
        },
        meta: {
            page,
            limit,
            total: result.length,
            totalPages: Math.ceil(result.length / limit) || 1,
            hasNextPage: result.length === limit ? true : false,
            hasPrevPage: page > 1,
            nextPage: result.length === limit ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            nextpageLink: result.length === limit ? `/post?page=${page + 1}&limit=${limit}` : null,
            prevPageLink: page > 1 ? '/post?page=${page - 1}&limit=${limit}' : null,
            firstPageLink: `/post?page=1&limit=${limit}`,
            lastPageLink: `/post?page=${Math.ceil(result.length / limit) || 1}&limit=${limit}`,
            search: search || null,
            isFeatured: typeof isFeatured === 'boolean' ? isFeatured : null,
            tags: tags || null,
            requestLink: `/post?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}${typeof isFeatured === 'boolean' ? `&isFeatured=${isFeatured}` : ''}${
                tags && tags.length > 0 ? `&tags=${tags.join(',')}` : ''
            }`,
            requestMethod: 'GET',
            requestBody: null,
            description: 'Get all posts with pagination, search, and filter options',
            usage: 'Use the query parameters to paginate, search, and filter posts'
        }
    };
};

// get post by id from db and increment view count
const getPostById = async (id: number) => {
    // use transaction to ensure both operations are completed successfully
    return await prisma.$transaction(async (tx) => {
        // increment view count
        await tx.post.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        // fetch post details
        return await tx.post.findUnique({
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
                    }
                },
                published: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        }); 
    })
};

// update post by id
const updatePostById = async (id: number, payload: Prisma.postUpdateInput) => {
    const result = await prisma.post.update({
        where: {
            id
        },
        data: payload
    });
};

// detele post by id
const deletePostById = async (id: number) => {
    const result = await prisma.post.delete({
        where: {
            id
        }
    });
};

export const PostService = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById
};
