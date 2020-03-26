var segundos;
const reloj = document.getElementsByClassName("timer");
var intervalo;

function segundosincremento() {
  segundos += 1;
  formato(segundos);
}

function formato(param1) {
  let segundostotales = param1;
  let horas = Math.floor(segundostotales / 3600);
  segundostotales %= 3600;
  let minutos = Math.floor(segundostotales / 60);
  let segundos = segundostotales % 60;
  minutos = String(minutos).padStart(2, "0");
  horas = String(horas).padStart(2, "0");
  segundos = String(segundos).padStart(2, "0");
  reloj[0].innerText = horas + ":" + minutos + ":" + segundos;
  reloj[1].innerText = horas + ":" + minutos + ":" + segundos;
}

function testreloj() {
  intervalo = setInterval(segundosincremento, 1000);
};

