class Mensaje {
  constructor(uid, nombre, mensaje) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
  }
}

class ChatMensajes {
  constructor() {
    this.mensajes = [];
    this.usuarios = {};
    this.grupos = {};
  }

  get ultimos10() {
    this.mensajes = this.mensajes.splice(0, 10);
    return this.mensajes;
  }

  get usuariosArr() {
    return Object.values(this.usuarios);
  }

  enviarMensaje(uid, nombre, mensaje) {
    this.mensajes.unshift(new Mensaje(uid, nombre, mensaje));
  }

  agregarUsuario(usuario) {
    usuario.grupo = null;
    this.usuarios[usuario._id] = usuario;
    //console.log(this.usuarios);
  }

  desconectarUsuario(id) {
    delete this.usuarios[id];
  }

  agregarSalaChat(id, sala) {
    if (!this.grupos[sala]) {
      this.grupos[sala] = [];
    }
    if (!this.grupos[sala].includes(id)) {
      this.grupos[sala].push(id);
    }
  }

  obtenerUsuariosSala(sala) {
    //console.log(sala);
    const usuarios = [];
    //console.log(this.grupos);
    const salaIDS = this.grupos[sala];
    console.log(salaIDS);
    for (let index = 0; index < salaIDS.length; index++) {
      const usuario = this.usuarios[salaIDS[index]];
      usuarios.push(usuario);
    }
    console.log(this.usuarios);
    //console.log(usuarios);
    return usuarios;
  }

  desconectarUsuarioSala(id, sala) {
    const salaIDS = this.grupos[sala];
    const newSala = salaIDS.filter((item) => item !== id);
    if (newSala.length === 0) {
      delete this.grupos[sala];
    } else {
      this.grupos[sala] = newSala;
    }

    console.log(this.grupos);
  }
}

module.exports = ChatMensajes;
