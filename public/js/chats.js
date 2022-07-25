let usuario = null;
let socket = null;
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulRecibidos = document.querySelector("#ulRecibidos");
const gruposHTML = document.querySelector("#grupos");

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
  const socket = io();
  await conectarSocket();
  dibujarGrupos();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });
  socket.on("disconnect", () => {
    //alert("Servidor Caido");
    //window.location = "index.html";
  });

  socket.on("mensaje-privado", ({ de, mensaje }) => {
    const html = `<li>
                    <span ><b>${de}:</b>
                        <span class='font-weight-normal'>${mensaje}</span>
                    </span>
                </li>`;
    ulRecibidos.innerHTML += html;
  });

  socket.on("usuarios-activos", dibujarUsuarios);
};

const dibujarUsuarios = (usuarios = []) => {
  let html = ``;
  usuarios.forEach(({ nombre, uid }) => {
    html += `<li>
        <p>
          <h5 class='text-success'>${nombre}</h5>
          <p class='fs-6 text-muted m-0'>${uid}<span class='mx-2'><a href='chat.html?destinatario=${uid}'>Enviar Mensaje Privado</a></span></p>
        </p>
      </li>`;
  });

  ulUsuarios.innerHTML = html;
};

const dibujarGrupos = async () => {
  let html = ``;
  const response = await fetch("http://localhost:8080/api/grupos");
  const { grupos } = await response.json();
  console.log(grupos);
  grupos.forEach(({ _id, nombre }) => {
    html = `<div class='col-4 mx-auto'>
              <p class='m-0'><b>${nombre}</b></p>
              <span><a class='btn btn-outline-success' href='chat-grupos.html?id=${_id}'>Entrar al Chat</a></span>
            </div>`;
    gruposHTML.innerHTML += html;
  });
};

const main = async () => {
  await validarJWT();
};

main();
