const log_in = document.querySelector("#log_in");
const sign_in = document.querySelector("#sign_in");

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  //const responsePayload = decodeJwtResponse(response.credential);
  const body = { id_token: response.credential };
  fetch("http://localhost:8080/api/auth/google", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location = "chats.html";
    })
    .catch(console.warn);
}

log_in.onsubmit = (event) => {
  console.log("Hola");
  event.preventDefault();
  const formData = {};
  for (let element of log_in.elements) {
    if (element.name.length > 0) {
      formData[element.name] = element.value;
    }
  }
  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      console.log(token);
      localStorage.setItem("token", token);
      window.location = "chats.html";
    })
    .catch((err) => {
      console.log(err);
    });
};

sign_in.onsubmit = async (event) => {
  event.preventDefault();
  const formData = {};
  for (let element of sign_in.elements) {
    formData[element.name] = element.value;
  }
  const { usuario } = await fetch("http://localhost:8080/api/usuarios", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .catch((err) => {
      console.log(err);
    });
  if (usuario) {
    alert("Usuario Registrado Con exito");
  } else {
    alert("No se pudo registrar el usuario");
  }
};

const button = document.getElementById("sign_out");
button.onclick = () => {
  console.log("Hola como ");
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("token"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
