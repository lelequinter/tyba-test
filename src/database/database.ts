import { Sequelize } from "sequelize";

//* Conectar la base de datos con variables de entorno
export const database = new Sequelize(
    String(process.env.PG_DB),
    String(process.env.PG_USER),
    String(process.env.PG_PASSWORD),
    {
        host: String(process.env.PG_HOST),
        dialect: 'postgres'
    }
);

//* Crear la extensión uuid-ossp en la base de datos si aún no existe
database.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then( console.log );