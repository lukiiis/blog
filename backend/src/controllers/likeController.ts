import { ObjectId } from 'mongodb';
import { Router, Request, Response } from 'express';
import { createLikeService, deleteLikeService, getLikesByPostId, getLikesByUserId, getLikeById } from '../services/likeService';
import { verifyLoggedUser } from '../util/middlewares';

const router = Router();

router.get('/likes/post/:postId', async (req: Request, res: Response) => {
    try {
        const postId = new ObjectId(req.params.postId);
        const likes = await getLikesByPostId(postId);
        res.json(likes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving likes by post ID', error });
    }
});

router.get('/likes/user/:userId', async (req: Request, res: Response) => {
    try {
        const userId = new ObjectId(req.params.userId);
        const likes = await getLikesByUserId(userId);
        res.json(likes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving likes by user ID', error });
    }
});

router.post('/likes', verifyLoggedUser, async (req: Request, res: Response) => {
    try {
        const newLike = await createLikeService(req.body);
        res.status(201).json(newLike);
    } catch (error) {
        res.status(500).json({ message: 'Error creating like', error });
    }
});

router.delete('/likes/:id', verifyLoggedUser, async (req: Request, res: Response) => {
    try {
        const likeId = new ObjectId(req.params.id);
        const like = await getLikeById(likeId);

        if (!like) {
            res.status(404).json({ message: 'Like not found' });
            return
        }

        // @ts-ignore
        if (like.userId.toString() !== req.user.id) {
            res.status(403).json({ message: 'Unauthorized to delete this like' });
            return
        }

        const deleted = await deleteLikeService(likeId);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Like not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting like', error });
    }
});

export default router;
