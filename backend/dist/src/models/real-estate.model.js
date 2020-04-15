"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const portal_model_1 = __importDefault(require("./portal.model"));
const db_1 = __importDefault(require("../utilities/db"));
const sequelize_1 = require("sequelize");
const RealEstate = db_1.default.define('realEstates', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: sequelize_1.DataTypes.STRING,
    link: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    area: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    buildingStatus: {
        type: sequelize_1.DataTypes.STRING,
    },
    new: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    starred: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    lastSeenAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    lastPriceChanges: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
        defaultValue: [],
    },
    imagePath: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
}, {
    timestamps: false,
});
RealEstate.belongsTo(portal_model_1.default);
portal_model_1.default.hasMany(RealEstate);
exports.default = RealEstate;
