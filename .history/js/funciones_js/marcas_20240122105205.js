$(function () {
    // Llama a la función para obtener y mostrar las marcas al cargar la página
    obtenerListaMarcas();
    
});

function obtenerListaMarcas() {

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

    // Realiza una solicitud GET para obtener la lista de marcas desde la API
    fetch("http://localhost:8090/fama-market/api/brands/all", { headers })
        .then((response) => response.json())
        .then((marcas) => {
            // Llama a la función para mostrar las marcas en la tabla
            mostrarMarcasEnTabla(marcas);
        })
        .catch((error) => {
            console.error('Error al obtener la lista de marcas:', error);
        });
}

function mostrarMarcasEnTabla(marcas) {
    // Obtén la referencia a la tabla
    var tabla = document.getElementById("marcasTabla");

    // Limpiar el contenido actual de la tabla
    tabla.getElementsByTagName('tbody')[0].innerHTML = '';

    // Itera sobre las marcas y agrega filas a la tabla
    marcas.forEach((marca) => {
        var fila = tabla.insertRow();

        // Inserta las celdas con los datos de la marca
        fila.insertCell(0).innerText = marca.brandId;
        fila.insertCell(1).innerText = marca.nameBrand;
        // Puedes agregar más celdas según la estructura de tu API, como la imagen

         // Muestra la imagen utilizando la etiqueta <img>
        var celdaImagen = fila.insertCell(2);
        var imagen = document.createElement("img");
        imagen.src = "data:image/jpeg;base64,"+marca.linkImageBrand;
        console.log("Ruta de la imagen:", marca.linkImageBrand); // Agrega un log para depurar
        imagen.alt = marca.nameBrand; 
        imagen.style.width = "50px"; 
        celdaImagen.appendChild(imagen);

        // Agrega un botón para acciones (editar, eliminar, etc.)
        var celdaAcciones = fila.insertCell(3);
        celdaAcciones.innerHTML =   
                                    '<button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminarMarca">Eliminar</button>';
    });
}

function mostrarImagenesSeleccionadas() {
    // Obtener el campo de entrada de archivos y el contenedor de previsualización
    var logoInput = document.getElementById('logoInput');
    var previewContenedor = document.getElementById('previewImagenes');
    
    // Limpiar el contenedor de previsualización antes de mostrar nuevas imágenes
    previewContenedor.innerHTML = '';

    // Iterar a través de los archivos seleccionados y mostrar miniaturas
    for (var i = 0; i < logoInput.files.length; i++) {
        var archivo = logoInput.files[i];
        var imagen = document.createElement('img');
        imagen.src = URL.createObjectURL(archivo);
        imagen.alt = 'Imagen ' + (i + 1);
        imagen.style.width = '100px'; // Ajusta el tamaño según sea necesario
        imagen.style.height = '100px';
        previewContenedor.appendChild(imagen);
    }
}



function filtrarMarcas() {
    // Obtener el valor del buscador
    var input = document.getElementById('searchInput');
    var filtro = input.value.toLowerCase(); // Convertir a minúsculas para una comparación sin distinción entre mayúsculas y minúsculas

    // Obtener la tabla y las filas
    var tabla = document.getElementById('marcasTabla');
    var filas = tabla.getElementsByTagName('tr');

    // Iterar sobre las filas y mostrar u ocultar según el filtro
    for (var i = 0; i < filas.length; i++) {
        var celdaNombre = filas[i].getElementsByTagName('td')[1]; // Ajusta el índice según tu estructura de la tabla
        if (celdaNombre) {
            var textoCelda = celdaNombre.textContent || celdaNombre.innerText;
            if (textoCelda.toLowerCase().indexOf(filtro) > -1) {
                filas[i].style.display = '';
            } else {
                filas[i].style.display = 'none';
            }
        }
    }
}

// Agregar un evento al cambio en el input para llamar a la función
const input = document.getElementById('fileInput');
input.addEventListener('change', obtenerImagenBase64);

function obtenerImagenBase64() {
    const input = document.getElementById('fileInput');
    
    if (input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function () {
            const base64String = reader.result.split(',')[1];
            // Imprimir el código base64 en la consola
            console.log(base64String);
        };
    }
}

