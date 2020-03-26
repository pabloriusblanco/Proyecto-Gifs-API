//======================================//
////////////VARIABLES GLOBALES////////////
//======================================//
const giphyApiKeyValue = "m1BBXCFcQUbA9sf0r6s7iuumcwgPXiEI";
let feedDeCamara;
let recorder;
let blob;
let timeoutrecorder;


//======================================//
///////////STARTUP DE LA PAGINA////////////
//======================================//

document.addEventListener(
  "DOMContentLoaded",
  function () {
    if (sessionStorage.getItem("galeria") == "false") {
      document.getElementById("uploadindex").style.display = "block";
    }
    let flecha = document.getElementById("flecha");
    let botoncancelar = document.getElementById("botoncancelar");
    let botoncancelar2 = document.getElementById("botoncancelar2");
    galeria = document.getElementById("galeriaMisGifos");
    toindex(flecha, botoncancelar);
    touploadindex(botoncancelar2);
    cambioTemaOnLoad();
    galeriaMisGifos();
    obtenerCamara();
    comenzarGrabacion();
    detenerGrabacion();
    subirGifo();
    copiarInput();
    misGifos();
  },
  false
);

//======================================//
////////////NAVEGACION Y ACCIONES///////////
//======================================//


function toindex(param1, param2) {
  param1.addEventListener(
    "click",
    function () {
      window.location.href = "index.html";
    },
    false
  );
  param2.addEventListener(
    "click",
    function () {
      window.location.href = "index.html";
    },
    false
  );
}

function touploadindex(parametro1) {
  parametro1.addEventListener(
    "click",
    function () {
      document.getElementById("ventanavideoprincipal").style.display = "none";
      document.getElementById("contenedorvideo").style.display = "none";
      document.getElementById("uploadindex").style.display = "block";
      document.getElementById("misgifosprincipal").style.display = "block"; // SEccion Gifos
    },
    false
  );
}


//======================================//
////////////CAMBIOS DE TEMA///////////
//======================================//

function cambioTemaOnLoad() {
  if (sessionStorage.getItem("theme") == "dark")
    temaSailorDark();
};

function temaSailorDark() {
  document.getElementById("theme").setAttribute("href", "./styles/styleNight.css");
}


//======================================//
////////////////OBTENER CAMARA///////////////
//======================================//
let obtenerCamaraBotones = []

function obtenerCamara() {

  obtenerCamaraBotones = [
    document.getElementById("botoncomenzar"),
    document.getElementById("repetircaptura")
  ];

  obtenerCamaraBotones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      document.getElementById("misgifosprincipal").style.display = "none"; // SEccion Gifos
      document.getElementById("ventanavideoprincipal").style.display = "block";
      document.querySelector(".botonesCancelarCaptura").style.display = "flex";
      document.getElementById("contenedorvideo").style.display = "block";
      document.getElementById("uploadindex").style.display = "none";
      document.querySelector(".botonesTimerListo").style.display = "none";
      document.querySelector(".principalVistaprevia").style.display = "none";
      let video = document.getElementById("videopreview");
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            height: { max: 480 }
          }
        })
        .then(function (stream) {
          feedDeCamara = stream;
          video.srcObject = stream;
          video.play();
        })
        .catch(e => console.error(e));
    });
  });
};

//======================================//
////////////COMENZAR GRABACION///////////////
//======================================//

function comenzarGrabacion() {
  document.getElementById("botoncaptura").addEventListener("click", function () {
    document.getElementById("foward").addEventListener("click", function () {
      move();
    });
    document.getElementById("contenedorvideo2").innerHTML = ""; // BORA LA CAPTURA ANTERIOR
    segundos = 0; // Resetea los segundos a cero
    document.getElementById("tituloventana").innerText = "Capturando Tu Guifo";
    document.querySelector(".botonesTimerListo").style.display = "flex";
    document.querySelector(".botonesCancelarCaptura").style.display = "none";
    recorder = RecordRTC(feedDeCamara, {
      type: "gif",
      frameRate: 1,
      quality: 10,
      width: 280,
      hidden: 240,
      onGifRecordingStarted: function () {
        console.log("started");
      }
    });
    testreloj();
    recorder.startRecording();
    timeoutrecorder = true;
    setTimeout(() => {
      timeoutrecorder = false;
      console.log(timeoutrecorder)
    }, 1500);
  });
};

//======================================//
////////////DETENER GRABACION///////////////
//======================================//
function detenerGrabacion() {
  document.getElementById("botonListo").addEventListener("click", function () {
    if (timeoutrecorder == false) {
      document.getElementById("ventanavideoprincipal").style.display = "none";
      document.querySelector(".principalVistaprevia").style.display = "block";
      let video = document.createElement("img");
      document.getElementById("contenedorvideo2").appendChild(video);
      recorder.stopRecording(); // detiene la grabacion//
      clearInterval(intervalo); // detiene el timer
      feedDeCamara.getTracks().map(function (cam) {
        //detiene la webcam//
        cam.stop();
      });
      blob = recorder.getBlob();
      video.setAttribute("src", URL.createObjectURL(blob));
      document.getElementById("contenedorvideo2").style.display = "block";
      recorder.destroy(); //destruye el objeto recorder//
      recorder = null; //lo redefine como null//
      document.getElementById("ventanavideoprincipal").style.display = "none";
    };
  });
};

