const { response, request } = require("express");
const Grupo = require("../models/grupos");

const gruposGet = async (req, res) => {
  const query = { estado: true };
  const response = await Grupo.find(query);
  if (response) {
    res.json({
      grupos: response,
    });
  } else {
    res.status(404).json({
      msg: `No existe Ningun grupo registrado`,
    });
  }
};

const gruposGetOne = async (req, res) => {
  const { id } = req.params;
  const grupo = await Grupo.findById(id);
  res.json(grupo);
};

const gruposPost = async (req, res) => {
  const { nombre } = req.body;
  const grupo = new Grupo({ nombre });
  await grupo.save();
  res.json({
    grupo,
  });
};

const gruposDelete = async (req, res) => {
  const { id } = req.params;
  const grupo = await Grupo.findByIdAndUpdate(id, { estado: false });

  res.json(grupo);
};

module.exports = {
  gruposGet,
  gruposGetOne,
  gruposPost,
  gruposDelete,
};
