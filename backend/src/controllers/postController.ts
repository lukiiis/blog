import { ObjectId } from 'mongodb';
import { Router, Request, Response } from 'express';
import {
  getAllPosts, 
  getPostById, 
  getPostsByAuthorId, 
  createPostService, 
  updatePostService, 
  deletePostService, 
  getPostsFromCurrentYear,
  getPostsFromCurrentMonth,
  getPostsByCategory,
  getPostsByYearAndMonth,
  getFilteredPosts
} from '../services/postService';
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

router.patch('/posts/:id', verifyLoggedUser, async (req: Request, res: Response) => {
    try {
        const postId = new ObjectId(req.params.id);
        const post = await getPostById(postId);

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        if (post.authorId.toString() !== req.body.authorId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const updatedPost = await updatePostService(postId, req.body);
        if (updatedPost) {
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Failed to update post' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error partially updating post', error });
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

router.get('/posts/current-year', async (req: Request, res: Response) => {
  try {
      const posts = await getPostsFromCurrentYear();
      res.json(posts);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving posts from the current year', error });
  }
});

// Fetch posts from the current month
router.get('/posts/current-month', async (req: Request, res: Response) => {
  try {
      const posts = await getPostsFromCurrentMonth();
      res.json(posts);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving posts from the current month', error });
  }
});

// Fetch posts by category
router.get('/posts/category/:category', async (req: Request, res: Response) => {
  try {
      const { category } = req.params;
      const posts = await getPostsByCategory(category);
      res.json(posts);
  } catch (error) {
      res.status(500).json({ message: `Error retrieving posts for category ${req.params.category}`, error });
  }
});

// Fetch posts by year and month
router.get('/posts/:year/:month', async (req: Request, res: Response) => {
  try {
      const year = parseInt(req.params.year, 10);
      const month = parseInt(req.params.month, 10);

      if (isNaN(year) || isNaN(month)) {
          res.status(400).json({ message: 'Year and month must be valid numbers' });
          return;
      }

      const posts = await getPostsByYearAndMonth(year, month - 1);
      res.json(posts);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving posts by year and month', error });
  }
});

router.get('/posts/filter/:year?/:month?/:category?', async (req: Request, res: Response) => {
  try {
      const year = req.params.year ? parseInt(req.params.year, 10) : undefined;
      const month = req.params.month ? parseInt(req.params.month, 10) - 1 : undefined; // Adjust month for JS
      const category = req.params.category;

      if ((year && isNaN(year)) || (month && (isNaN(month) || month < 0 || month > 11))) {
          res.status(400).json({ message: 'Invalid year or month format' });
          return;
      }

      const posts = await getFilteredPosts(year, month, category);
      res.json(posts);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving filtered posts', error });
  }
});

export default router;
