
const fs = require("fs");
const path = require("path");
const os = require("os");
const request = require("supertest");

const app = require("../src/app");
const mascotas = require("../src/mascotas");

const datosIniciales = {
    mascotas: [
        { id: 1, nombre: "Firulais", tipo: "Perro", edad: 3 },
        { id: 2, nombre: "Michi", tipo: "Gato", edad: 2 }
    ]
};

beforeEach(() => {
    const carpeta = fs.mkdtempSync(
        path.join(os.tmpdir(), "mascotas-")
    );

    process.env.DB_PATH = path.join(carpeta, "db.json");

    fs.writeFileSync(
        process.env.DB_PATH,
        JSON.stringify(datosIniciales, null, 2)
    );
});

// UNIT TEST
test("UNIT: validar una mascota", () => {
    const resultado = mascotas.validarMascota({
        nombre: "Firulais",
        tipo: "Perro",
        edad: 3
    });

    expect(resultado).toBe(true);
});

// INTEGRATION TEST
test("INTEGRATION: obtener mascotas desde db.json mediante API", async () => {
    const respuesta = await request(app).get("/mascotas");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(2);
    expect(respuesta.body[0].nombre).toBe("Firulais");
});

// E2E TEST
test("E2E: registrar y consultar una mascota", async () => {
    const registro = await request(app)
        .post("/mascotas")
        .send({
            nombre: "Luna",
            tipo: "Gato",
            edad: 1
        });

    expect(registro.status).toBe(201);

    const consulta = await request(app)
        .get(`/mascotas/${registro.body.id}`);

    expect(consulta.status).toBe(200);
    expect(consulta.body.nombre).toBe("Luna");
});
