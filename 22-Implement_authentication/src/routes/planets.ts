import { Router } from 'express';

import prisma from '../../lib/prisma/client';

import {
    validate,
    planetSchema,
    PlanetData
} from '../../lib/middleware/validation'

import { checkAuthorization } from '../../lib/middleware/passport';
import { initMulterMiddleware } from "../../lib/middleware/multer";

const upload = initMulterMiddleware();

const router = Router();

router.get('/', async (req, res) => {
    const planets = await prisma.planet.findMany();

    res.json(planets)
})

router.get('/:id(\\d+)', async (req, res, next) => {
    const planetId: number = Number(req.params.id);

    const planet = await prisma.planet.findUnique({
        where: { id: planetId }
    });

    if (!planet) {
        res.status(404);
        return next(`Cannot GET /planets/${planetId}`)
    }

    res.json(planet)
})

router.post('/', checkAuthorization, validate({ body: planetSchema }), async (req, res) => {
    const planetData: PlanetData = req.body;
    const username = req.user?.username as string;

    const planet = await prisma.planet.create({
        data: {
            createdBy: username,
            updatedBy: username,
            ...planetData,
        }
    })

    res.status(201).json(planet);
});

router.put('/:id(\\d+)', checkAuthorization, validate({ body: planetSchema }), async (req, res, next) => {
    const planetData: PlanetData = req.body;
    const planetId = Number(req.params.id);
    const username = req.user?.username as string;

    try {
        const planet = await prisma.planet.update({
            where: { id: planetId },
            data: {
                updatedBy: username,
                ...planetData}
        })
        res.status(200).json(planet);
    } catch (error) {
        res.status(404);
        next(`Cannot PUT /planets/${planetId}`)
    }
});

router.delete('/:id(\\d+)', checkAuthorization, async (req, res, next) => {
    ;
    const planetId = Number(req.params.id);

    try {
        const planet = await prisma.planet.delete({
            where: { id: planetId }
        })
        res.status(204).end();
    } catch (error) {
        res.status(404);
        next(`Cannot DELETE /planets/${planetId}`)
    }
});

router.post('/:id(\\d+)/photo',
    checkAuthorization,
    upload.single("photo"),
    async (req, res, next) => {
        console.log("request.file", req.file)

        if (!req.file) {
            res.status(400);
            return next("No photo file uploaded.")
        }

        const photoFilename = req.file.filename;

        res.status(201).json({ photoFilename })
    });

export default router;
