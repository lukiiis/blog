import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import apiController from "./controllers/userController";
import postController from "./controllers/postController";
import commentController from "./controllers/commentController";
import likeController from "./controllers/likeController";
import authController from "./controllers/authController";

const app: Application = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from frontend server

app.use("/api", apiController, postController, commentController, likeController, authController);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

export default app;