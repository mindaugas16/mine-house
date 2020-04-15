"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const real_estate_route_1 = __importDefault(require("./real-estate.route"));
const portal_route_1 = __importDefault(require("./portal.route"));
const controllers_1 = require("../controllers");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
router.use('/real-estates', real_estate_route_1.default);
router.use('/portals', portal_route_1.default);
router.use('/assets/images', express_1.default.static(path_1.default.join(__dirname, '../assets/images')));
router.post('/run-crawler', controllers_1.CrawlerController.run);
exports.default = router;
