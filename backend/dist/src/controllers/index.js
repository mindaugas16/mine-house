"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const real_estate_controller_1 = __importDefault(require("./real-estate.controller"));
exports.RealEstateController = real_estate_controller_1.default;
const crawler_controller_1 = __importDefault(require("./crawler.controller"));
exports.CrawlerController = crawler_controller_1.default;
const portal_controller_1 = __importDefault(require("./portal.controller"));
exports.PortalController = portal_controller_1.default;
