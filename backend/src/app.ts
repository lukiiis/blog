import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import apiController from "./controllers/userController";
import postController from "./controllers/postController";
import commentController from "./controllers/commentController";
import likeController from "./controllers/likeController";
import authController from "./controllers/authController";
// import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use("/api", apiController, postController, commentController, likeController, authController);
// app.use("/api", postController);
// app.use("/api", commentController);
// app.use("/api", likeController);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

// Error handling middleware (must be defined at the end)
// app.use(errorHandler);

export default app;
