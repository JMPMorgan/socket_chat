let usuario = null;
let socket = null;

//Referencias
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

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
  document.title = usuario.nombre;
  const socket = io();
  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", (response) => {
    console.log(response);
  });

  socket.on("disconnect", () => {});

  /*socket.on("recibir-mensajes", dibujarMensajes);
  socket.on("usuarios-activos", dibujarUsuarios);*/
  socket.on("mensaje-privado-chat", (payload) => {
    console.log("Privado:", payload);
    dibujarMensaje(payload);
  });
};

const dibujarUsuarios = (usuarios = []) => {
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

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has("destinatario")) {
    window.location = "index.html";
    throw new Error("Destinatario es obligatorio");
  }
  const destinatario = searchParams.get("destinatario");
  const mensaje = txtMensaje.value;
  //const uid = txtUid.value;
  if (keyCode !== 13) {
    return;
  }
  if (mensaje.length === 0) {
    return;
  }

  socket.emit("mensaje-privado", { mensaje, destinatario });
  txtMensaje.value = "";
  const objeto = {
    mensaje,
    de: "Yo",
  };
  dibujarMensaje(objeto);
});

const main = async () => {
  await validarJWT();
};

main();

//const socket = io();