//======================================//
////////////////SUBIR GIFO///////////////
//======================================//

function subirGifo() {
  document.getElementById("botonsubirgif").addEventListener("click", function () {
    document.getElementById("botoncancelarsubida").addEventListener("click", function () {
      window.location.href = "upload.html";
    });
    document.querySelector(".principalVistaprevia").style.display = "none";
    document.querySelector(".subiendoGifo").style.display = "block";
    move2();
    let form = new FormData();
    form.append('file', blob, 'myGif.gif');

    let formEnviar = { //crear una variable objeto con el metodo y el formdata
      method: "POST",
      body: form,
      //  json: true
    };

    fetch("https://upload.giphy.com/v1/gifs?api_key=" + giphyApiKeyValue, formEnviar)
      .then(response => {
        response.json()
          .then(response => {
            document.querySelector(".subiendoGifo").style.display = "none";
            document.getElementById("ventanaExito").style.display = "block"
            console.log(response);
            manejoPost(response);
          });
      })
      .catch(error => {
        console.error(error);
      });
  });
};

//======================================//
////////////COPIAR DESCARGAR///////////////
//======================================//
let idJson;

function manejoPost(idpost) {
  idJson = idpost.data.id;
  document.getElementById("botonListoExito").addEventListener("click", function () {
    window.location.href = "upload.html";
  });
  document.getElementById("misgifosprincipal").style.display = "block";
  let imagenfetched = document.createElement("img");
  urlCopiada = "https://media.giphy.com/media/" + idJson + "/giphy.gif";
  imagenfetched.src = urlCopiada;
  imagenfetched.alt = "Tu propio Gif";
  imagenfetched.setAttribute("class", "urltest")
  document.getElementById("contenedorSmallGifo").appendChild(imagenfetched);
  loadMisGifos(idJson);
  descarga()
};

//======================================//
///////////COPIAR Y DESCARGAR/////////////
//======================================//

let urlCopiada;

function copiarInput() {
  document.getElementById("botonCopiar").addEventListener("click", function () {
    let inputTemporal = document.createElement("input");
    let padre = document.querySelector(".inputylisto");
    inputTemporal.setAttribute("id", "testinput");
    inputTemporal.setAttribute("class", "testinput");
    padre.insertBefore(inputTemporal, padre.childNodes[0]);
    let inputchild = document.getElementById("testinput");
    inputchild.value = urlCopiada;
    document.querySelector(".pConExito").innerText = "Guifo COPIADO con éxito";
    copiado(inputchild)
  });
};


function copiado(parametro) {
  parametro.select();
  parametro.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
}

let blobltest;

function descarga() {
  document.getElementById("botonDescargar").addEventListener("click", function () {
    let temporalA = document.createElement("a")
    temporalA.setAttribute("href", URL.createObjectURL(blob));
    temporalA.setAttribute("download", "tuGifo.gif");
    temporalA.style.display = "none";
    document.body.appendChild(temporalA);
    temporalA.click();
    document.body.removeChild(temporalA);
  });
};



//======================================//
///////////////MIS GIFOS//////////////////
//======================================//

let arrayMisGifos = [];
let galeria

function misGifos() {
  document.getElementById("botonBorrarLocal").addEventListener("click", function () {
    if (confirm("¿Estás seguro que deseas eliminar los Gif de la galería?") == true) {
      let galeria = document.getElementById("galeriaMisGifos");
      localStorage.removeItem("IDs");
      galeria.innerHTML = "";
    };
  });
};

function loadMisGifos(id) {
  arrayMisGifos = JSON.parse(localStorage.getItem("IDs")) || [];
  arrayMisGifos.unshift(id);
  localStorage.setItem("IDs", JSON.stringify(arrayMisGifos));
  galeriaMisGifos();
}

function galeriaMisGifos() {
  galeria.innerHTML = "";
  arrayMisGifos = JSON.parse(localStorage.getItem("IDs")) || [];
  if (typeof (arrayMisGifos[0]) == "string") {
    for (let index = 0; index < arrayMisGifos.length; index++) {
      let divcontainer = document.createElement("div");
      let imagenfetched = document.createElement("img");
      imagenfetched.src = "https://media.giphy.com/media/" + arrayMisGifos[index] + "/giphy.gif"
      imagenfetched.alt = "Tu propio Gif";
      divcontainer.setAttribute("class", "tendGif small");
      galeria.appendChild(divcontainer).appendChild(imagenfetched);
    }
  }

}

//======================================//
//////////////////BARRA///////////////////
//======================================//

var num = 0;

function move() {
  if (num == 0) {
    num = 1;
    var elem = document.getElementById("barraRosaProgreso");
    var width = 0;
    var id = setInterval(frame, (segundos * 58.8));
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        num = 0;
      } else {
        width = width + 5.8;
        elem.style.width = width + "%";
      }
    }
  }
}

function move2() {
  if (num == 0) {
    num = 1;
    var elem = document.getElementById("barraDeProgreso2");
    var width = 0;
    //El intervalo de progreso, o velocidad, depende de los segundos del gif
    var id = setInterval(frame, (segundos * 50)); 
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        num = 0;
        width = 0;
      } else {
        width = width + 5.8;
        elem.style.width = width + "%";
      }
    }
  }
}

//======================================//
//////////////////TIMER///////////////////
//======================================//

let segundos;
const reloj = document.getElementsByClassName("timer");
let intervalo;

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

