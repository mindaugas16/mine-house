import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB_NAME as string,
  process.env.POSTGRES_DB_USERNAME as string,
  process.env.POSTGRES_DB_PASSWORD as string,
  {
    dialect: 'postgres',
    host: process.env.POSTGRES_DB_HOST,
    logging: false,
    dialectOptions: { decimalNumbers: true },
  }
);

export default sequelize;
