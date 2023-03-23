import express from 'express';
import 'express-async-errors';

import prisma from '../lib/prisma/client';

import {
    validate,
    validationErrorMiddleware,
    planetSchema,
    PlanetData
} from '../lib/validation'

const app = express();

app.use(express.json());

app.get('/planets', async (req, res) => {
    const planets = await prisma.planet.findMany();

    res.json(planets)
})


app.post('/planets', validate({ body: planetSchema }), async (req, res) => {
    const planetData: PlanetData = req.body;

    const planet = await prisma.planet.create({
        data: planetData
    })

    res.status(201).json(planet);
});

app.use(validationErrorMiddleware);

export default app;
