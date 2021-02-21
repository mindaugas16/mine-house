import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface PriceInterface extends Model {
  id: number;
  price: number;
  realEstateId: number;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PriceInterface;
};

const Price = <ModelStatic>sequelize.define(
  'priceChanges',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Price;
