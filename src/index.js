"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_2.default)();
const PORT = 3000;
const router = (0, express_1.Router)();
const corsOption = {
    // origin: [], 
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"]
};
app.use(express_2.default.json());
app.use((0, cors_1.default)(corsOption));
app.use('/api', index_1.default);
app.use(express_2.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Welcome to your backend API!');
});
app.listen(PORT, (error) => {
    if (error) {
        console.error("Error occurred, server can't start:", error);
    }
    else {
        console.log(`Server is Successfully Running, and App is listening on port ${PORT}`);
    }
});
exports.default = router;
