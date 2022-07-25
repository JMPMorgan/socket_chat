let usuario = null;
let socket = null;
let grupo = null;

const btnSalir = document.querySelector("#btnSalir");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");

const desconectarSala = () => {
  socket.emit("desconectar-chat-sala", { grupo, usuario });
  window.location = "chats.html";
};

const validarJWT = async () => {
  const token = localStorage.getItem("token");
  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const response = await fetch("http://localhost:8080/api/auth", {
    headers: { "x-token": token },
  });

  const { usuario: userDB, token: tokenDB } = await response.json();
  localStorage.setItem("token", tokenDB);
  usuario = userDB;
  socket = io();
  await conectarSocket();
};

const conectarSocket = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  grupo = searchParams.get("id");
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
      grupo: grupo,
    },
  });

  await socket.on("connect", enviarMensaje);
  //enviarMensaje();
  socket.on("disconnect", desconectarSala);

  await socket.on("chat-grupo-usuarios", dibujarUsuarios);

  socket.on("connectGrupo", ({ mensaje }) => {
    console.log(mensaje);
  });

  socket.on("mensaje-grupo-recibido", ({ de, mensaje }) => {
    dibujarMensaje({ de, mensaje });
  });
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has("id")) {
    window.location = "index.html";
    throw new Error("Destinatario es obligatorio");
  }
  const destinatario = searchParams.get("id");
  const mensaje = txtMensaje.value;
  //const uid = txtUid.value;
  if (keyCode !== 13) {
    return;
  }
  if (mensaje.length === 0) {
    return;
  }

  socket.emit("mensaje-grupo", { mensaje, grupo: destinatario });
  txtMensaje.value = "";
  const objeto = {
    mensaje,
    de: "Yo",
  };
  dibujarMensaje(objeto);
});

btnSalir.addEventListener("click", desconectarSala);

const dibujarMensaje = ({ de, mensaje }) => {
  let html = ``;
  html += `<li>
      <p>
        <span class='text-primary'>${de}:</span>
        <span>${mensaje}</span>
      </p>
    </li>`;
  ulMensajes.innerHTML += html;
};

const dibujarUsuarios = (usuarios = []) => {
  //console.log("Usuarios:", usuarios);
  //usuarios_sala = usuarios.salas;
  let html = ``;
  usuarios.forEach(({ nombre, uid }) => {
    html += `<li>
        <p>
          <h5 class='text-success'>${nombre}</h5>
          <span class='fs-6 text-muted'>${uid}</span>
        </p>
      </li>`;
  });

  ulUsuarios.innerHTML = html;
};

const enviarMensaje = () => {
  console.log("Hola");
  setTimeout(() => {
    socket.emit("entrar-chat-grupo", grupo);
  }, 1000);
};

const main = async () => {
  await validarJWT();
};

main();