// Función para guardar una nueva marca
function guardarMarca() {
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

    // Obtener el nombre de la marca desde el input
    const nombreMarca = $('#marcaNombre').val();

    // Obtener la imagen en base64
    obtenerBase64DeInputFile('#fileInput')
        .then(imagenBase64 => {
            // Verificar que se tenga el nombre y la imagen
            if (!nombreMarca || !imagenBase64) {
                console.error('Por favor, ingresa el nombre de la marca y selecciona una imagen.');
                return;
            }

            // Construir el objeto de datos para enviar en la solicitud
            const marcaData = {
                nameBrand: nombreMarca,
                image: imagenBase64,
            };

            // Realizar la solicitud POST para agregar una nueva marca con la imagen base64
            return fetch('http://localhost:8090/fama-market/api/brands/save', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(marcaData),
            });
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Error al agregar marca: ${response.statusText}`);
            }
        })
        .then(data => {
            console.log('Marca agregada exitosamente:', data);

            // Recargar las marcas después de agregar una nueva
            obtenerListaMarcas();

            // Cerrar el modal
            $('#modalMarca').modal('hide');
        })
        .catch(error => {
            console.error(error.message || 'Error desconocido al agregar marca');
        });
}


// Función para obtener la representación base64 de una imagen seleccionada
function obtenerBase64DeInputFile(inputFileSelector) {
    const inputFile = $(inputFileSelector)[0];
    if (inputFile.files.length > 0) {
        const file = inputFile.files[0];
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = function () {
                resolve(reader.result.split(',')[1]);
            };

            reader.onerror = function (error) {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }
    return Promise.resolve(null);
}
// ID de la familia que se eliminará
var brandIdAEliminar;

function mostrarModalEliminar(idMarca) {
    // Guardar el ID de la marca que se eliminará
    brandIdAEliminar = idMarca;

    // Mostrar el ID de la marca en la consola para verificar
    console.log("ID de la Marca a Eliminar (antes de mostrar el modal):", brandIdAEliminar);

    // También puedes mostrar el ID en la consola para verificar
    console.log("ID de la Marca a Eliminar (dentro de la función):", brandIdAEliminar);

    // Mostrar el modal
    $('#modalEliminarMarca').modal('show');
}

// Función para obtener el ID de la marca
function obtenerIdMarca() {
    // Aquí debes asegurarte de tener un elemento con el ID 'idMarcaAEliminar' en tu HTML
    var idMarca = document.getElementById('idMarcaAEliminar');
    
    // Verificar si el elemento existe y tiene un valor
    if (idMarca && idMarca.value) {
        return idMarca.value;
    } else {
        // Manejar el caso en el que el ID de la marca no esté disponible
        console.error('ID de la Marca a Eliminar no encontrado.');
        return null;
    }
}

// Antes de llamar a mostrarModalEliminar, verifica el ID de la marca
var idMarca = obtenerIdMarca();

// Verificar si se obtuvo el ID de la marca correctamente
if (idMarca !== null) {
    console.log("ID de la Marca a Eliminar (antes de llamar a la función):", idMarca);
    // Llama a la función para mostrar el modal
    mostrarModalEliminar(idMarca);
} else {
    // Manejar el caso en el que el ID de la marca no esté disponible
    console.error('No se puede mostrar el modal. ID de la Marca a Eliminar no encontrado.');
}

// Función para eliminar una marca por ID
function eliminarMarca() {
    console.log("Entrando a la función eliminarMarca");

    // Obtener el ID de la marca
    var brandIdAEliminar = obtenerIdMarca();

    // Verificar si se obtuvo el ID de la marca correctamente
    if (brandIdAEliminar !== null) {
        const token = sessionStorage.getItem("jwt");

        if (!token) {
            console.error("No se encontró un token en sessionStoreNg");
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        console.log("ID de la Marca a Eliminar:", brandIdAEliminar);

        fetch(`http://localhost:8090/fama-market/api/brands/delete/${brandIdAEliminar}`, {
            method: 'DELETE',
            headers: headers,
        })
        .then(response => {
            console.log("Respuesta de la solicitud DELETE:", response);

            if (response.ok) {
                console.log('Marca eliminada exitosamente.');
                // Cerrar el modal si es necesario
                $('#modalEliminarMarca').modal('hide');
            } else {
                console.error('Error al eliminar marca:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error al eliminar marca:', error);
        });
    } else {
        // Manejar el caso en el que el ID de la marca no esté disponible
        console.error('No se puede eliminar la marca. ID de la Marca a Eliminar no encontrado.');
    }
}
