"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("./middleware/cors"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = __importDefault(require("./utilities/db"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(cors_1.default);
app.use(error_handler_1.default);
app.use('/api', routes_1.default);
db_1.default
    // .sync({ force: true })
    .sync()
    // .authenticate()
    .then(() => {
    const server = http_1.default.createServer(app);
    server.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port', server.address().port);
    });
})
    .catch((error) => {
    throw error;
});
