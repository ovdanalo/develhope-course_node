"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const client_1 = __importDefault(require("../lib/prisma/client"));
const validation_1 = require("../lib/validation");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/planets', async (req, res) => {
    const planets = await client_1.default.planet.findMany();
    res.json(planets);
});
app.post('/planets', (0, validation_1.validate)({ body: validation_1.planetSchema }), async (req, res) => {
    const planetData = req.body;
    const planet = await client_1.default.planet.create({
        data: planetData
    });
    res.status(201).json(planet);
});
app.use(validation_1.validationErrorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map