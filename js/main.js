let tipoFuncion = "";
let nivel = 1;
let puntaje = 0;
let expresion = "";

// Para controlar funciones ya usadas y evitar repeticiones
const funcionesUsadas = new Set();

function dibujarEjes(ctx) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(500, 200);
  ctx.moveTo(250, 0);
  ctx.lineTo(250, 400);
  ctx.stroke();

  ctx.font = "10px Arial";
  ctx.fillStyle = "#000";
  for (let x = -200; x <= 200; x += 50) {
    if (x !== 0) ctx.fillText(x / 10, 250 + x, 210);
  }
  for (let y = -150; y <= 150; y += 50) {
    if (y !== 0) ctx.fillText(-y / 10, 255, 200 + y);
  }
}

function explicarTipo(tipo) {
  switch (tipo) {
    case "lineal":
      return "representa una línea recta, su gráfica tiene pendiente constante.";
    case "cuadratica":
      return "forma una parábola, ya que tiene un término x².";
    case "cubica":
      return "tiene forma de 'S', por el término x³.";
    case "constante":
      return "es una línea horizontal, porque el valor de y no cambia.";
    case "reciproca":
      return "es una curva hiperbólica, típica de 1/x.";
    default:
      return "";
  }
}

function generarFuncion() {
  const ctx = document.getElementById("grafica").getContext("2d");
  ctx.clearRect(0, 0, 500, 400);
  dibujarEjes(ctx);

  const funciones = ["lineal", "cuadratica", "cubica", "constante", "reciproca"];

  // Elegir función que no se haya usado aún
  let posibles = funciones.filter(f => !funcionesUsadas.has(f));
  if (posibles.length === 0) {
    // Si ya usó todas, reinicia el set para repetir
    funcionesUsadas.clear();
    posibles = funciones;
  }
  tipoFuncion = posibles[Math.floor(Math.random() * posibles.length)];
  funcionesUsadas.add(tipoFuncion);

  ctx.beginPath();
  ctx.strokeStyle = "#0074D9";
  let first = true;
  const valores = { a: 0, b: 0, c: 0 };

  if (tipoFuncion === "lineal") {
    valores.a = (Math.random() * 2 - 1).toFixed(1);
    valores.b = (Math.random() * 5 - 2.5).toFixed(1);
    expresion = `f(x) = ${valores.a}x + ${valores.b}`;
  } else if (tipoFuncion === "cuadratica") {
    valores.a = (Math.random() * 0.5 + 0.1).toFixed(2);
    valores.b = (Math.random() * 1 - 0.5).toFixed(1);
    valores.c = (Math.random() * 2 - 1).toFixed(1);
    expresion = `f(x) = ${valores.a}x² + ${valores.b}x + ${valores.c}`;
  } else if (tipoFuncion === "cubica") {
    valores.a = (Math.random() * 0.05 + 0.005).toFixed(3);
    valores.b = (Math.random() * 0.2 - 0.1).toFixed(2);
    valores.c = (Math.random() * 1 - 0.5).toFixed(1);
    expresion = `f(x) = ${valores.a}x³ + ${valores.b}x + ${valores.c}`;
  } else if (tipoFuncion === "constante") {
    valores.a = (Math.random() * 10 - 5).toFixed(1);
    expresion = `f(x) = ${valores.a}`;
  } else if (tipoFuncion === "reciproca") {
    valores.a = (Math.random() * 5 + 1).toFixed(1);
    expresion = `f(x) = ${valores.a}/x`;
  }

  for (let x = -25; x <= 25; x += 0.2) {
    if (x === 0 && tipoFuncion === "reciproca") continue;
    let y;
    if (tipoFuncion === "lineal") {
      y = valores.a * x + Number(valores.b);
    } else if (tipoFuncion === "cuadratica") {
      y = valores.a * x * x + valores.b * x + Number(valores.c);
    } else if (tipoFuncion === "cubica") {
      y = valores.a * x * x * x + valores.b * x + Number(valores.c);
    } else if (tipoFuncion === "constante") {
      y = Number(valores.a);
    } else if (tipoFuncion === "reciproca") {
      y = valores.a / x;
    }

    let px = 250 + x * 10;
    let py = 200 - y * 10;
    if (first) {
      ctx.moveTo(px, py);
      first = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  document.getElementById("resultado").textContent = "";
}

function verificarRespuesta(respuesta) {
  const resultado = document.getElementById("resultado");
  const explicacion = explicarTipo(tipoFuncion);

  if (respuesta === tipoFuncion) {
    resultado.textContent = `✅ ¡Correcto! Era una función ${tipoFuncion} porque ${explicacion}`;
    puntaje += 10;
    document.getElementById("puntaje").textContent = "Puntaje: " + puntaje;

    setTimeout(() => {
      nivel++;
      if (nivel > 10) {
        document.getElementById("contenido").style.display = "none";
        document.getElementById("final").style.display = "block";
        document.getElementById("puntajeFinal").textContent = puntaje;
      } else {
        document.getElementById("nivel").textContent = "Nivel: " + nivel;
        generarFuncion();
      }
    }, 4000);
  } else {
    resultado.textContent = `❌ Incorrecto. Era: ${expresion}. Intenta de nuevo.`;
  }
}

document.querySelectorAll("#opciones button").forEach(btn => {
  btn.addEventListener("click", () => {
    verificarRespuesta(btn.dataset.tipo);
  });
});

document.getElementById("reiniciar").addEventListener("click", () => {
  nivel = 1;
  puntaje = 0;
  funcionesUsadas.clear();
  document.getElementById("nivel").textContent = "Nivel: 1";
  document.getElementById("puntaje").textContent = "Puntaje: 0";
  document.getElementById("contenido").style.display = "block";
  document.getElementById("final").style.display = "none";
  generarFuncion();
});

window.onload = () => {
  generarFuncion();
};
