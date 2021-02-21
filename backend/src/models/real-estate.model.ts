import Portal, { PortalInterface } from './portal.model';
import Crawler, { CrawlerInterface } from './crawler.model';
import Price, { PriceInterface } from './price.model';
import Favorite from './favorite.model';

import sequelize from '../database';
import { BuildOptions, DataTypes, Model } from 'sequelize';

export interface RealEstateResponseBody {
  area: string;
  buildingStatus: string;
  imageUrl: string;
  link: string;
  title: string;
  price: string;
  crawlerId: number;
}

export interface RealEstateInterface extends Model {
  id: number;
  title: string;
  link: string;
  area: number;
  buildingStatus: number;
  new: boolean;
  portal: PortalInterface;
  lastSeenAt: number;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
  crawler: CrawlerInterface;
  price: number;
  priceChanges: PriceInterface[];
  favorite: boolean;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RealEstateInterface;
  getDataValue(key: any): any;
};

const RealEstate = <ModelStatic>sequelize.define(
  'realEstates',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniqueRealEstate',
    },
    area: {
      type: DataTypes.INTEGER,
    },
    buildingStatus: {
      type: DataTypes.STRING,
    },
    new: {
      type: DataTypes.BOOLEAN,
    },
    lastSeenAt: {
      type: DataTypes.DATE,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    crawlerId: {
      type: DataTypes.INTEGER,
      unique: 'uniqueRealEstate',
    },
  },
  {
    timestamps: false,
  }
);

RealEstate.belongsTo(Portal);
Portal.hasMany(RealEstate);

RealEstate.belongsTo(Crawler, { onDelete: 'cascade' });
Crawler.hasMany(RealEstate, { onDelete: 'cascade' });

Price.belongsTo(RealEstate, { onDelete: 'cascade' });
RealEstate.hasMany(Price, { onDelete: 'cascade' });

Favorite.belongsTo(RealEstate, { onDelete: 'cascade' });
RealEstate.hasOne(Favorite, { onDelete: 'cascade' });

export default RealEstate;
