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
    //* Desestructurar de options los parametros eviados en la peticion
    const { router, path, method, handler, needAuth, validators } = options;

    //* arreglo de handlers dinamico para setear dependiendo del cuerpo de la peticion
    const handlers: RequestHandler[] = [];

    //* Pushear isAuthenticated handler si el endpoint lo necesita
    if( needAuth ){
        handlers.push(isAuthenticated);
    }

    //* Pushear handler validate depediendo del cuerpo de la peticion
    if( validators?.body ){
        handlers.push( validate( validators.body, 'body' ) );
    }

    if( validators?.pathParams ){
        handlers.push( validate( validators.pathParams, 'params' ) );
    }

    if( validators?.queryParams ){
        handlers.push( validate( validators.queryParams, 'query' ) );
    }

    //* Pushear el handler Controller
    handlers.push(handler);

    //* Crear el router method con su respectivo path y stream de handlers
    router[method](path, ...handlers );
}

export interface Route { router: Router, path: string, method: Method, handler: RequestHandler, needAuth: boolean, validators?: { body?: any, pathParams?: any, queryParams?: any } }

type Method = 'get' | 'put' | 'post' | 'delete';