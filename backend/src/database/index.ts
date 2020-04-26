import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// @ts-ignore
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  logging: false,
  dialectOptions: { decimalNumbers: true },
});

export default sequelize;
