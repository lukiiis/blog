import { ObjectId } from 'mongodb';
import { Request, Response, Router } from 'express';
import {
  createPost,
  deletePostService,
  getAllPosts,
  getFilteredPosts,
  getPostById,
  getPostByTitle,
  getPostsByAuthorId,
  getPostsFromCurrentMonth,
  getPostsFromCurrentYear,
  updatePost
} from '../services/postService';
import { verifyLoggedUser } from "../util/middlewares";

const router = Router();

router.get('/posts', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts', error });
    }
});


router.get('/posts/id/:id', async (req, res) => {
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

router.get('/posts/title/:title', async (req: Request, res: Response) => {
  const { title } = req.params;
  
  if (!title) {
    res.status(400).json({ error: "Invalid or missing title parameter" });
    return;
  }
  
  try {
    const post = await getPostByTitle(title);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/posts', verifyLoggedUser, async (req: Request, res: Response) => {
    try {
        const newPost = await createPost(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});

router.put('/posts/:id', verifyLoggedUser, async (req: Request, res: Response) => {
    const postId = new ObjectId(req.params.id);
    const post = await getPostById(postId);

    if(!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // @ts-ignore
    if(post.authorId.toString() !== req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
        const updatedPost = await updatePost(postId, req.body);
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});

router.patch("/posts/:id/name", async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { name } = req.body;
  
  if (!ObjectId.isValid(postId)) {
    res.status(400).json({ error: "Invalid post ID format" });
    return;
  }
  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "Invalid or missing name field" });
    return;
  }
  
  try {
    const updatedPost = await updatePost(new ObjectId(postId), { title: name });
    if (updatedPost) {
      res.status(200).json(updatedPost);
    }
    else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error updating post name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete('/posts/:id', async (req: Request, res: Response) => {

    const postId = new ObjectId(req.params.id);
    const post = await getPostById(postId);
    
    if(!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // @ts-ignore
    if(post.authorId.toString() !== req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
        const deleted = await deletePostService(postId);
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

router.get("/posts/filter", async (req: Request, res: Response) => {
  const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  const month = req.query.month ? parseInt(req.query.month as string, 10) - 1 : undefined;
  const category = req.query.category as string | undefined;
  
  if ((year && isNaN(year)) || (month && (isNaN(month) || month < 0 || month > 11))) {
    res.status(400).json({ message: "Invalid year or month format" });
    return;
  }
  
  try {
    const posts = await getFilteredPosts(year, month, category);
    res.json(posts);
  } catch (error) {
    console.error("Error retrieving filtered posts:", error);
    res.status(500).json({ message: "Error retrieving filtered posts", error });
  }
});

export default router;
