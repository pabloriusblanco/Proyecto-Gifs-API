//======================================//
////////////VARIABLES GLOBALES////////////
//======================================//

const giphyApiKeyValue = "m1BBXCFcQUbA9sf0r6s7iuumcwgPXiEI";
let input;


//======================================//
///////////STARTUP DE LA PAGINA////////////
//======================================//

let botonBusqueda;
let bodyScroll;
let tendencias;

document.addEventListener( //Funciones que se cargan junto con la pagina
  "DOMContentLoaded",
  function () {
    sessionStorage.removeItem("galeria");
    input = document.getElementById("inputbusqueda");
    botonBusqueda = document.querySelector(".botonbusqueda");
    bodyScroll = document.getElementById("body");
    tendencias = document.querySelector(".previewTendGif");
    trendingresult();
    estilosDinamicos();
    inputEnteryClick();
    hoyTeSugerimos();
    cambioTemaOnLoad()
    resultadosSugeridos();
    botonesAzules()
    sugerenciasFijas()
  },
  false
);

//======================================//
////////////ESTILOS DINAMICOS////////////
//======================================//

function estilosDinamicos() {  ///BOTONES DE TEMA
  let botones = document.getElementsByClassName("botonestema");
  let sailors = document.querySelector(".botonesSailors");
  for (let index = 0; index < botones.length; index++) {
    botones[index].addEventListener("click", function () {
      if (sailors.classList.contains("displaynone")) {
        sailors.classList.remove("displaynone");
        Clickfuera()
      }
      else {
        sailors.classList.add("displaynone");
      };
    });
  };
  /// CAMBIOS DE TEMA
  document.getElementById("SailorNight").addEventListener("click", function () {
    sailors.classList.add("displaynone");
    temaSailorDark();
  });
  document.getElementById("SailorDay").addEventListener("click", function () {
    sailors.classList.add("displaynone");
    temaSailorDay()
  });
  /// PAGINA CREAR GIFOS
  document.getElementById("crearGifos").addEventListener("click", function () {
    window.location.href = "upload.html";
    sessionStorage.setItem("galeria", "false");
  })
};


function limpiarInput() {
  input.value = "";
  document.querySelector(".lupainactivo").style.display = "block";
  document.querySelector(".lupafocus").style.display = "none";
  document.getElementById("textoBuscar").style.color = "#b4b4b4";
  document.querySelector(".botonbusqueda").style.backgroundColor = "#e6e6e6";
  document.querySelector(".resultadosSugeridos3").style.display = "none";
};


//======================================//
////////////CAMBIOS DE TEMA///////////
//======================================//

function cambioTemaOnLoad() {
  if (sessionStorage.getItem("theme") == "dark") {
    temaSailorDark();
  }
};

function temaSailorDark() {
  document.getElementById("theme").setAttribute("href", "./styles/styleNight.css");
  document.getElementById("SailorNight").classList.remove("desactivoSailor");
  document.getElementById("SailorDay").classList.add("desactivoSailor");
  sessionStorage.setItem("theme", "dark");
}

function temaSailorDay() {
  document.getElementById("theme").setAttribute("href", "./styles/style.css");
  document.getElementById("SailorDay").classList.remove("desactivoSailor");
  document.getElementById("SailorNight").classList.add("desactivoSailor");
  sessionStorage.setItem("theme", "day");
}

function Clickfuera() {
  document.addEventListener('click', function (event) {
    var clickdentro = document.querySelector(".themeClick").contains(event.target);
    if (!clickdentro) {
      document.querySelector(".botonesSailors").classList.add("displaynone");
      document.removeEventListener('click', function () { });
    }
  });
};


//======================================//
////////////BUSQUEDA PRINCIPAL///////////
//======================================//

let endPointSelector = 0; //0 = trend 1=search
let offset = 0;
let valueBusqueda;

function inputEnteryClick() {
  botonBusqueda.addEventListener("click", function () {
    if (input.value.length > 0 && input.value.trim().length != 0) {
    document.getElementById("textoTendenciasBusquedas").innerText =
      "Busqueda: " + input.value;
    clickbusqueda();
    scroll()
};
});
  input.addEventListener("keyup", enter => {
    if (input.value != "" && enter.keyCode == 13) {
      document.getElementById("textoTendenciasBusquedas").innerText =
        "Busqueda: " + input.value;
      document.getElementById("textoTendenciasBusquedas").scrollIntoView({ behavior: "smooth" });
      clickbusqueda();
      scroll()
    }
  });
}

function clickbusqueda() {
  offset = 0;
  valueBusqueda = input.value;
  ultimasBusquedas(valueBusqueda);
  getSearchResults(valueBusqueda);
  clear();
  limpiarInput();
}

function getSearchResults(input) {
  console.log("Se comenzo a buscar el termino: " + input)
  fetch(
    "https://api.giphy.com/v1/gifs/" +
    "search?q=" +
    input +
    "&api_key=" +
    giphyApiKeyValue +
    "&limit=" +
    16 + //cantidad que trae
    "&offset=" +
    offset
  )
    .then(response => {
      response.json()
        .then(gifobj => {
          endPointSelector = 1;
          manejodeJson(gifobj);
        });
    })
    .catch(error => {
      console.error(error); // Que hacer con el error?
    });
}


