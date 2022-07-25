const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");
const { GruposRequest } = require("../models");

const chatMensajes = new ChatMensajes();
const gruposRequest = new GruposRequest();

const socketController = async (socket, io) => {
  //console.log(socket, io);
  const id_grupo = socket.handshake.headers.grupo;
  const token = await comprobarJWT(socket.handshake.headers["x-token"]);
  if (!token) {
    return socket.disconnect();
  }
  chatMensajes.agregarUsuario(token);
  io.emit("usuarios-activos", chatMensajes.usuariosArr);
  socket.emit("recibir-mensajes", chatMensajes.ultimos10);

  socket.join(token.id);

  if (id_grupo) {
    socket.join(id_grupo);
    chatMensajes.agregarSalaChat(token.id, id_grupo);
    //console.log(id_grupo);
  }

  socket.on("entrar-chat-grupo", (grupo) => {
    const salas = chatMensajes.obtenerUsuariosSala(grupo);
    io.to(grupo).emit("chat-grupo-usuarios", salas);
  });

  socket.on("desconectar-chat-sala", async ({ grupo, usuario }) => {
    await chatMensajes.desconectarUsuarioSala(usuario.uid, grupo);
  });
  socket.on("disconnect", () => {
    chatMensajes.desconectarUsuario(token.id);
    io.emit("usuarios-activos", chatMensajes.usuariosArr);
  });
  socket.on("mensaje-privado", ({ mensaje, destinatario }) => {
    socket
      .to(destinatario)
      .emit("mensaje-privado", { de: token.nombre, mensaje });
    socket
      .to(destinatario)
      .emit("mensaje-privado-chat", { de: token.nombre, mensaje });
  });
  socket.on("mensaje-grupo", ({ mensaje, grupo }) => {
    socket
      .to(grupo)
      .emit("mensaje-grupo-recibido", { de: token.nombre, mensaje });
  });
};
module.exports = {
  socketController,
};
