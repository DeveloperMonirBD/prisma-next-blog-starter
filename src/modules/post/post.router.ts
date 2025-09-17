import express from 'express';
import { PostController } from './post.controller';

const router = express.Router();
router.get("/stats", PostController.getBlogStats);

router.post('/', PostController.createPost);
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.put('/:id', PostController.updatePostById);
router.delete('/:id', PostController.deletePostById);

export const postRouter = router;
