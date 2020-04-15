import Portal, { PortalInterface } from './portal.model';

import sequelize from '../utilities/db';
import { BuildOptions, DataTypes, Model } from 'sequelize';

export interface RealEstateInterface extends Model {
  title: string;
  link: string;
  price: number;
  area: number;
  buildingStatus: number;
  new: boolean;
  portal: PortalInterface;
  lastSeenAt: number;
  lastPriceChanges: {
    priceBefore: number;
    priceAfter: number;
    changedAt: Date;
    priceChangePercentage: number;
  }[];
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
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
      unique: true,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    starred: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeenAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    lastPriceChanges: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    imagePath: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

RealEstate.belongsTo(Portal);
Portal.hasMany(RealEstate);

export default RealEstate;
