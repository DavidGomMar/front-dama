$(function () {
    // Llama a la función para obtener y mostrar las marcas al cargar la página
    obtenerListaSubmarcas();
    obtenerListaMarcas();
});


function obtenerListaMarcas() {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    // Realiza una solicitud GET para obtener la lista de marcas desde la API
    fetch("http://localhost:8090/fama-market/api/brands/all", {headers})
        .then((response) => response.json())
        .then((marcas) => {
            // Llama a la función para mostrar las marcas en la consola
            console.log(marcas);
            
            // Llama a la función para mostrar las marcas en el combo
            mostrarMarcasEnCombo(marcas);
        })
        .catch((error) => {
            console.error('Error al obtener la lista de marcas:', error);
        });
}

function mostrarMarcasEnCombo(marcas) {
    // Obtén la referencia al combo de marcas
    var marcaSelect = document.getElementById("marcaSelect");

    // Limpiar el contenido actual del combo
    marcaSelect.innerHTML = '';

    // Crea una opción predeterminada
    var opcionPredeterminada = document.createElement("option");
    opcionPredeterminada.text = "Selecciona una marca"; // Puedes cambiar el texto según tus necesidades
    marcaSelect.appendChild(opcionPredeterminada);

    // Itera sobre las marcas y agrega opciones al combo
    marcas.forEach((marca) => {
        var opcion = document.createElement("option");
        opcion.value = marca.brandId;
        opcion.text = marca.nameBrand;
        marcaSelect.appendChild(opcion);
    });
}

// Llama a la función para obtener y mostrar las marcas al cargar la página
obtenerListaMarcas();

function obtenerListaSubmarcas() {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    // Realiza una solicitud GET para obtener la lista de submarcas desde la API
    fetch("http://localhost:8090/fama-market/api/subbrands/all", {headers})
        .then((response) => response.json())
        .then((submarcas) => {
            // Llama a la función para mostrar las submarcas en la tabla
            mostrarSubmarcasEnTabla(submarcas);
        })
        .catch((error) => {
            console.error('Error al obtener la lista de submarcas:', error);
        });
}

function mostrarSubmarcasEnTabla(submarcas) {
    // Obtén la referencia a la tabla
    var tabla = document.getElementById("submarcasTabla");

    // Limpiar el contenido actual de la tabla
    tabla.innerHTML = '';

    // Itera sobre las submarcas y agrega filas a la tabla
    submarcas.forEach((submarca) => {
        var fila = tabla.insertRow();

        // Inserta las celdas con los datos de la submarca
        fila.insertCell(0).innerText = submarca.subBrandId;
        fila.insertCell(1).innerText = submarca.nameSubBrand;

        // Muestra la imagen utilizando la etiqueta <img>
        var celdaImagen = fila.insertCell(2);
        var imagen = document.createElement("img");
        imagen.src = "data:image/jpeg;base64," + submarca.linkImageSubbrand;
        imagen.alt = submarca.nameSubBrand;
        imagen.style.width = "50px";
        celdaImagen.appendChild(imagen);

        // Agrega un botón para acciones (editar, eliminar, etc.)
        var celdaAcciones = fila.insertCell(3);
        celdaAcciones.innerHTML =  '<button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminarMarcas">Eliminar</button>';
    });
}

function filtrarSubmarcas() {
    // Obtener el valor del buscador
    var input = document.getElementById('searchInput');
    var filtro = input.value.toLowerCase(); // Convertir a minúsculas para una comparación sin distinción entre mayúsculas y minúsculas

    // Obtener la tabla y las filas
    var tabla = document.getElementById('submarcasTabla');
    var filas = tabla.getElementsByTagName('tr');

    // Iterar sobre las filas y mostrar u ocultar según el filtro
    for (var i = 0; i < filas.length; i++) {
        var celdaSubmarca = filas[i].getElementsByTagName('td')[1]; // Ajusta el índice según tu estructura de la tabla
        if (celdaSubmarca) {
            var textoCelda = celdaSubmarca.textContent || celdaSubmarca.innerText;
            if (textoCelda.toLowerCase().indexOf(filtro) > -1) {
                filas[i].style.display = '';
            } else {
                filas[i].style.display = 'none';
            }
        }
    }
}
