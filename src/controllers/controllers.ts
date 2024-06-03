import { User } from "../models/user";
import { Request, Response } from "express";
import { encryptPassword } from '../util/encrypt';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

//? CRUD Controllers
//* Get all users
const getUsers = async (_: Request, res: Response) => {
    try {
        //* Recupera de la base de datos todos los registros de la tabla Users
        const users = await User.findAll();

        //* Responde en el servicio los registros de la tabla Users
        res.status(200).json({ users: users });
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500); 
    }
};

//* Get user by id
const getUser = async (req: Request, res: Response) => {
    //* Desestrucuramos el id del usuario
    const { userId } = req.params;
    
    try {
        //* Buscar usuario por su id en la tabla Users
        const user = await User.findByPk( userId );

        //* Si no se encuentra el usuario
        if( !user ){
            return res.status(404).json({ message: 'User not found' });
        }

        //* Responde en el servicio el usuario encontrado con ese ID
        res.status(200).json({ user: user });
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500);
    }
};

//* Create user 
const createUser = async (req: Request, res: Response) => {
    //* Desestructurar del body de la request los datos del usuario
    const { name, email, password: rawPassword } = req.body;

    try {
        //* Crear en la tabla un nuevo registro User ( se encipta la contraseña en el momento de la creacion )
        const newUser = await User.create({ 
            name,
            email,
            password: await encryptPassword(rawPassword),
            })

        //* Se responde en el servicio el User creado pero se omite informacion sensible
        res.status(201).json({
            message: 'User created successfully!',
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500);
    }
};

//* Update user
const updateUser = async (req: Request, res: Response) => {
    //* Desestructurar de params y body de la request los datos del usuario
    const { userId } = req.params;
    const { name: updatedName, email: updatedEmail } = req.body;
    
    try {
        //* Buscamos el User en la tabla para asegurarnos que existe
        const user  = await User.findByPk(userId);

        //* Si no existe el User se responde en error en el servicio
        if( !user ){
            return res.status(404).json({ message: 'User not found' });
        }

        //* Actualizamos el modelo con los datos nuevos
        user.name = updatedName;
        user.email = updatedEmail;
        
        //* Actualizamos el registro en base de datos
        const updatedUser = await user.save();

        //* Se responde en el servicio el User actualizado pero se omite informacion sensible
        res.status(200).json({ 
            message: 'User updated',
            user: {
                name: updatedUser.name,
                email: updatedUser.email
            }
        })
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500);
    }
};

//* Delete User
const deleteUser = async (req: Request, res: Response) => {
    //* Desestrucuramos el id del usuario
    const { userId } = req.params;
    
    try {
        //* Buscamos el User en la tabla para asegurarnos que existe
        const deletedUser = await User.findByPk(userId);

        //* Si no existe el User se responde en error en el servicio
        if( !deletedUser ){
            return res.status(404).json({ message: 'User not found' });
        }

        //* Eliminamos el User de la tabla Users
        await User.destroy({
            where: {
                id: userId
            }
        });

        //* El servicio responde que el usuario ha sido eliminado
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500);
    }
};


const loginUser = async (req: Request, res: Response) => {
    //* Desestructurar del body de la request los datos del usuario
    const { email, password } = req.body;

    try {        
        //* Buscamos el User en la tabla para asegurarnos que existe
        const user = await User.findOne({ where: { email } });

        //* Se comprueba que la contraseña enviada en la peticion sea equivalente a la contraseña enciptada en la tabla
        const matchPassword = await bcrypt.compare(password, user?.password || '');

        //* Si no se encuentra el usuario o no coincide la contraseña se responde un error
        if( !user || !matchPassword ){
            return res.status(404).json({ message: 'Invalid user or password' });
        }

        //* Generar JWT con el userId e email, el token expira en 2 horas
        const token = jwt.sign( {id: user.id, email}, String(process.env['JWT_SECRET']), { expiresIn: '2h' } );

        //* El servicio responde informacion necesaria para el cliente (front-end)
        res.status(200).json({ user: { email, name: user.name }, token });
    } catch (error) {
        console.log(error);
        //* Envia un estado de error si la peticion falla
        return res.sendStatus(500);
    }
}

export default { getUsers, getUser, createUser, updateUser, deleteUser, loginUser };