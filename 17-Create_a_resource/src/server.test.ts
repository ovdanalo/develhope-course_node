import supertest from "supertest";
import { prismaMock } from '../lib/prisma/client.mock';
import app from './app';

const request = supertest(app);



describe("POST /planets", () => {
  test('valid request', async () => {
    const planet = {
      name: "Mercury",
      diameter: 1234,
      moons: 12
    };

    // @ts-ignore
    prismaMock.planet.create.mockResolvedValue(planet)

    const response = await request
      .post("/planets")
      .send(planet)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(response.body).toEqual(planet)
  });

  test('invalid request', async () => {
    const planet = {
      "diameter": 1234,
      "moons": 12
    };

    const response = await request
      .post("/planets")
      .send(planet)
      .expect(422)
      .expect("Content-Type", /application\/json/)

    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array)
      }
    })
  });
})
