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
const real_estate_model_1 = __importDefault(require("../models/real-estate.model"));
const portal_model_1 = __importDefault(require("../models/portal.model"));
const downloader_1 = require("../utilities/downloader");
const crypto_js_1 = __importDefault(require("crypto-js"));
const sequelize_1 = require("sequelize");
const SHOW_PER_PAGE = 12;
exports.default = {
    getRealEstates: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page, property, direction, portals, groupBy } = req.query;
            let portalCondition = {};
            let order = [];
            if (portals) {
                portalCondition = { name: portals.split(',') };
            }
            if (groupBy) {
                order.push([groupBy, 'desc']);
            }
            order.push([[property || 'updatedAt', direction || 'desc']]);
            const currentPage = page || 1;
            const { rows, count } = yield real_estate_model_1.default.findAndCountAll({
                order,
                limit: SHOW_PER_PAGE,
                offset: (currentPage - 1) * SHOW_PER_PAGE,
                include: [
                    {
                        model: portal_model_1.default,
                        as: 'portal',
                        where: portalCondition,
                    },
                ],
            });
            const totalPages = Math.ceil(count / SHOW_PER_PAGE) || 1;
            const body = {
                data: rows,
                meta: {
                    totalPages,
                    currentPage,
                    showPerPage: SHOW_PER_PAGE,
                    totalCount: count,
                },
            };
            res.send(body);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }),
    markAsStarred: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { starred } = req.body;
        try {
            yield real_estate_model_1.default.update({ starred }, { where: { id } });
            res.status(204).send();
        }
        catch (err) {
            res.status(400).json(err);
        }
    }),
    markAsSeen: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const [_, rows] = yield real_estate_model_1.default.update({ new: false, lastSeenAt: Date.now() }, { where: { id }, returning: true });
            const [row] = rows;
            res.send(row);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }),
    postRealEstates: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        function runUpdate(item) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const portalLink = definePortalByLink(item.link);
                        const portal = yield portal_model_1.default.findOne({ where: { link: { [sequelize_1.Op.iLike]: `%${portalLink}%` } } });
                        if (!portal) {
                            reject(new Error('Unable to identify portal'));
                            return;
                        }
                        const newItem = Object.assign(Object.assign({}, item), { price: convertToNumber(item.price), area: convertToNumber(item.area), priceChangePercentage: item.priceChangePercentage
                                ? +item.priceChangePercentage
                                    .toString()
                                    .replace(',', '.')
                                    .replace(/[^0-9.\n]/g, '')
                                : null, new: true, portalId: portal.id, createdAt: Date.now() });
                        const foundItem = yield real_estate_model_1.default.findOne({ where: { link: item.link } });
                        if (!foundItem) {
                            if (item.imageUrl) {
                                const filename = crypto_js_1.default.MD5(`${newItem.title}${newItem.createdAt}`);
                                const fileExtension = item.imageUrl.split('.').pop();
                                const imagePath = `images/real-estates/${filename}.${fileExtension}`;
                                downloader_1.download(item.imageUrl, imagePath, () => { });
                                newItem.imagePath = imagePath;
                            }
                            resolve(real_estate_model_1.default.create(newItem));
                            return;
                        }
                        let body = {};
                        if (foundItem.price !== newItem.price) {
                            const priceChangePercentage = +(((foundItem.price - newItem.price) * 100) / foundItem.price).toFixed(2);
                            body = Object.assign(Object.assign({}, body), { price: newItem.price, lastPriceChanges: sequelize_1.Sequelize.fn('array_append', sequelize_1.Sequelize.col('lastPriceChanges'), JSON.stringify({
                                    priceBefore: foundItem.price,
                                    priceAfter: newItem.price,
                                    priceChangePercentage,
                                    changedAt: Date.now(),
                                })) });
                        }
                        if (foundItem.area !== newItem.area) {
                            body = Object.assign(Object.assign({}, body), { area: newItem.area });
                        }
                        if (!Object.keys(body).length) {
                            return resolve();
                        }
                        body = Object.assign(Object.assign({}, body), { updatedAt: Date.now(), lastSeenAt: null });
                        const found = yield real_estate_model_1.default.update(body, { where: { link: item.link } });
                        resolve(found);
                    }
                    catch (err) {
                        res.status(400).json({ err, message: 'something went wrong' });
                    }
                }));
            });
        }
        const realEstates = req.body;
        const promises = [];
        realEstates.forEach(item => promises.push(runUpdate(item)));
        try {
            yield Promise.all(promises);
            res.send({ message: 'Data update successfully' });
        }
        catch (err) {
            res.status(400).json({ err, message: 'something went wrong' });
        }
    }),
};
function definePortalByLink(link) {
    // @TODO: update regex to cover www. and other url cases https://nodejs.org/api/url.html
    const matches = link.replace('www.', '').match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    if (!(matches && matches.length)) {
        throw new Error('Unable identify portal');
    }
    return matches[1];
}
function convertToNumber(value) {
    if (value.indexOf('-') > -1) {
        value = value.split('-')[1];
    }
    if (value.indexOf(',') > -1) {
        value = value.split(',')[0];
    }
    if (value.indexOf('.') > -1) {
        value = value.split('.')[0];
    }
    return +value.replace(/[^0-9\n]/g, '');
}
