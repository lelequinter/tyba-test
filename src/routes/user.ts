import { Router } from "express";
import UserController from "../controllers/controllers";
import { createRoute, Route } from '../util/router';
import z from "zod";

const userRouter = Router();

//* CRUD Routes /users
const routes: Route[] = [
    {
        router: userRouter,
        path: '/',
        method: 'get',
        needAuth: true,
        handler: UserController.getUsers,
    },
    {
        router: userRouter,
        path: '/:userId',
        method: 'get',
        needAuth: true,
        handler: UserController.getUser,
        validators: {
            pathParams: z.object({
                userId: z.string().uuid()
            })
        }
    },
    {
        router: userRouter,
        path: '/',
        method: 'post',
        needAuth: false,
        handler: UserController.createUser,
    },
    {
        router: userRouter,
        path: '/:userId',
        method: "put",
        needAuth: true,
        handler: UserController.updateUser,
    },
    {
        router: userRouter,
        path: '/:userId',
        method: "delete",
        needAuth: true,
        handler: UserController.deleteUser,
    },
    {
        router: userRouter,
        path: '/login',
        method: "post",
        needAuth: false,
        handler: UserController.loginUser,
        validators: {
            body: z.object({
                email: z.string().email("Invalid email format"),
                password: z.string().min(6, "Password must be at least 8 characters long")
            })
        }
    },
]

routes.forEach( (route: Route) => {
    createRoute( route );
});

export default userRouter;