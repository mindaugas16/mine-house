import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface FavoriteInterface extends Model {
  id: number;
  realEstateId: number;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): FavoriteInterface;
};

const favorite = <ModelStatic>sequelize.define(
  'favorites',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  }
);

export default favorite;
