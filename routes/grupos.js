const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

const {
  gruposPost,
  gruposDelete,
  gruposGet,
  gruposGetOne,
} = require("../controllers/grupos");

const router = Router();

router.get("/", gruposGet);

router.get(
  "/:id",
  [check("id", "No es un ID válido").isMongoId(), validarCampos],
  gruposGetOne
);

router.post("/", [check("nombre").not().isEmpty(), validarCampos], gruposPost);

router.delete(
  "/:id",
  [check("id", "No es un ID válido").isMongoId(), validarCampos],
  gruposDelete
);

module.exports = router;
