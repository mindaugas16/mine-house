"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const fs_1 = __importDefault(require("fs"));
function download(uri, filePath, callback) {
    request_1.default.head(uri, (err, res, body) => {
        const writeStream = fs_1.default.createWriteStream(`${__dirname}/../assets/${filePath}`);
        request_1.default(uri).pipe(writeStream).on('close', callback);
    });
}
exports.download = download;
