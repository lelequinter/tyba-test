import express, { Request, Response, NextFunction } from "express";
import bodyparser from "body-parser";
import userRouter from "./routes/user";
import { ServerError } from "./util/server-error";

const app = express();

//* Set Middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//* Set Headers
app.use((_, res: Response, next: NextFunction) => {
    //! Remove cors problem
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

//* Test Route
app.get('/', (_: Request, res: Response) => {
    res.send('Server is running');
});

//* CRUD Routes
app.use('/users', userRouter);

//* Error Handling
app.use((error: ServerError, _: Request, res: Response): void => {
    const statusCode = error.statusCode || 500;
    const message = error.message;

    res.status(500).json({ statusCode, message: message });
});

//* Run server
app.listen(3000);