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

// get blog stats
const getBlogStats = async () => {
    return await prisma.$transaction(async (tx) => {
        const aggregates = await tx.post.aggregate({
            _count: true,
            _sum: { views: true },
            _avg: { views: true },
            _min: { views: true },
            _max: { views: true }
        });

        // get featured post count
        const featuredCount = await tx.post.count({
            where: {
                isFeatured: true
            }
        });

        // get most viewed featured post
        const topFeatured = await tx.post.findFirst({
            where: {
                isFeatured: true
            },
            orderBy: {
                views: 'desc'
            }
        });

        // Last week post count
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const lastWeekPostCount = await tx.post.count({
            where: {
                createdAt: {
                    gte: lastWeek
                }
            }
        })


        return {
            stats: {
                totalPosts: aggregates._count,
                totalViews: aggregates._sum.views || 0,
                avgViews: aggregates._avg.views || 0,
                minViews: aggregates._min.views || 0,
                maxViews: aggregates._max.views || 0
            },
            featuredPosts: {
                count: featuredCount,
                topPost: topFeatured
            },
            // topFeaturedPost: {
            //     id: topFeatured?.id || null,
            //     title: topFeatured?.title || null,
            //     views: topFeatured?.views || null,
            //     authorId: topFeatured?.authorId || null,
            //     isFeatured: topFeatured?.isFeatured || null,
            //     createdAt: topFeatured?.createdAt || null,
            //     updatedAt: topFeatured?.updatedAt || null,
            //     deletedAt: topFeatured?.deletedAt || null,
            //     thumbnail: topFeatured?.thumbnail || null,
            //     tags: topFeatured?.tags || null,
            //     published: topFeatured?.published || null,
            //     content: topFeatured?.content || null,
            //     requestLink: topFeatured ? `/post/${topFeatured.id}` : null,
            //     requestMethod: topFeatured ? 'GET' : null,
            //     description: topFeatured ? 'Get the most viewed featured post' : 'No featured posts found',
            //     usage: topFeatured ? 'Use the requestLink to get the details of the most viewed featured post' : 'No featured posts found',
            // },

            lastWeekPostCount
        };
    })
}

export const PostService = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
    getBlogStats
};
