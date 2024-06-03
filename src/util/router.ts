import { NextFunction, RequestHandler, Router, Response, Request } from "express";
import { isAuthenticated } from "../middleware/is-authenticated";
import { ZodError, ZodSchema } from "zod";

//* Middleware de validación
const validate = (schema: ZodSchema, payload: 'body'|'params'|'query') => (req: Request, res: Response, next: NextFunction) => {
    try {
        //* Validar si el objeto de usuario cumple con el esquema enviado
        schema.parse(req[payload]);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
            status: 'error',
            errors: error.errors
            });
        }
        next(error);
    }
};

  //* Generador de rutas
export const createRoute = (options: Route): void => {

    const { router, path, method, handler, needAuth, validators } = options;

    const handlers: RequestHandler[] = [];

    if( needAuth ){
        handlers.push(isAuthenticated);
    }

    if( validators?.body ){
        handlers.push( validate( validators.body, 'body' ) );
    }

    if( validators?.pathParams ){
        handlers.push( validate( validators.pathParams, 'params' ) );
    }

    if( validators?.queryParams ){
        handlers.push( validate( validators.queryParams, 'query' ) );
    }

    handlers.push(handler);

    router[method](path, ...handlers );

}

export interface Route { router: Router, path: string, method: Method, handler: RequestHandler, needAuth: boolean, validators?: { body?: any, pathParams?: any, queryParams?: any } }

type Method = 'get' | 'put' | 'post' | 'delete';