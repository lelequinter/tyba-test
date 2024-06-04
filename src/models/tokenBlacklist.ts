import { database } from "../database/database";
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import { User } from "./user";


  //* Definir las propiedades (columnas) del modelo del usuario (User)
    export class TokenBlacklist extends Model<
    InferAttributes<TokenBlacklist, { }>,
    InferCreationAttributes<TokenBlacklist>
    > {
        declare token: string;
        declare userId: string;
        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;
    }

    // * Inicializar el modelo User
    TokenBlacklist.init(
        {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        userId: DataTypes.UUID,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        },
        {
        tableName: "token_blacklist",
        sequelize: database, // passing the `sequelize` instance is required
        }
    );

    TokenBlacklist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(TokenBlacklist, { foreignKey: 'userId', as: 'blacklistTokens' });

    //*Sincroniza el modelo con la base de datos.
    TokenBlacklist.sync({ alter: true }).then( console.log );