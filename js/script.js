"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* -- INDEX -- */

  let bgPrimario, bgSecundario, clFuente, destacado, modoClaro;
  let contPrincipal = document.querySelector("#contPrincipal");

  // mostrar en consola y DOM ( mensaje, clase )
  function mostrarMsj(mensaje, clase) {
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
    contPrincipal.innerHTML = "<h2>Cargando contenido..</h2>";
    try {
      let res = await fetch(`html/${id}.html`);
      if (res.ok) {
        let txt = await res.text();
        contPrincipal.innerHTML = txt;
        modoClaro ? establecerModoClaro() : establecerModoOscuro();
        configJs(id);
      } else {
        mostrarMsj("Ha ocurrido un error", "error");
      }
    } catch (error) {
      mostrarMsj(error, "error");
    }
  }

  function navegar(event) {
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
    window.history.replaceState({ id }, `${id}`, id);
  }

  cargarPorDefecto("home");
  establecerModoOscuro();
  document
    .querySelector("#home")
    .addEventListener("click", (event) => navegar(event));
  document
    .querySelector("#favoritas")
    .addEventListener("click", (event) => navegar(event));
  document
    .querySelector("#acceso")
    .addEventListener("click", (event) => navegar(event));

  //navegación desde browser ( <- / ->)
  window.addEventListener("popstate", (event) => {
    if (!event.state) {
      return;
    }
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

  //modo claro/oscuro (oscuro por defecto)

  function agregarClases(bg1, bg2, cl, des) {
    bgPrimario = document.querySelector("body");
    bgPrimario.classList.add(bg1);
    bgSecundario = document.querySelector(".menuDesplegable");
    bgSecundario.classList.add(bg2);
    clFuente = document.querySelectorAll(
      "body, h1, .menuDesplegable a, .menuDesplegable i, input, textarea, button, #captcha, .info, .genero"
    );
    clFuente.forEach((e) => e.classList.add(cl));
    destacado = document.querySelectorAll(
      "h1 span, form span, #resultadoCaptcha, .respForm"
    );
    destacado.forEach((e) => e.classList.add(des));
  }

  function quitarClases(bg1, bg2, cl, des) {
    bgPrimario = document.querySelector("body");
    bgPrimario.classList.remove(bg1);
    bgSecundario = document.querySelector(".menuDesplegable");
    bgSecundario.classList.remove(bg2);
    clFuente = document.querySelectorAll(
      "body, h1, .menuDesplegable a, .menuDesplegable i, input, textarea, button, #captcha, .info, .genero"
    );
    clFuente.forEach((e) => e.classList.remove(cl));
    destacado = document.querySelectorAll(
      "h1 span, form span, #resultadoCaptcha, .respForm"
    );
    destacado.forEach((e) => e.classList.remove(des));
  }

  function establecerModoOscuro() {
    quitarClases(
      "bgPrimarioClaro",
      "bgSecundarioClaro",
      "clClaro",
      "destacadoClaro"
    );
    agregarClases(
      "bgPrimarioOscuro",
      "bgSecundarioOscuro",
      "clOscuro",
      "destacadoOscuro"
    );
  }

  function establecerModoClaro() {
    quitarClases(
      "bgPrimarioOscuro",
      "bgSecundarioOscuro",
      "clOscuro",
      "destacadoOscuro"
    );
    agregarClases(
      "bgPrimarioClaro",
      "bgSecundarioClaro",
      "clClaro",
      "destacadoClaro"
    );
  }

  const iconoModo = document.querySelector(".iconoModo");
  iconoModo.addEventListener("click", () => {
    iconoModo.classList.toggle("bi-moon-fill");
    iconoModo.classList.toggle("bi-sun-fill");
    if (!modoClaro) {
      establecerModoClaro();
      modoClaro = true;
    } else {
      establecerModoOscuro();
      modoClaro = false;
    }
  });

  /* -- HOME -- */

  function configHome() {
    //mostrar texto y cambiar "+" por "x" en preguntas frecuentes
    document.querySelectorAll(".pregFrec").forEach((elem) => {
      elem.addEventListener("click", () => {
        elem.nextElementSibling.classList.toggle("oculto");
        elem.lastElementChild.classList.toggle("bi-plus");
        elem.lastElementChild.classList.toggle("bi-x");
      });
    });

    //click en article para detalle de película
    document
      .querySelectorAll(".contPeli")
      .forEach((elem) => elem.addEventListener("click", () => buscarDetalle(elem.id)));
  }

  /* -- DETALLE DE PELÍCULA -- */

  function buscarDetalle(id) {
    document.title = id;
    cargarDetalle(id);
    location.pathname === `/${id}`
      ? window.history.replaceState({ id }, `${id}`, id)
      : window.history.pushState({ id }, `${id}`, id);
  }

  //carga de detalle de película
  async function cargarDetalle(id) {
    try {
      let res = await fetch(`html/${id}.html`);
      if (res.ok) {
        let txt = await res.text();
        contPrincipal.innerHTML = txt;
        modoClaro ? establecerModoClaro() : establecerModoOscuro();
        configJsDetalles();
      } else {
        mostrarMsj("Ha ocurrido un error", "error");
      }
    } catch (error) {
      mostrarMsj(error, "error");
    }
  }

  function configJsDetalles() {
    //mostrar contenido Detalles/Quzas tambien te guste
    const btnDetalles = document.querySelector(".detalles");
    const btnQuizasGuste = document.querySelector(".quizasGuste");
    const contenidoDetalles = document.querySelector(".contenidoDetalles");
    const contenidoQuizasGuste = document.querySelector(
      ".contenidoQuizasGuste"
    );

    function selecContenido(btn1, btn2, cont1, cont2) {
      btn1.addEventListener("click", () => {
        btn1.classList.toggle("seleccionado");
        btn2.classList.toggle("seleccionado");
        cont1.classList.toggle("opcVista");
        cont1.classList.toggle("oculto");
        cont2.classList.toggle("opcVista");
        cont2.classList.toggle("oculto");
      });
    }

    selecContenido(
      btnDetalles,
      btnQuizasGuste,
      contenidoDetalles,
      contenidoQuizasGuste
    );
    selecContenido(
      btnQuizasGuste,
      btnDetalles,
      contenidoQuizasGuste,
      contenidoDetalles
    );

    document
      .querySelectorAll(".peliculasSimilares img")
      .forEach((elem) =>
        elem.addEventListener("click", () => buscarDetalle(elem.id))
      );
  }

  /* -- FAVORITAS -- */
  const url = "https://6665bc91d122c2868e419690.mockapi.io/api/peliculas";
  function animarLista() {
    document
      .querySelectorAll(".lista ul li")
      .forEach((elem) =>
        elem.addEventListener(
          "mouseover",
          () => (document.querySelector(".imgFav img").src = elem.id)
        )
      );
  }

  function imprimirTabla(json) {
    let tBodyPelis = document.querySelector("#tBodyPelis");
    tBodyPelis.innerHTML = "";
    json.forEach((elem) => {
      let trNuevo = document.createElement("tr");

      let tdTitulo = document.createElement("td");
      tdTitulo.innerHTML = elem.titulo;
      trNuevo.appendChild(tdTitulo);

      let tdGenero = document.createElement("td");
      tdGenero.innerHTML = elem.generos;
      trNuevo.appendChild(tdGenero);

      let tdLanzam = document.createElement("td");
      tdLanzam.innerHTML = elem.lanzamiento;
      trNuevo.appendChild(tdLanzam);

      let tdSinopsis = document.createElement("td");
      tdSinopsis.innerHTML = elem.sinopsis;
      trNuevo.appendChild(tdSinopsis);

      let btnsPeli = document.createElement("td");
      //boton borrar
      let btnBorrar = document.createElement("button");
      btnBorrar.innerHTML = "Borrar";
      btnBorrar.setAttribute("class", "btnFav clOscuro");
      btnBorrar.addEventListener("click", () => eliminarDatos(elem.id));
      btnsPeli.appendChild(btnBorrar);
      //boton editar
      let anchorEditar = document.createElement("a");
      anchorEditar.setAttribute("href", "#peliculas");
      let btnEditar = document.createElement("button");
      btnEditar.innerHTML = "Editar";
      btnEditar.setAttribute("class", "btnFav clOscuro");
      btnEditar.addEventListener("click", (evento) => {
        evento.preventDefault();
        traerFormCarga(configEditar, elem);
      });
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

  // -- FORMULARIO DE CARGA/MODIFICACIÓN --
  function configBtnCargar() {
    const btnCargar = document.querySelector("#btnCargar");
    btnCargar.addEventListener("click", () => traerFormCarga(configCargar));
  }

  let form;

  //carga de formulario
  async function traerFormCarga(callback, id) {
    try {
      let res = await fetch("html/formFav.html");
      if (res.ok) {
        let txt = await res.text();
        const contFormDinamico = document.querySelector("#contFormDinamico");
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
        contFormDinamico.innerHTML = "";
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
    form.addEventListener("submit", (evento) => cargarPeli(evento));
  }

  function cargarPeli(evento) {
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
    enviarDatos(datosPeli);

    form.reset();
    document.querySelector("#titulo").focus();
  }

  function configEditar(elem) {
    form = document.querySelector("#formPelis");
    form.addEventListener("submit", (evento) => editarPeli(evento, elem));
    document.querySelector("#titulo").setAttribute("value", elem.titulo);
    document.querySelector("#generos").setAttribute("value", elem.generos);
    document.querySelector("#lanzamiento").setAttribute("value", elem.lanzamiento);
    document.querySelector("#sinopsis").innerHTML = elem.sinopsis;
    document.querySelector("#h3Form").innerHTML = "Editar película";
    document.querySelector("#btnFav").innerHTML = "Editar";
  }

  function editarPeli(evento, elem) {
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
    modificarDatos(datosPeli, elem.id);

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
        contFormDinamico.innerHTML = "";
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
      const formAcceder = document.querySelector("#formAcceder");
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

    const formRecuperar = document.querySelector("#formRecuperar");
    const formRegistrar = document.querySelector("#formRegistrar");

    cambiarForm(btnRecuperar, formRecuperar); //click en recuperar
    cambiarForm(btnRegistrate, formRegistrar); //click en registrate

    // form recuperar y registrarse
    document.querySelectorAll(".miFormRe").forEach((form) =>
      form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        document
          .querySelectorAll(".respForm")
          .forEach((p) => p.classList.remove("oculto"));
      })
    );
  }
});
