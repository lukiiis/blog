import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import apiController from "./controllers/controller";
// import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use("/api", apiController);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

// Error handling middleware (must be defined at the end)
// app.use(errorHandler);

export default app;
