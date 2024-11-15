import { ObjectId } from 'mongodb';
import { Router, Request, Response } from 'express';
import {getAllPosts, getPostById, getPostsByAuthorId, createPostService, updatePostService, deletePostService} from '../services/postService';
import { verifyLoggedUser, verifyAdmin } from "../util/middlewares";

const router = Router();


router.get('/posts', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts', error });
    }
});


router.get('/posts/:id', async (req, res) => {
    try {
        const post = await getPostsByAuthorId(new ObjectId(req.params.id));
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving post', error });
    }
});


router.post('/posts', verifyLoggedUser, async (req: Request, res: Response) => {
    try {
        const newPost = await createPostService(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});

router.put('/posts/:id', verifyLoggedUser, async (req: Request, res: Response) => {
    try {
        const postId = new ObjectId(req.params.id);
        const post = await getPostById(postId);

        if(!post) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }

        if(post.authorId.toString() !== req.params.authorId) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const updatedPost = await updatePostService(new ObjectId(req.params.id), req.body);
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});

router.delete('/posts/:id',verifyLoggedUser, async (req: Request, res: Response) => {
    try {

        const postId = new ObjectId(req.params.id);
        const post = await getPostById(postId);
        
        if(!post) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }

        if(post.authorId.toString() !== req.params.authorId) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const deleted = await deletePostService(new ObjectId(req.params.id));
        if (deleted) {
          res.status(204).send();
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});

export default router;