//======================================//
//////////////JSON DE GIPHY///////////////
//======================================//

function manejodeJson(json) {
  if (json.pagination.count == 0 && tendencias.childElementCount < 2) {
    //cero resultados
    clear();
    let divcontainer = document.createElement("div");
    divcontainer.setAttribute("class", "falloencuentro");
    divcontainer.innerText = "No se encontraron GIFS";
    tendencias.appendChild(divcontainer);
  } else {
    //resultados
    let largo = json.data.length;
    for (let index = 0; index < largo; index++) {
      let divcontainer = document.createElement("div");
      let imagenfetched = document.createElement("img");
      imagenfetched.src = json.data[index].images.fixed_height.url;
      imagenfetched.alt = json.data[index].title;
      divcontainer.setAttribute("class", "tendGif small");
      tendencias.appendChild(divcontainer).appendChild(imagenfetched);
    }
  }
}

function clear() {
  document.querySelector(".previewTendGif").innerHTML = "";
}



//======================================//
//////////RESULTADOS SUGERIDOS////////////
//======================================//

let timeout = true;

function resultadosSugeridos() {
  input.addEventListener("keyup", function () {
    if (input.value.length >= 4) {
      if (sessionStorage.getItem("theme") == "dark") { //DARK THEME
        document.querySelector(".lupalight").style.display = "block";
        document.getElementById("textoBuscar").style.color = "#FFFFFF";
        document.querySelector(".botonbusqueda").style.backgroundColor = "#EE3EFE";
      }
      else { //LIGHT THEME
        document.querySelector(".lupafocus").style.display = "block";
        document.getElementById("textoBuscar").style.color = "#110038";
        document.querySelector(".botonbusqueda").style.backgroundColor = "#F7C9F3";
      };
      document.querySelector(".lupainactivo").style.display = "none";
      document.querySelector(".resultadosSugeridos3").style.display = "block";

      /// FETCH
      if (timeout == true) {
        
        fetch("https://api.giphy.com/v1/gifs/" + "search?q=" + input.value + "&api_key=" + giphyApiKeyValue +
          "&limit=" + 3 //cantidad que trae
        )
          .then(response => {
            response.json()
              .then(sugerenciaJson => {
                try {
                  for (let index = 0; index <= 2; index++) {
                    let sugeridoArray = document.getElementsByClassName("textoSugerido");
                    sugerenciaJson.data[index].title = sugerenciaJson.data[index].title.replace("GIF", "");
                    sugerenciaJson.data[index].title = sugerenciaJson.data[index].title.replace("by", "");
                    if (sugerenciaJson.data[index].title.length >= 4) {
                      sugeridoArray[index].innerText = sugerenciaJson.data[index].title;
                    };
                  };
                  setTimeout(() => {
                    console.log(timeout)
                    timeout = true;
                  }, 300);
                  timeout = false
                }
                catch (error) {
                  console.log("Se quedo pagination count" + error);
                };
              })
          })
          .catch(error => {
            console.error("errror en sugeridos" + error);
          });
          listenerdeSugeridos() 
    };
  };

    if (input.value.length < 4) {
      ocutarSugeridos()
    }
  });
  input.addEventListener("focusout", function () {
    ClickfueraBusqueda()
   })
};

function ocutarSugeridos() {
  document.querySelector(".lupainactivo").style.display = "flex";
  document.querySelector(".resultadosSugeridos3").style.display = "none";
  document.querySelector(".lupafocus").style.display = "none";
  document.querySelector(".lupalight").style.display = "none";
  document.getElementById("textoBuscar").style.color = "#b4b4b4";
  document.querySelector(".botonbusqueda").style.backgroundColor = "unset";
}

function listenerdeSugeridos() {
  console.log("iniciado listener sugeridos")
  let arraysugeridos = document.getElementsByClassName("resultadosugerido")
  for (let index = 0; index < arraysugeridos.length; index++) {
    arraysugeridos[index].addEventListener("click", function () {
      input.value = arraysugeridos[index].querySelector(".textoSugerido").innerText;
      input.focus();
    })
  }
}

function ClickfueraBusqueda() {
  document.addEventListener('click', function (event) {
    var clickdentro = document.querySelector(".contenedorVentanaBuscador").contains(event.target);
    if (!clickdentro) {
      ocutarSugeridos();
      document.removeEventListener('click', function () { });
    }
  });
};

//======================================//
///////////ULTIMAS BUSQUEDAS/////////////
//======================================//

let arrayBusquedas = []

function ultimasBusquedas(input) {
  arrayBusquedas = JSON.parse(sessionStorage.getItem("busquedas")) || [];
  arrayBusquedas.unshift(input);
  sessionStorage.setItem("busquedas", JSON.stringify(arrayBusquedas));
  botonesAzules()
}

