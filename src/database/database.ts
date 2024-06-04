import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log('@PG_DB', String( process.env['PG_DB'] ) );
console.log('@PG_USER', String( process.env['PG_USER'] ) );
console.log('@PG_PASSWORD', String( process.env['PG_PASSWORD'] ) );
console.log('@PG_HOST', String( process.env['PG_HOST'] ) );

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