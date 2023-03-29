"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../../lib/prisma/client"));
const validation_1 = require("../../lib/middleware/validation");
const multer_1 = require("../../lib/middleware/multer");
const upload = (0, multer_1.initMulterMiddleware)();
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const planets = await client_1.default.planet.findMany();
    res.json(planets);
});
router.get('/:id(\\d+)', async (req, res, next) => {
    const planetId = Number(req.params.id);
    const planet = await client_1.default.planet.findUnique({
        where: { id: planetId }
    });
    if (!planet) {
        res.status(404);
        return next(`Cannot GET /planets/${planetId}`);
    }
    res.json(planet);
});
router.post('/', (0, validation_1.validate)({ body: validation_1.planetSchema }), async (req, res) => {
    const planetData = req.body;
    const planet = await client_1.default.planet.create({
        data: planetData
    });
    res.status(201).json(planet);
});
router.put('/:id(\\d+)', (0, validation_1.validate)({ body: validation_1.planetSchema }), async (req, res, next) => {
    const planetData = req.body;
    const planetId = Number(req.params.id);
    try {
        const planet = await client_1.default.planet.update({
            where: { id: planetId },
            data: planetData
        });
        res.status(200).json(planet);
    }
    catch (error) {
        res.status(404);
        next(`Cannot PUT /planets/${planetId}`);
    }
});
router.delete('/:id(\\d+)', async (req, res, next) => {
    ;
    const planetId = Number(req.params.id);
    try {
        const planet = await client_1.default.planet.delete({
            where: { id: planetId }
        });
        res.status(204).end();
    }
    catch (error) {
        res.status(404);
        next(`Cannot DELETE /planets/${planetId}`);
    }
});
router.post('/:id(\\d+)/photo', upload.single("photo"), async (req, res, next) => {
    console.log("request.file", req.file);
    if (!req.file) {
        res.status(400);
        return next("No photo file uploaded.");
    }
    const photoFilename = req.file.filename;
    res.status(201).json({ photoFilename });
});
exports.default = router;
//# sourceMappingURL=planets.js.map