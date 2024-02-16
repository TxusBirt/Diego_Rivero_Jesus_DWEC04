'use-strict'
// variables
var links; 
var datosIniciales=[];
var ruta = 'https://dragonball-api.com/api/characters';
var clasePlanetas=".planetas";
var clasePersonajes=".personajes";
var claseDetallesPersonaje=".detallesPersonajes";
var claseTransformacion = ".transformtotal";
var rutaDetalle = '';
var rutaRaza = '';
var num;
var regex = /\b\w*characters\w*\b/;
var regex1 = /\b\w*planets\w*\b/;
// funciones
// funcion para covertir en número los textos del valor del maxKi
function convertToNumeric (value) {
    //genero array asociativo con clave el texto y valor su valor en numero
    let factors = new Array();
    factors['billion']=Math.pow(10, 9);
    factors['trillion']=Math.pow(10, 12);
    factors['quadrillion']=Math.pow(10, 15);
    factors['quintillion']=Math.pow(10, 18);
    factors['sextillion']=Math.pow(10, 21);
    factors['septillion']=Math.pow(10, 24);
    factors['septllion']=Math.pow(10, 24);
    factors['octillion']=Math.pow(10, 27);
    factors['googolplex']=Math.pow(10, 30);    
    let numericValue;
    // Elimino espacios al inicio del string 
    let valor =value.trimStart();
    // convierrto el string en array para poder manipular sus valores
    let words = valor.split(" ");
    // distingo si hay una o 2 elemntos en el array generado
    if (words.length>1) {
        // Convertir la primera parte del valor a número y multiplicarla por el factor
        let factor = factors[words[1].toLowerCase()];
        numericValue =  parseFloat(words[0]) * factor;
        return numericValue;
    } else {
        numericValue =  parseFloat(words[0].replace(/[,.]/g, ''));
        return numericValue;
    }
}
// Función para convertir números a su formato original
function convertToText(value) {
    // Definir los factores de conversión inversa
    const inverseFactors = {
        "1000": "thousand",
        "1000000": "million",
        "1000000000": "billion",
        "1000000000000": "trillion",
        "1000000000000000": "quadrillion",
        "1000000000000000000": "quintillion",
        "1000000000000000000000": "sextillion",
        "1000000000000000000000000": "septillion",
        "1000000000000000000000000000": "octillion",
        "1000000000000000000000000000000": "googolplex",
    };
    // Encontrar el factor más cercano al valor dado
    let factor = Object.keys(inverseFactors).reduce((prev, curr) => {
        return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
    });
    // Calcular la parte numérica
    let numericPart = value / factor;
    let numero = Math.round(numericPart * 100) / 100;
    // Retornar el valor en formato original
    return `${numero} ${inverseFactors[factor]}`;
}
// funcion para crear las fichas que se usan para presentra personajes y planetas
function fichas_def(datos, clase) {
    //incluyo la imagen de cada personaje y genero la estructura
    for (let i = 0; i < datos.length; i++) {
        let carta = document.createElement('div');
        $(carta).addClass('carta');
        $(clase).append(carta);
        let contind=document.createElement('div');
        let elemento= document.createElement('img');
        $(carta).append(contind);
        $(contind).addClass('fichas');
        $(contind).attr('id', i);
        $(contind).append(elemento);
        elemento.src=datos[i].image;
        let listaDescripcion = document.createElement('ul');
        $(contind).append(listaDescripcion);
    // genero los datos de las fichas 
        for(let j = 0; j < 2; j++) {
            let lista = document.createElement('li');
            $(listaDescripcion).append(lista);
            // según la clase cojo unos datos u otros
            if(clase==".planetas") {
                if(j==0) {
                    $(lista).append("Nombre: " + datos[i].name);
                } else if (j==1) {
                    $(lista).append("Destruido: " + datos[i].isDestroyed);
                } 
            } else if (clase==".personajes") {
                if(j==0) {
                    $(lista).append("Nombre: " + datos[i].name);
                } else if (j==1) {
                    $(lista).append("Raza: " + datos[i].race);
                } 
            } else if (clase == ".detallesPersonajes" || clase==".transformtotal") {
                if(j==0) {
                    $(lista).append("Transformacion: " + datos[i].name);
                } else if (j==1) {
                    $(lista).append("Ki: " + datos[i].ki);
                } 
            } 
    }
    // boton que añado sólo a las fichas de personajes
    if (clase == '.personajes') {
        let botonficha = document.createElement('button');
        $(contind).append(botonficha);
        $(botonficha).append("Detalles Personaje");
        $(botonficha).addClass("transformacion");
        $(botonficha).attr('id', i);
    } else if (clase== '.planetas') {
        let botonficha = document.createElement('button');
        $(contind).append(botonficha);
        $(botonficha).append("Habitantes");
        $(botonficha).addClass("tipoPlaneta");
        $(botonficha).attr('id', i);
    }
    //genero la parte de atras de la ficha
    let contind1=document.createElement('div');
    $(carta).append(contind1);
    $(contind1).addClass('fichas1');
    $(contind1).attr('id', i + 'bis');
    if (clase == clasePersonajes) {
        let listaDescripcion1 = document.createElement('p');
        $(contind1).append(listaDescripcion1);
        $(listaDescripcion1).append("<span class='titulo'>Nombre</span>: " + datos[i].name + '<br>' +
                                    "<span class='titulo'>Raza</span>: "+ datos[i].race + '<br>' +
                                    "<span class='titulo'>Genero</span>: "+ datos[i].gender + '<br>' +
                                    "<span class='titulo'>Ki</span>: "+ datos[i].ki + '<br>' +
                                    "<span class='titulo'>Máximo Ki</span>: "+ datos[i].maxKi + '<br>' +
                                    "<span class='titulo'>Grupo</span>: "+ datos[i].affiliation + '<br>' );
    }  else if (clase==clasePlanetas) {
        let listaDescripcion1 = document.createElement('p');
        $(contind1).append(listaDescripcion1);
        $(listaDescripcion1).append("<span class='titulo'>Nombre</span>: " + datos[i].description);
    } else {
        let listaDescripcion1 = document.createElement('p');
        $(contind1).append(listaDescripcion1);
        $(listaDescripcion1).append('<span class="titulo">Ki estado actual: </span>' + datos[i].ki + 
                                        '<br><span class="titulo">Ki Máximo: </span>' + datos[datos.length-1].ki);
        }
    }
    vueltaCartaDef(".carta",datos);
}
// funcion para girar cada ficha
function vueltaCartaDef (clase,datos) {
    // un giro
    for(let i =0; i <datos.length; i++) {
        let element=document.getElementById(i);
        let elementBis=document.getElementById(i+"bis")
        $(clase).on('click', '#'+ i, function(){
        vueltaCarta(element,elementBis);
    })
    // vuelve al estado inicial
    $(clase).on('click', '#'+ i +'bis', function(){
        let element=document.getElementById(i);
        let elementBis=document.getElementById(i+"bis");
        vueltaCarta(elementBis,element);
    })
  }  
}
// propiedades necesarias para girar la carta
function vueltaCarta (elem1, elem2) {
    $(elem1).css('transform', 'rotateY(180deg)');
    $(elem2).css('transform', 'rotateY(360deg)');
}
//funcion que genera la vista de los datos de cada personaje
function detallePersonaje (datos){       
    let contCarac=document.createElement('div');
    let tituloNombre= document.createElement('h2');
    $('.detallesPersonajes').append(contCarac);
    $(tituloNombre).append(datos.name);
    $(contCarac).append(tituloNombre);
    $(contCarac).addClass('contenedorCaract');
    let caracteristicas= document.createElement('p');
    $(caracteristicas).addClass='detalles';
    let textoPersonaje = "<span class='titulo'> Nombre: </span>" + datos.name + "<br>" +
                        "<span class='titulo'>Raza: </span>" + datos.race + "<br>" +
                        "<span class='titulo'>Ki: </span>" + datos.ki + "<br>" +
                        "<span class='titulo'>Ki Máximo: </span>" + datos.maxKi + "<br>" +
                        "<span class='titulo'>Genero: </span>" + datos.gender + "<br>" +
                        "<span class='titulo'>Grupo: </span>" + datos.affiliation + "<br>" +
                        "<span class='titulo'>Historia: </span><br>" + datos.description + "<br>";          
    $(caracteristicas).append(textoPersonaje);
    $(contCarac).append(caracteristicas);
    let contenedorPlaneta = document.createElement('div');
    $('.detallesPersonajes').append(contenedorPlaneta);
    $(contenedorPlaneta).addClass('contenedorPlaneta');
    let imgPlanet = document.createElement('img');
    let textoPlaneta = "<span class='titulo'>Planeta: </span>" + datos.originPlanet.name + "<br>" +
                      "<span class='titulo'>Destruido: </span>" + datos.originPlanet.isDestroyed + "<br>" +
                      "<span class='titulo'>Descripción: </span>" + datos.originPlanet.description;
    imgPlanet.src=datos.originPlanet.image;
    let caractPlaneta = document.createElement('p');
    $(contenedorPlaneta).append(imgPlanet);
    $(contenedorPlaneta).append(caractPlaneta);
    $(caractPlaneta).addClass('textoPlaneta');
    $(caractPlaneta).append(textoPlaneta);
    fichas_def(datos.transformations,'.detallesPersonajes');
}
// elimina elements de interfaz visual
function reseteoIterfaz () {
    $('.carta').remove();
    $('.contenedorCaract').remove();
    $('.contenedorPlaneta').remove();
}
// reseteado de formularios
function reseteoformulario (paginas=null, nombre=null, grupo=null) {
    $(paginas).val('');
    $(nombre).val('');
    $(grupo).val('');
}
function ocultarElemHeader() {
    if ($('.caracteristicas').is(':visible')) {
        $('.caracteristicas').hide();
    } 
}
function mostrarElemHeader() {
    if ($('.caracteristicas').is(':hidden') ) {
        $('.caracteristicas').show();
    } 
}
function ocultarBtnOrdenar (){
    if  ($('#orden').is(':visible')) {
        $('#orden').hide();
    }
}
function mostrarBtnOrdenar (){
    if  ($('#orden').is(':hidden')) {
        $('#orden').show();
    }
}
// funcion que pide los datos de forma asincrona a la API. En funcion de la clase
// se pide un dato u otro
function peticionAsincrona(clase) {
    $.ajax({
        url: ruta,
        dataType: 'json',
        success: function(data) {
            if (data.items) {
                datosIniciales=data.items;         
            } else {
                datosIniciales=data;
            }
            if (datosIniciales.length<1){
                alert('No hay registros con los parametros de busqueda empleados');
                location.reload();
            } 
            fichas_def(datosIniciales, clase);
            links=data.links;
            if (clase==clasePersonajes) {
                for(let i = 0; i<datosIniciales.length;i++){
                    $("#" + i + ".transformacion").on("click", function(e){
                        ocultarBtnOrdenar();
                        ocultarElemHeader();
                        //reseteo formularios
                        reseteoformulario (paginas=null, '#nombre', '#grupo')
                        //elimino elementos presentes
                        reseteoIterfaz();
                        num=datosIniciales[i].id;
                        // detengo la propagacion de evento ya que el elemento padre tiene otro evento del
                        // mismo tipo
                        e.stopPropagation();
                        // pido los datos individuales en funcion del elemento que selecciono 
                        // con el evento click
                        rutaDetalle='https://dragonball-api.com/api/characters/'+num;
                        $.ajax({
                            url: rutaDetalle,
                            dataType: 'json',
                            success: function(data){
                                detallePersonaje(data);
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                // Código a ejecutar si la solicitud falla
                                console.error('Error en la solicitud:');
                                console.error('Código de estado:', jqXHR.status);
                                console.error('Mensaje de error:', textStatus);
                                console.error('Error arrojado:', errorThrown);
                            }
                        })
                    })
                }   
        }  else if (clase==clasePlanetas) {
                for(let i = 0; i<datosIniciales.length;i++){
                    $("#" + i + ".tipoPlaneta").on("click", function(e){
                        ocultarElemHeader();
                        ocultarBtnOrdenar();
                        //reseteo formularios
                        reseteoformulario (paginas=null, '#nombre', '#grupo')
                        //elimino elementos presentes
                        reseteoIterfaz();
                        num=datosIniciales[i].id;
                        // detengo la propagacion de evento ya que el elemento padre tiene otro evento del
                        // mismo tipo
                        e.stopPropagation();
                        // pido los datos individuales en funcion del elemento que selecciono 
                        // con el evento click
                        rutaDetalle='https://dragonball-api.com/api/planets/'+num;
                        $.ajax({
                            url: rutaDetalle,
                            dataType: 'json',
                            success: function(data){
                                let datos=data.characters;
                                fichas_def(datos, '.personajes');
                                for(let i = 0; i<datos.length;i++){
                                    $("#" + i + ".transformacion").on("click", function(e){
                                        ocultarBtnOrdenar();
                                        ocultarElemHeader();
                                        //reseteo formularios
                                        reseteoformulario (paginas=null, '#nombre', '#grupo')
                                        //elimino elementos presentes
                                        reseteoIterfaz();
                                        num=datos[i].id;
                                        // detengo la propagacion de evento ya que el elemento padre tiene otro evento del
                                        // mismo tipo
                                        e.stopPropagation();
                                        // pido los datos individuales en funcion del elemento que selecciono 
                                        // con el evento click
                                        rutaDetalle='https://dragonball-api.com/api/characters/'+num;
                                        $.ajax({
                                            url: rutaDetalle,
                                            dataType: 'json',
                                            success: function(data){
                                                detallePersonaje(data);
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                // Código a ejecutar si la solicitud falla
                                                console.error('Error en la solicitud:');
                                                console.error('Código de estado:', jqXHR.status);
                                                console.error('Mensaje de error:', textStatus);
                                                console.error('Error arrojado:', errorThrown);
                                            }
                                        })
                                    })
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                // Código a ejecutar si la solicitud falla
                                console.error('Error en la solicitud:');
                                console.error('Código de estado:', jqXHR.status);
                                console.error('Mensaje de error:', textStatus);
                                console.error('Error arrojado:', errorThrown);
                            }
                        })
                    })
            }
        } 
    },
    error: function(jqXHR, textStatus, errorThrown) {
            // Código a ejecutar si la solicitud falla
        console.error('Error en la solicitud:');
        console.error('Código de estado:', jqXHR.status);
        console.error('Mensaje de error:', textStatus);
        console.error('Error arrojado:', errorThrown);
    }
})
}
// main
$(document).ready(function(){    
    // llamo a la funcion para presentar los datos que forman la vista inicial
    peticionAsincrona(clasePersonajes);
    
    // evento al clickar boton planetas
    $("#planetas").on("click", function() {
        //escondo boton de ordenar
        mostrarBtnOrdenar();
        // hago aparecer los botones avance retroceso pagina y 
        // desplegable de numero de elementos si no está visible
        $('#orden').text('Ordenar Alfabéticamente');
        mostrarElemHeader()      
        // reseteo valor de formularios
        reseteoformulario ('#pers', '#nombre', '#grupo')
        ruta = 'https://dragonball-api.com/api/planets';
        // borro elementos si los hay
        reseteoIterfaz();
        peticionAsincrona(clasePlanetas);
    });
    // evento al clickar boton personajes
    $("#personajes").on("click", function(e) {
        mostrarElemHeader() 
        mostrarBtnOrdenar();
        $('#orden').text('Ordenar ki máximo');
        // reseteo formularios
        reseteoformulario ('#pers', '#nombre', '#grupo')
        ruta = 'https://dragonball-api.com/api/characters';
        reseteoIterfaz();
        e.stopPropagation();
        peticionAsincrona(clasePersonajes);
        
    });
    $("#transforTotal").on("click", function(e) {
        ocultarElemHeader();
        ocultarBtnOrdenar();
   
        // reseteo formularios
        reseteoformulario ('#pers', '#nombre', '#grupo')
        ruta = 'https://dragonball-api.com/api/transformations';
        reseteoIterfaz();
        e.stopPropagation();
        peticionAsincrona(claseTransformacion);
    });

    // evento al seleccionar en el desplegable numero de elementos
    $("#pers").on('change',function(){
        // borro elementos si los hay
        $('.contenedorCaract').remove();
        $('.contenedorPlaneta').remove();
        let parametroPag = $(this).val();
        // utilizo un patron para determinar el tipo de ruta y así asignarle un 
        // parametro u otro
        if (regex.test(ruta)) {
            ruta='https://dragonball-api.com/api/characters?limit=' + parametroPag;
            peticionAsincrona(clasePersonajes);
            } else {
                ruta='https://dragonball-api.com/api/planets?limit=' + parametroPag;
                peticionAsincrona(clasePlanetas);
            }
        $(".carta").remove();
    });
    // evento al seleccionar en el desplegable de grupos
    $("#grupo").on('change', function(){
        // condicional para hacer desaparecer los botones de avance-retroceso pagina y
        // formulario de nº elementos
        ocultarElemHeader();       
        ocultarBtnOrdenar();
        // borro elementos si los hay
        $('.contenedorCaract').remove();
        $('.contenedorPlaneta').remove();
        let parametroPag = $(this).val();
        if (parametroPag=='Namekian') {
            ruta='https://dragonball-api.com/api/characters?race=' + parametroPag;
        } else if (parametroPag=='Android') {
            ruta='https://dragonball-api.com/api/characters?race=' + parametroPag;
        } else {
            ruta='https://dragonball-api.com/api/characters?affiliation=' + parametroPag;
        }
        peticionAsincrona(clasePersonajes);
        $(".carta").remove();
    });
    
    $('#buscar').on('click', function(e){
        ocultarElemHeader();
        ocultarBtnOrdenar ()
        $('#grupo').val('');
        reseteoIterfaz();
        let parametroBuscar = $('#nombre').val().toLowerCase();
        e.stopPropagation();
        e.preventDefault();
        ruta='https://dragonball-api.com/api/characters?name=' + parametroBuscar;
        peticionAsincrona(clasePersonajes); 
    }

    );
    //  evento cuando cliko el boton siguiente
    $('#btn_siguiente').on('click', function(){
        let rutaSiguiente=links.next;
        ruta = rutaSiguiente;
        if (rutaSiguiente != ""){
            reseteoIterfaz();
        }
        if (regex.test(ruta)) {
            peticionAsincrona(clasePersonajes);
        } else if (regex1.test(ruta)){
            peticionAsincrona(clasePlanetas);
        }
    })
    //  evento cuando cliko el boton anterior
    $('#btn_anterior').on('click', function(){
        let rutaAnterior=links.previous;
        ruta = rutaAnterior;
        if (rutaAnterior!="") {
            reseteoIterfaz();
        } 
        if (regex.test(ruta)) {
            peticionAsincrona(clasePersonajes);
        } else if (regex1.test(ruta)){
            peticionAsincrona(clasePlanetas);
        }
    })
    // evento para ordenar elementos
    $('#orden').on("click", function(){
        let listaOrdenada;
        //reseteo formularios
        reseteoformulario (paginas=null, '#nombre', '#grupo')
        //elimino elementos presentes
        reseteoIterfaz();
        $.ajax({
            url: ruta,
            dataType: 'json',
            success: function(data) {
                if (data.items) {
                    datosIniciales=data.items;         
                } else {
                    datosIniciales=data;
                }
                if (datosIniciales.length<1){
                    alert('No hay registros con los parametros de busqueda empleados');
                    location.reload();
                } 
                // comparo con las rutas para ordenar personajes o planetas
                if (regex.test(ruta)){
                    datosIniciales.forEach(character => {
                        // Convertir el valor de maxKi a numérico 
                        character.maxKi = convertToNumeric(character.maxKi);
                    })
                    // ordeno array numerico
                    listaOrdenada=datosIniciales.sort((a, b) => b.maxKi - a.maxKi);
                    listaOrdenada.forEach(character => {
                        character.maxKi = convertToText(character.maxKi);
                    })
        
                    fichas_def(listaOrdenada,clasePersonajes);
                    } else if (regex1.test(ruta)) {
                        // ordeno array string
                        listaOrdenada=datosIniciales.sort((a, b) => a.name.localeCompare(b.name));
                        fichas_def(listaOrdenada,clasePlanetas);
                    }
                if (regex.test(ruta)) {
                    for(let i = 0; i<datosIniciales.length;i++){
                        $("#" + i + ".transformacion").on("click", function(e){
                            ocultarBtnOrdenar();
                            ocultarElemHeader();    
                            //reseteo formularios
                            reseteoformulario (paginas=null, '#nombre', '#grupo')
                            //elimino elementos presentes
                            reseteoIterfaz();
                            num=datosIniciales[i].id;
                            // detengo la propagacion de evento ya que el elemento padre tiene otro evento del
                            // mismo tipo
                            e.stopPropagation();
                            // pido los datos individuales en funcion del elemento que selecciono 
                            // con el evento click
                            rutaDetalle='https://dragonball-api.com/api/characters/'+num;
                            $.ajax({
                                url: rutaDetalle,
                                dataType: 'json',
                                success: function(data){
                                    detallePersonaje(data);
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    // Código a ejecutar si la solicitud falla
                                    console.error('Error en la solicitud:');
                                    console.error('Código de estado:', jqXHR.status);
                                    console.error('Mensaje de error:', textStatus);
                                    console.error('Error arrojado:', errorThrown);
                                }
                            })
                        })
                    }   
                }  else if (regex1.test(ruta)) {
                        for(let i = 0; i<datosIniciales.length;i++){
                            $("#" + i + ".tipoPlaneta").on("click", function(e){
                                ocultarElemHeader();
                                //reseteo formularios
                                reseteoformulario (paginas=null, '#nombre', '#grupo')
                                //elimino elementos presentes
                                reseteoIterfaz();
                                num=datosIniciales[i].id;
                                // detengo la propagacion de evento ya que el elemento padre tiene otro evento del
                                // mismo tipo
                                e.stopPropagation();
                                // pido los datos individuales en funcion del elemento que selecciono 
                                // con el evento click
                                rutaDetalle='https://dragonball-api.com/api/planets/'+num;
                                $.ajax({
                                    url: rutaDetalle,
                                    dataType: 'json',
                                    success: function(data){
                                        let datos=data.characters;
                                        fichas_def(datos, clasePersonajes);
                                        for(let i = 0; i<datos.length;i++){
                                            $("#" + i + ".transformacion").on("click", function(e){
                                                ocultarBtnOrdenar();
                                                ocultarElemHeader();    
                                                //reseteo formularios
                                                reseteoformulario (paginas=null, '#nombre', '#grupo')
                                                //elimino elementos presentes
                                                reseteoIterfaz();
                                                num=datos[i].id;
                                                // detengo la propagacion de evento ya que el elemento padre tiene otro evento del
                                                // mismo tipo
                                                e.stopPropagation();
                                                // pido los datos individuales en funcion del elemento que selecciono 
                                                // con el evento click
                                                rutaDetalle='https://dragonball-api.com/api/characters/'+num;
                                                $.ajax({
                                                    url: rutaDetalle,
                                                    dataType: 'json',
                                                    success: function(data){
                                                        detallePersonaje(data);
                                                    },
                                                    error: function(jqXHR, textStatus, errorThrown) {
                                                        // Código a ejecutar si la solicitud falla
                                                        console.error('Error en la solicitud:');
                                                        console.error('Código de estado:', jqXHR.status);
                                                        console.error('Mensaje de error:', textStatus);
                                                        console.error('Error arrojado:', errorThrown);
                                                    }
                                                })
                                            })
                                        }
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // Código a ejecutar si la solicitud falla
                                        console.error('Error en la solicitud:');
                                        console.error('Código de estado:', jqXHR.status);
                                        console.error('Mensaje de error:', textStatus);
                                        console.error('Error arrojado:', errorThrown);
                                    }
                                })
                            })
                    }
                }
            }})
    });
})
    