function botonesAzules() {
  let contenedorAzules = document.querySelector(".ultimasBusquedas");
  if (arrayBusquedas.length == 0) {
    arrayBusquedas = JSON.parse(sessionStorage.getItem("busquedas")) || [];
    if (arrayBusquedas[0] != undefined) {
      for (let index = 0; index <= 2; index++) {
      let buttoncontainer = document.createElement("button");
      buttoncontainer.setAttribute("class", "botonazul");
      buttoncontainer.setAttribute("class", "botonazul busquedasRelacionaladas");
      buttoncontainer.innerText = arrayBusquedas[index];
      contenedorAzules.appendChild(buttoncontainer)
      listenerBotonesAzules()
    }
  }

  }
  else {
    if (contenedorAzules.childElementCount >= 3) {
      contenedorAzules.lastChild.remove()
    }
    let buttoncontainer = document.createElement("button");
    buttoncontainer.setAttribute("class", "botonazul");
    buttoncontainer.setAttribute("class", "botonazul busquedasRelacionaladas");
    buttoncontainer.innerText = arrayBusquedas[0];
    contenedorAzules.insertBefore(buttoncontainer, (contenedorAzules.firstChild));
    let ultimobotonazul = contenedorAzules.firstChild;
    ultimobotonazul.addEventListener("click", function () {
      input.value = ultimobotonazul.innerText;
      document.getElementById("textoTendenciasBusquedas").innerText = "Busqueda: " + input.value;
      scroll();
      clickbusqueda()
    });
  }
}

function listenerBotonesAzules() {
  let arraybotones = document.getElementsByClassName("busquedasRelacionaladas")
  for (let index = 0; index < arraybotones.length; index++) {
    arraybotones[index].addEventListener("click", function () {
      input.value = document.querySelector(".ultimasBusquedas").firstChild.innerText;
      document.getElementById("textoTendenciasBusquedas").innerText = "Busqueda: " + input.value;
      scroll();
      clickbusqueda()
    })
  }
}
//======================================//
////////////RECOMENDADOS FIJOS///////////
//======================================//
let jsonTirar;

function sugerenciasFijas() {
  fetch(
    "https://api.giphy.com/v1/gifs?api_key=m1BBXCFcQUbA9sf0r6s7iuumcwgPXiEI" + 
    "&ids=" + "l378BzHA5FwWFXVSg,12vJgj7zMN3jPy,yAYZnhvY3fflS,ZHlGzvZb130nm"
  )
    .then(response => {
      response.json().then(json => {
        console.log(json);
        jsonTirar = json;
        let arraySugerenciasFijas = document.getElementsByClassName("maingifPreview");
        for (let index = 0; index < 4; index++) {
          let imagenfetched = document.createElement("img");
          imagenfetched.src = json.data[index].images.fixed_height.url;
          imagenfetched.alt = json.data[index].title;
          arraySugerenciasFijas[index].appendChild(imagenfetched); 
        }
      });
    })
    .catch(error => {
      console.error(error);
    });
}


//======================================//
//////////////TENDENCIAS///////////////
//======================================//

function trendingresult() {
  fetch(
    "https://api.giphy.com/v1/gifs/trending?" +
    "&api_key=" +
    "m1BBXCFcQUbA9sf0r6s7iuumcwgPXiEI" +
    "&limit=" +
    16 + //cantidad que trae
    "&offset=" +
    offset
  )
    .then(response => {
      response.json().then(gifobj => {
        manejodeJson(gifobj);
      });
    })
    .catch(error => {
      console.error(error);
    });
}

function hoyTeSugerimos() {
  let cuatroSugerencias = document.getElementsByClassName("botonazulSugerencias");
  for (let index = 0; index < cuatroSugerencias.length; index++) {
    cuatroSugerencias[index].addEventListener("click", function () {
      input.value = document.getElementsByClassName("gifPreview")[index].querySelector(
        ".tendenciasnombre"
      ).innerText;
      document.getElementById("textoTendenciasBusquedas").innerText =
        "Busqueda: " + input.value;
      scroll()
      clickbusqueda();
    });
  }
}

//======================================//
/////////SCROLL y INFINITO EXTRA///////////
//======================================//
function scroll() {
  setTimeout(() => {
    document.getElementById("textoTendenciasBusquedas").scrollIntoView({ behavior: "smooth" });
  }, 500);
}


window.onscroll = infiniteScroll;
// Variable usada para checkear si puede ejecutar de nuevo
var isExecuted = false;

function infiniteScroll() {
  if (
    window.scrollY > document.body.offsetHeight - window.outerHeight &&
    !isExecuted
  ) {
    isExecuted = true;
    if (endPointSelector == 0) {
      offset = offset + 16;
      trendingresult();
      setTimeout(() => {
        //un timeout de 0.5 segundos
        isExecuted = false;
      }, 1000);
    }
    if (endPointSelector == 1) {
      offset = offset + 16;
      getSearchResults(valueBusqueda);
      setTimeout(() => {
        //un timeout de 0.5 segundos
        isExecuted = false;
      }, 1000);
    }
  }
}
