"use strict";

document.addEventListener("DOMContentLoaded", function () {
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

  //mostrar texto y cambiar "+" por "x" en preguntas frecuentes
  document.querySelectorAll(".pregFrec").forEach((e) => {
    e.addEventListener("click", () => {
      e.nextElementSibling.classList.toggle("oculto");
      e.lastElementChild.classList.toggle("bi-plus");
      e.lastElementChild.classList.toggle("bi-x");
    });
  });

  //modo oscuro por defecto
  const bgPrimario = document.querySelectorAll("body");
  bgPrimario.forEach((e) => e.classList.add("bgPrimarioOscuro"));

  const bgSecundario = document.querySelectorAll(".menuDesplegable");
  bgSecundario.forEach((e) => e.classList.add("bgSecundarioOscuro"));

  const clFuente = document.querySelectorAll(
    "body, h1, .menuDesplegable a, .menuDesplegable i, input, textarea, button, #captcha, .info, .genero"
  );
  clFuente.forEach((e) => e.classList.add("clOscuro"));

  const destacado = document.querySelectorAll(
    "h1 span, form span, #resultadoCaptcha, .respForm"
  );
  destacado.forEach((e) => e.classList.add("destacadoOscuro"));

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

  //mostrar contenido Detalles/Quzas tambien te guste
  const btnDetalles = document.querySelector(".detalles");
  const btnQuizasGuste = document.querySelector(".quizasGuste");
  const contenidoDetalles = document.querySelector(".contenidoDetalles");
  const contenidoQuizasGuste = document.querySelector(".contenidoQuizasGuste");

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
});
