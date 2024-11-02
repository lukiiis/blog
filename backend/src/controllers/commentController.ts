import { ObjectId } from 'mongodb';
import { Router, Request, Response } from 'express';
import {getCommentsByAuthorId, getCommentsByPostId, getCommentById, createCommentService, updateCommentService, deleteCommentService} from '../services/commentService';

const router = Router();

// nie potrzebne ale moze sie przyda

// router.get('/comments', async (req, res) => {
//     try {
//         const comments = await getAllComments();
//         res.json(comments);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving comments', error });
//     }
// });

router.get('/comments/author/:authorId', async (req: Request, res: Response) => {
    try {
        const authorId = new ObjectId(req.params.authorId);
        const comments = await getCommentsByAuthorId(authorId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments by author ID', error });
    }
});

router.get('/comments/post/:postId', async (req: Request, res: Response) => {
    try {
        const postId = new ObjectId(req.params.postId);
        const comments = await getCommentsByPostId(postId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments by post ID', error });
    }
});

router.get('/comments/:id', async (req: Request, res: Response) => {
    try {
        const commentId = new ObjectId(req.params.id);
        const comment = await getCommentById(commentId);
        if (comment) {
            res.json(comment);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comment', error });
    }
});

router.post('/comments', async (req: Request, res: Response) => {
    try {
        const newComment = await createCommentService(req.body);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error });
    }
});

router.put('/comments/:id', async (req: Request, res: Response) => {
    try {
        const commentId = new ObjectId(req.params.id);
        const updatedComment = await updateCommentService(commentId, req.body);
        if (updatedComment) {
            res.json(updatedComment);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
});

router.delete('/comments/:id', async (req: Request, res: Response) => {
    try {
        const commentId = new ObjectId(req.params.id);
        const deleted = await deleteCommentService(commentId);
        if (deleted) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
});

export default router;
