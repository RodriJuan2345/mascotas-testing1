
const express = require("express");

const {
    obtenerMascotas,
    buscarMascota,
    agregarMascota
} = require("./mascotas");

const app = express();

app.use(express.json());

// Listar mascotas
app.get("/mascotas", (req, res) => {
    res.json(obtenerMascotas());
});

// Buscar mascota por ID
app.get("/mascotas/:id", (req, res) => {
    const mascota = buscarMascota(req.params.id);

    if (!mascota) {
        return res.status(404).json({
            mensaje: "Mascota no encontrada"
        });
    }

    res.json(mascota);
});

// Registrar mascota
app.post("/mascotas", (req, res) => {
    try {
        const nueva = agregarMascota(req.body);

        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
});

module.exports = app;
