import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// @ts-ignore
const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  logging: false,
  dialectOptions: { decimalNumbers: true },
});

export default sequelize;
