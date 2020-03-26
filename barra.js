var i = 0;

function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("barraRosaProgreso");
    var width = 0;
    var id = setInterval(frame, (segundos*58.8)); //El intervalo de progreso, o velocidad, depende de los segundos del gif
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width = width + 5.8;
        elem.style.width = width + "%";
      }
    }
  }
}

function move2() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("barraDeProgreso2");
    var width = 0;
    var id = setInterval(frame, (segundos*35)); //El intervalo de progreso, o velocidad, depende de los segundos del gif
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
        move2();
      } else {
        width = width + 5.8;
        elem.style.width = width + "%";
      }
    }
  }
}
