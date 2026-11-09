
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

function obtenerRutaDB() {
    return process.env.DB_PATH || DB_PATH;
}

// Obtener todas las mascotas
function obtenerMascotas() {
    const datos = JSON.parse(
        fs.readFileSync(obtenerRutaDB(), "utf8")
    );

    return datos.mascotas;
}

// Buscar mascota por ID
function buscarMascota(id) {
    const mascotas = obtenerMascotas();

    return mascotas.find(
        mascota => mascota.id === Number(id)
    ) || null;
}

// Validar mascota
function validarMascota(mascota) {
    return (
        mascota &&
        typeof mascota.nombre === "string" &&
        mascota.nombre.trim() !== "" &&
        typeof mascota.tipo === "string" &&
        mascota.tipo.trim() !== "" &&
        Number.isInteger(mascota.edad) &&
        mascota.edad >= 0
    );
}

// Agregar mascota
function agregarMascota(mascota) {
    if (!validarMascota(mascota)) {
        throw new Error("Datos de mascota invalidos");
    }

    const datos = JSON.parse(
        fs.readFileSync(obtenerRutaDB(), "utf8")
    );

    const nueva = {
        id: datos.mascotas.length
            ? Math.max(...datos.mascotas.map(m => m.id)) + 1
            : 1,
        nombre: mascota.nombre,
        tipo: mascota.tipo,
        edad: mascota.edad
    };

    datos.mascotas.push(nueva);

    fs.writeFileSync(
        obtenerRutaDB(),
        JSON.stringify(datos, null, 2)
    );

    return nueva;
}

// Exportar funciones
module.exports = {
    obtenerMascotas,
    buscarMascota,
    validarMascota,
    agregarMascota
};
