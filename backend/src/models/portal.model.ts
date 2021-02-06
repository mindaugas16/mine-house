import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface PortalInterface extends Model {
  id: number;
  title: string;
  link: string;
  realEstatesCount?: number;
  imagePath: string;
  active: boolean;
  name: string;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PortalInterface;
};

const portal = <ModelStatic>sequelize.define('portals', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  link: {
    type: DataTypes.STRING,
    unique: true,
  },
  imagePath: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default portal;
