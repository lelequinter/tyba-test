import { database } from "../database/database";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";


  //* Definir las propiedades (columnas) del modelo del usuario (User)
    export class User extends Model<
    InferAttributes<User, { }>,
    InferCreationAttributes<User, { omit: 'id' }>
    > {
        declare id: string;
        declare name: string;
        declare email: string;
        declare password: string;
    
        declare createdAt: CreationOptional<Date>;
    
        declare updatedAt: CreationOptional<Date>;
    }

    // * Inicializar el modelo User
    User.init(
        {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        },
        {
        tableName: "users",
        sequelize: database, // passing the `sequelize` instance is required
        }
    );

    //*Sincroniza el modelo con la base de datos.
    User.sync({ alter: true }).then( console.log );