"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const portal_model_1 = __importDefault(require("../models/portal.model"));
const real_estate_model_1 = __importDefault(require("../models/real-estate.model"));
const sequelize_1 = require("sequelize");
exports.default = {
    getSupportedPortalsAsFilters: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rows = yield portal_model_1.default.findAll({
                where: { active: true },
                order: [['title', 'asc']],
                attributes: {
                    include: [[sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('realEstates.id')), 'realEstatesCount']],
                },
                include: [{ model: real_estate_model_1.default, attributes: [] }],
                group: ['portals.id'],
            });
            res.send(rows);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }),
    addPortal: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const portal = yield portal_model_1.default.create(req.body);
            res.send(portal);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }),
};
