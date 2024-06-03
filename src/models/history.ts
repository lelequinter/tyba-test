import { database } from "../database/database";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import { User } from "./user";

export interface IHistory {
    id: string;
    userId: string;
    longitude: number;
    latitude: number;
    ciudad: string;
    name: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

  //* Definir las propiedades (columnas) del modelo del usuario (User)
    export class History extends Model<
    InferAttributes<History, { }>,
    InferCreationAttributes<History, { omit: 'id' }>
    > {
        declare id: string;
        declare userId: string;
        declare longitude: number;
        declare latitude: number;
        declare ciudad: string;
        declare name: string;
        declare address: string;
        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;
    }

    // * Inicializar el modelo User
    History.init(
        {
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: DataTypes.UUID,
            longitude: DataTypes.FLOAT,
            latitude: DataTypes.FLOAT,
            ciudad: DataTypes.STRING,
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
        tableName: "history",
        sequelize: database, // passing the `sequelize` instance is required
        }
    );

    History.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(History, { foreignKey: 'userId', as: 'history' });

    //*Sincroniza el modelo con la base de datos.
    History.sync({ alter: true }).then( console.log );