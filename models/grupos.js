const { Schema, model } = require("mongoose");

const GruposSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El Nombre del Grupo es Necesario"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("Grupo", GruposSchema);
