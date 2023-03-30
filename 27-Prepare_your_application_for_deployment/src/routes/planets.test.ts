import supertest from "supertest";
import { prismaMock } from '../../lib/prisma/client.mock';
import app from '../app';

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
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true")
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

describe("GET /planet/:id", () => {
  test("Valid request", async () => {
    const planet = {
      id: 1,
      name: "Mars",
      description: null,
      diameter: 123452,
      moons: 2,
      createdAt: "2023-03-21T10:27:46.849Z",
      updatedAt: "2023-03-21T10:27:35.296Z"
    }

    // @ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(planet)

    const response = await request
      .get("/planets/1")
    expect(response.body).toEqual(planet);
  })

  test("Planet does not exist", async () => {

    // @ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(null);

    const response = await request
      .get("/planets/20")
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toContain("Cannot GET /planets/20")
  })

  test("Invalid planet ID", async () => {

    const response = await request
      .get("/planets/asd")
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toContain("Cannot GET /planets/asd")
  })
});

describe("PUT /planets", () => {
  test('valid request', async () => {
    const planet = {
      id: 1,
      name: "Mars",
      description: "A rocky planet",
      diameter: 123452,
      moons: 2,
      createdAt: "2023-03-21T10:27:46.849Z",
      updatedAt: "2023-03-21T10:27:35.296Z"
    };

    // @ts-ignore
    prismaMock.planet.update.mockResolvedValue(planet)

    const response = await request
      .put("/planets/1")
      .send({
        name: "Mars",
        description: "A rocky planet",
        diameter: 123452,
        moons: 3
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true")
    expect(response.body).toEqual(planet)
  });

  test('invalid request', async () => {
    const planet = {
      "diameter": 1234,
      "moons": 12
    };

    const response = await request
      .put("/planets/20")
      .send(planet)
      .expect(422)
      .expect("Content-Type", /application\/json/)

    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array)
      }
    })
  });

  test("Planet does not exist", async () => {

    // @ts-ignore
    prismaMock.planet.update.mockRejectedValue(new Error("Error"));

    const response = await request
      .put("/planets/20")
      .send({
        name: "Mars",
        description: "A rocky planet",
        diameter: 123452,
        moons: 3
      })
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toContain("Cannot PUT /planets/20")
  })

  test("Invalid planet ID", async () => {

    const response = await request
      .put("/planets/asd")
      .send({
        name: "Mars",
        description: "A rocky planet",
        diameter: 123452,
        moons: 3
      })
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toContain("Cannot PUT /planets/asd")
  })
})

describe("DELETE /planet/:id", () => {
  test("Valid request", async () => {

    const response = await request
      .delete("/planets/1")
      .expect(204)
    expect(response.body.message).toEqual("");
  })

  test("Planet does not exist", async () => {

    // @ts-ignore
    prismaMock.planet.delete.mockRejectedValue(new Error("Error"));

    const response = await request
      .delete("/planets/20")
      .expect(401)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toContain("Cannot DELETE /planets/20")
  })

  test("Invalid planet ID", async () => {

    const response = await request
      .delete("/planets/asd")
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toContain("Cannot DELETE /planets/asd")
  })
});

/*
* These tests depends on lib/middleware/multer.mock.ts
* multer.memoryStorage, no file saved on disk
*/
describe("POST /planets/:id/photo", () => {
  test("Valid request with JPG file upload", async () => {
    await request
    .post("planets/1/photo")
    .attach("photo", "test-fixtures/photo/mars.jpg")
    .expect(201)
    .expect("Access-Control-Allow-Origin", "http://localhost:8080")
    .expect("Access-Control-Allow-Credentials", "true")
  })


  test("invalid planet ID", async () => {
    const response = await request
      .post("/planets/asd/photo")
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(response.body.message).toContain("Cannot POST /planets/asd/photo")
  });

  test("invalid request with no file upload", async () => {
    const response = await request
    .post("planets/1/photo")
    .expect(400)
    .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("No photo file uploaded.")
  })
})
