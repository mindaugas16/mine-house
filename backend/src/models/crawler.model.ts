import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database';

enum RealEstateTypes {
  'HOUSE' = 'house',
  'APARTMENT' = 'apartment',
}

export interface CrawlerInterface extends Model {
  id: number;
  name: string;
  realEstateType: RealEstateTypes;
  priceMin?: number;
  priceMax?: number;
  roomsMin?: number;
  roomsMax?: number;
  areaMin?: number;
  areaMax?: number;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): CrawlerInterface;
};

const crawler = <ModelStatic>sequelize.define('crawlers', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  priceMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  priceMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  realEstateType: {
    type: DataTypes.ENUM(RealEstateTypes.HOUSE, RealEstateTypes.APARTMENT),
    allowNull: false,
  },
  roomsMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  roomsMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  areaMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  areaMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default crawler;
