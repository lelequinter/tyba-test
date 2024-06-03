import { NextFunction, Request, Response } from "express";
import { ServerError } from "../util/server-error";
import jwt from 'jsonwebtoken';
import { TypeWithKey } from "../util/type-with-key";
import { User } from "../models/user";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //* Get authorization bearer token
        const authorization: string = String( req.get('authorization') );

        if( !( authorization && String(authorization.toLocaleLowerCase().startsWith('bearer')) ) ){
            throw new ServerError('User unauthorized');
        }

        //* Get Token
        const token: string = authorization.split(' ')[1];

        //* Verify token
        const decodedToken = jwt.verify( token, String(process.env['JWT_SECRET']) ) as TypeWithKey<string>;

        //* Get user id
        const userId: string = decodedToken['id'];

        //* Verify if user exists
        const userExists: boolean = Boolean( await User.findOne({ where: {id: userId} }) );

        //* throw error if user doesnt exists
        if( !userExists ){
            throw new ServerError('User does not exist');
        }

        next();

    } catch (error) {
        next(error);
    }
};