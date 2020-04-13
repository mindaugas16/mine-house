import Portal, { PortalInterface } from './portal.model';

import sequelize from '../utilities/db';
import { BuildOptions, DataTypes, Model } from 'sequelize';

export interface RealEstateInterface extends Model {
  title: string;
  link: string;
  price: number;
  area: number;
  buildingStatus: number;
  priceChange: number;
  priceChangePercentage: number;
  new: boolean;
  portal: PortalInterface;
  lastSeenAt: number;
  lastPriceChanges: {
    priceChangeFrom: number;
    priceChangeTo: number;
    changedAt: Date;
  }[];
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RealEstateInterface;
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
    priceChange: {
      type: DataTypes.INTEGER,
    },
    priceChangePercentage: {
      type: DataTypes.DECIMAL(10, 2),
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
      type: DataTypes.ARRAY(DataTypes.INTEGER),
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
