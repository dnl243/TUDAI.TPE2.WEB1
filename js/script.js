"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* -- INDEX -- */

  // mostrar en consola y DOM ( mensaje, clase)
  function mostrarMsj(mensaje, clase) {
    console.log(mensaje);
    const msj = document.querySelector("#msj");
    msj.innerHTML = mensaje;
    msj.className = clase;
    setTimeout(() => {
      msj.innerHTML = "";
    }, 3000);
    window.scrollTo({ top: 5000, behavior: "smooth" });
  }

  //destacamos botón seleccionado
  function destacarBtnNav(id) {
    document
      .querySelectorAll(".btnNav")
      .forEach((e) => e.classList.remove("liSelec"));
    document
      .querySelectorAll("#" + id)
      .forEach((e) => e.classList.add("liSelec"));
  }

  //configuración de JS según contenido
  function configJs(id) {
    switch (id) {
      case "home":
        configHome();
        break;
      case "favoritas":
        configFav();
        break;
      case "acceso":
        configAcceso();
        break;
    }
  }

  //solicitamos y cargamos contenido
  async function cargarContenido(id) {
    let contPrincipal = document.querySelector("#contPrincipal");
    contPrincipal.innerHTML = "<h2>Cargando contenido..</h2>";
    try {
      let res = await fetch(`html/${id}.html`);
      if (res.ok) {
        let txt = await res.text();
        contPrincipal.innerHTML = txt;
        configModo();
        configJs(id);
      } else {
        mostrarMsj("Ha ocurrido un error", "error");
      }
    } catch (error) {
      mostrarMsj(error, "error");
    }
  }

  function ejecutar(event) {
    // obtenemos el id
    let id = event.target.id;
    //destacamos selección
    destacarBtnNav(id);
    //actualizamos el "title"
    document.title = id;
    //cargamos contenido de la página
    cargarContenido(id);
    //hacemos un push del estado
    location.pathname === `/${id}`
      ? window.history.replaceState({ id }, `${id}`, id)
      : window.history.pushState({ id }, `${id}`, id);
  }

  //carga de página principal
  function cargarPorDefecto(id) {
    destacarBtnNav(id);
    document.title = id;
    cargarContenido(id);
    window.history.pushState({ id }, `${id}`, id);
  }

  document
    .querySelector("#home")
    .addEventListener("click", (event) => ejecutar(event));
  document
    .querySelector("#favoritas")
    .addEventListener("click", (event) => ejecutar(event));
  document
    .querySelector("#acceso")
    .addEventListener("click", (event) => ejecutar(event));
  cargarPorDefecto("home");

  //navegación desde browser ( <- / ->)
  window.addEventListener("popstate", (event) => {
    let stateId = event.state.id;
    destacarBtnNav(stateId);
    cargarContenido(stateId);
  });

  // icono menu
  const menuIcono = document.querySelector(".menuIcono");

  //mostrar/ocultar menu desplegable
  function desplegar() {
    document.querySelector(".menuDesplegable").classList.toggle("oculto");
    menuIcono.classList.toggle("bi-list"); //ícono "hamburguesa"
    menuIcono.classList.toggle("bi-x"); //ícono "x"
  }
  menuIcono.addEventListener("click", desplegar);

  //ocultar menú desplegable al seleccionar opción
  document
    .querySelectorAll(".menuDesplegable li a")
    .forEach((e) => e.addEventListener("click", desplegar));

  let bgPrimario = document.querySelectorAll("body");
  let bgSecundario = document.querySelectorAll(".menuDesplegable");
  let clFuente = document.querySelectorAll(
    "body, h1, .menuDesplegable a, .menuDesplegable i, input, textarea, button, #captcha, .info, .genero"
  );
  let destacado = document.querySelectorAll(
    "h1 span, form span, #resultadoCaptcha, .respForm"
  );

  let modoBgPrimario = "bgPrimarioOscuro", modoBgSecundario = "bgSecundarioOscuro", modoClFuente = "clOscuro", modoDestacado = "destacadoOscuro";

  function configModo() {
    //modo claro/oscuro (oscuro por defecto)
    bgPrimario.forEach((e) => e.classList.add(modoBgPrimario));
    bgSecundario.forEach((e) => e.classList.add(modoBgSecundario));
    clFuente.forEach((e) => e.classList.add(modoClFuente));
    destacado.forEach((e) => e.classList.add(modoDestacado));
  }

  function cambiarModo(arreglo, clase1, clase2) {
    arreglo.forEach((e) => {
      e.classList.toggle(clase1);
      e.classList.toggle(clase2);
    });
  }

  const iconoModo = document.querySelector(".iconoModo");
  iconoModo.addEventListener("click", () => {
    iconoModo.classList.toggle("bi-moon-fill");
    iconoModo.classList.toggle("bi-sun-fill");
    cambiarModo(bgPrimario, "bgPrimarioOscuro", "bgPrimarioClaro");
    cambiarModo(bgSecundario, "bgSecundarioOscuro", "bgSecundarioClaro");
    cambiarModo(clFuente, "clOscuro", "clClaro");
    cambiarModo(destacado, "destacadoOscuro", "destacadoClaro");
  });

  /* -- HOME -- */

  function configHome() {
    //mostrar texto y cambiar "+" por "x" en preguntas frecuentes
    document.querySelectorAll(".pregFrec").forEach((e) => {
      e.addEventListener("click", () => {
        e.nextElementSibling.classList.toggle("oculto");
        e.lastElementChild.classList.toggle("bi-plus");
        e.lastElementChild.classList.toggle("bi-x");
      });
    });
  }

  /* -- FAVORITAS -- */
  const url = "https://6665bc91d122c2868e419690.mockapi.io/api/peliculas";
  function animarLista() {
    document
      .querySelectorAll(".lista ul li")
      .forEach((e) =>
        e.addEventListener(
          "mouseover",
          () => (document.querySelector(".imgFav img").src = e.id)
        )
      );
  }
  function imprimirTabla(json) {
    let tBodyPelis = document.querySelector("#tBodyPelis");
    tBodyPelis.innerHTML = "";
    json.forEach((e) => {
      let trNuevo = document.createElement("tr");

      let tdTitulo = document.createElement("td");
      tdTitulo.innerHTML = e.titulo;
      trNuevo.appendChild(tdTitulo);

      let tdGenero = document.createElement("td");
      tdGenero.innerHTML = e.generos;
      trNuevo.appendChild(tdGenero);

      let tdLanzam = document.createElement("td");
      tdLanzam.innerHTML = e.lanzamiento;
      trNuevo.appendChild(tdLanzam);

      let tdSinopsis = document.createElement("td");
      tdSinopsis.innerHTML = e.sinopsis;
      trNuevo.appendChild(tdSinopsis);

      let btnsPeli = document.createElement("td");
      //boton borrar
      let btnBorrar = document.createElement("button");
      btnBorrar.innerHTML = "Borrar";
      btnBorrar.setAttribute("class", "btnFav clOscuro");
      btnBorrar.addEventListener("click", () => eliminarDatos(e.id));
      btnsPeli.appendChild(btnBorrar);
      //boton editar
      let anchorEditar = document.createElement("a");
      anchorEditar.setAttribute("href", "#peliculas");
      let btnEditar = document.createElement("button");
      btnEditar.innerHTML = "Editar";
      btnEditar.setAttribute("class", "btnFav clOscuro");
      btnEditar.addEventListener("click", () =>
        traerFormCarga(configEditar, e)
      );
      anchorEditar.appendChild(btnEditar);
      btnsPeli.appendChild(anchorEditar);
      trNuevo.appendChild(btnsPeli);

      tBodyPelis.appendChild(trNuevo);
    });
  }

  // -- GET --
  async function solicitarDatos() {
    try {
      let res = await fetch(url);
      if (res.ok) {
        let json = await res.json();
        imprimirTabla(json);
      } else {
        mostrarMsj("Ha ocurrido un error en la carga de datos !", "error");
      }
    } catch (error) {
      mostrarMsj(error, "error");
    }
  }

  function configBtnCargar() {
    // -- FORMULARIO DE CARGA/MODIFICACIÓN --
    const btnCargar = document.querySelector("#btnCargar");
    btnCargar.addEventListener("click", () => traerFormCarga(configCargar));
    const contFormDinamico = document.querySelector("#contFormDinamico");
  }
  let form;
  // -- PARTIAL RENDER --
  async function traerFormCarga(callback, id) {
    try {
      let res = await fetch("html/formFav.html");
      if (res.ok) {
        let txt = await res.text();
        contFormDinamico.innerHTML = txt;
        window.scrollTo({ top: 5000, behavior: "smooth" });
        callback(id);
      }
    } catch (error) {
      mostrarMsj(error, "error");
    }
  }

  // -- POST --
  async function enviarDatos(datosPeli) {
    try {
      let res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosPeli),
      });
      if (res.ok) {
        mostrarMsj("Carga exitosa!", "exito");
        solicitarDatos();
      } else {
        mostrarMsj("Ha ocurrido un error en el envio de datos !", "error");
      }
    } catch (error) {
      mostrarMsj(error, "error");
    }
  }

  function configCargar() {
    form = document.querySelector("#formPelis");
    form.addEventListener("submit", (e) => cargarPeli(e));
  }

  function cargarPeli(e) {
    e.preventDefault();

    let formData = new FormData(form);
    let titulo = formData.get("titulo");
    let generos = formData.get("generos");
    let lanzamiento = formData.get("lanzamiento");
    let sinopsis = formData.get("sinopsis");

    let datosPeli = {
      titulo: titulo,
      generos: generos,
      lanzamiento: lanzamiento,
      sinopsis: sinopsis,
    };
    enviarDatos(datosPeli);

    form.reset();
    document.querySelector("#titulo").focus();
  }

  function configEditar(e) {
    form = document.querySelector("#formPelis");
    form.addEventListener("submit", (evento) => editarPeli(evento, e));
    document.querySelector("#titulo").setAttribute("value", e.titulo);
    document.querySelector("#generos").setAttribute("value", e.generos);
    document.querySelector("#lanzamiento").setAttribute("value", e.lanzamiento);
    document.querySelector("#sinopsis").innerHTML = e.sinopsis;
    document.querySelector("#h3Form").innerHTML = "Editar película";
    document.querySelector("#btnFav").innerHTML = "Editar";
  }

  function editarPeli(evento, e) {
    evento.preventDefault();

    let formData = new FormData(form);
    let titulo = formData.get("titulo");
    let generos = formData.get("generos");
    let lanzamiento = formData.get("lanzamiento");
    let sinopsis = formData.get("sinopsis");

    let datosPeli = {
      titulo: titulo,
      generos: generos,
      lanzamiento: lanzamiento,
      sinopsis: sinopsis,
    };
    modificarDatos(datosPeli, e.id);

    form.reset();
    document.querySelector("#titulo").focus();
  }

  // -- PUT --
  async function modificarDatos(datosPeli, id) {
    try {
      let res = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosPeli),
      });
      if (res.ok) {
        let json = await res.json();
        mostrarMsj("datos modificados correctamente", "exito");
        solicitarDatos();
      }
    } catch (error) {
      mostrarMsj(error, "error");
    }
  }

  // -- DELETE --
  async function eliminarDatos(id) {
    try {
      let res = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        let json = await res.json();
        mostrarMsj("datos borrados con exito!", "exito");
        solicitarDatos();
      } else {
        mostrarMsj(
          "Ha ocurrido un error en el envio de la solicitud !",
          "error"
        );
      }
    } catch (error) {
      mostrarMsj(error, "error");
    }
  }

  function configFav() {
    //capturo pelis de la lista para cambiar img
    animarLista();
    solicitarDatos();
    configBtnCargar();
  }

  /* -- ACCESO -- */
  function iniciarCaptcha() {
    const captchaElement = document.getElementById("captcha");
    captchaElement.textContent = generarCaptcha();
  }

  function generarCaptcha() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return captcha;
  }

  function cambiarForm(btn, form) {
    btn.addEventListener("click", () => {
      formAcceder.classList.add("oculto");
      form.classList.remove("oculto");
    });
  }

  function verificarCaptcha() {
    document.getElementById("miForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const captchaElement = document.getElementById("captcha").textContent;
      const captchaInput = document.getElementById("captchaInput").value;

      if (captchaInput === captchaElement) {
        mostrarMsj("Código correcto. Acceso concedido.", "exito");
      } else {
        mostrarMsj("Código incorrecto. Inténtalo de nuevo.", "error");
        iniciarCaptcha();
      }
    });
  }

  function configAcceso() {
    iniciarCaptcha();
    verificarCaptcha();

    const btnRecuperar = document.querySelector(".btnRecuperar");
    const btnRegistrate = document.querySelector(".btnRegistrate");
    const formAcceder = document.querySelector("#formAcceder");
    const formRecuperar = document.querySelector("#formRecuperar");
    const formRegistrar = document.querySelector("#formRegistrar");

    cambiarForm(btnRecuperar, formRecuperar); //click en recuperar
    cambiarForm(btnRegistrate, formRegistrar); //click en registrate

    // form recuperar y registrarse
    document.querySelectorAll(".miFormRe").forEach((form) =>
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        document
          .querySelectorAll(".respForm")
          .forEach((p) => p.classList.remove("oculto"));
      })
    );
  }
});