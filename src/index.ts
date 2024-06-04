import dotenvflow from 'dotenv-flow'
dotenvflow.config()

import express, { Request, Response, NextFunction } from "express";
import bodyparser from "body-parser";
import { ServerError } from "./util/server-error";
import userRouter from "./routes/user";
import restaurantRouter from "./routes/restaurants";

// agregar el campo 'userId' para poder guardar el id del usuario que llega en el jwt
declare global {
    namespace Express {
    interface Request {
        userId: string,
        token: string
    }
    }
}

export const app = express();

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
app.use('/restaurants', restaurantRouter);

//* Error Handling
app.use((error: ServerError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = error.statusCode || 500;
    const message = error.message;

    res.status(500).json({ statusCode, message: message });
    next();
});

//* Run server
export const server = app.listen(3000);