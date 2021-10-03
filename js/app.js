("use strict");

const body = document.querySelector("body");
const info = document.querySelector("#info");
const formulario = document.querySelector("#form");

window.addEventListener("load", () => {
  cambiarFondo();
  formulario.addEventListener("submit", buscarClimaFormulario);
  info.addEventListener("click", buscarClimaSugerencia);
});

function buscarClimaFormulario(e) {
  e.preventDefault();
  limpiarInfo();

  const ciudad = document.querySelector("#city").value;
  formulario.reset();

  if (ciudad === "") {
    mostrarError("Debe ingresar una ciudad");
    return;
  }

  consultarAPI(ciudad);
}
function buscarClimaSugerencia(e) {
  if (e.target.classList.contains("btn")) {
    consultarAPI(e.target.dataset.city);
  }
}

function consultarAPI(ciudad) {
  const appID = "67e9b99f492f58ff54d4e22e4446fe65";
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${appID}&lang=es`;

  mostrarSpinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.cod === "404") {
        mostrarError("Ciudad no encontrada");
        return;
      }

      mostrarDatos(datos);
    });
}

function mostrarDatos(datos) {
  const {
    name,
    main: { temp, temp_max, temp_min },
    weather: [{ description, icon }],
    sys: { country },
  } = datos;
  const temperatura = kelvinACentigrados(temp);
  const minima = kelvinACentigrados(temp_min);
  const maxima = kelvinACentigrados(temp_max);

  // cambiar el fondo de la página (d = día, n = noche)
  cambiarFondo(icon.charAt(icon.length - 1));

  info.innerHTML = `
		<h2 class="fs-1">${name}, ${country}</h2>
		<p class="temp fw-bold">${temperatura}&#8451;</p>
		<p>${description}</p>
		<img
			src="http://openweathermap.org/img/wn/${icon}@2x.png"
			alt="Icono del clima"
			class="icon"
		/>
		<p class="min-max">
			Min:
			<span class="fw-bold">${minima}&#8451;</span>
			/ Max:
			<span class="fw-bold">${maxima}&#8451;</span>
		</p>
	`;
}

function mostrarError(mensaje) {
  const hayAlerta = document.querySelector(".alert");

  if (!hayAlerta) {
    const alerta = document.createElement("div");

    alerta.classList.add("alert");
    alerta.innerHTML = `
      <i class="bi bi-x-circle"></i>
      ${mensaje}
    `;

    info.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function cambiarFondo(momento) {
  if (momento) {
    // Segun el clima de la busqueda
    body.className = momento;
    return;
  }

  // Segun la hora del usuario
  const hoy = new Date();

  // Si la hora es entre las 7am y 7pm se pondra el fondo de día
  body.className = hoy.getHours() > 6 && hoy.getHours() < 20 ? "d" : "n";
}

function limpiarInfo() {
  while (info.firstChild) {
    info.removeChild(info.firstChild);
  }
}

const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function mostrarSpinner() {
  limpiarInfo();

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  spinner.innerHTML = `
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
  `;

  info.appendChild(spinner);
}
