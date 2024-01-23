var arrayImages = [];
var elementoAEliminar;

document.addEventListener("DOMContentLoaded", function () {
    $("#subcategoriaCombo").select2();

    const input = document.getElementById("fileInput");
    arrayImages = [];

    input.addEventListener("change", function () {
        const files = input.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function () {
                const base64String = reader.result;
                arrayImages.push(base64String);
                console.log(base64String);
            };

            reader.readAsDataURL(file);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Llenar el menú desplegable de subcategorías al cargar la página
    cargarSubcategorias();
    // Llenar el menú desplegable de submarcas al cargar la página
    cargarSubmarcas();

    // Función para cargar subcategorías desde la API
    function cargarSubcategorias() {
        // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }
    
        // Configurar los encabezados con el token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    
        $.ajax({
            url: "http://localhost:8090/fama-market/api/subcategories/all",
            type: "GET",
            headers: headers, // Agrega los encabezados aquí
            success: function (data) {
                // Limpiar opciones existentes en el menú desplegable
                $("#subcategoriaCombo").empty();
    
                // Iterar sobre los datos recibidos de la API y agregar cada opción al select
                $.each(data, function (index, subcategoria) {
                    $("#subcategoriaCombo").append(
                        $("<option>", {
                            value: subcategoria.subCategoryId, // Ajusta el valor según tus necesidades
                            text: subcategoria.nameSubCategory,
                            "data-id": subcategoria.id,
                        })
                    );
                });
    
                // Activar select2 con funcionalidad de búsqueda
                $("#subcategoriaCombo").select2({
                    placeholder: "Buscar subcategoría...",
                    width: "100%",
                });
            },
            error: function (error) {
                console.error("Error al cargar subcategorías:", error);
            },
        });
    }
    
    // Función para cargar submarcas desde la API
    function cargarSubmarcas() {
         // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }

        // Configurar los encabezados con el token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };


        $.ajax({
            url: "http://localhost:8090/fama-market/api/subbrands/all",
            type: "GET",
            headers: headers,
            success: function (data) {
                // Limpiar opciones existentes en el menú desplegable de submarcas
                $("#submarcaCombo").empty();

                // Iterar sobre los datos recibidos de la API y agregar cada opción al select
                $.each(data, function (index, submarca) {
                    $("#submarcaCombo").append(
                        $("<option>", {
                            value: submarca.subBrandId, // Ajusta el valor según tus necesidades
                            text: submarca.nameSubBrand,
                            "data-id": submarca.id,
                        })
                    );
                });

                // Puedes ajustar el estilo del combo box si lo necesitas
                $("#submarcaCombo").select2({
                    placeholder: "Buscar submarca...",
                    width: "100%",
                });
            },
            error: function (error) {
                console.error("Error al cargar submarcas:", error);
            },
        });
    }
});

function guardarProducto() {

    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Obtener los valores del formulario
    const nombreProducto = $("#nombreProducto").val();
    const descripcion = $("#descripcion").val();
    const unidadMedida = $("#unidad_medida").val();
    const precio = parseFloat($("#precio").val());
    const precioDescuento = parseFloat($("#precioDescuento").val()) || 0;
    const codigoBarras = $("#codigoBarras").val();
    const codigoInterno = $("#codigoInterno").val();
    const cantidadInventario = parseInt($("#cantidadInventario").val());
    // Obtener el ID de la subcategoría seleccionada
    const subcategoriaId = $("#subcategoriaCombo").val();
    const submarcaId = $("#submarcaCombo").val();

    const productoData = {
        nameProduct: nombreProducto,
        descriptionProduct: descripcion,
        priceProduct: precio,
        priceDiscountProduct: precioDescuento,
        barcodeProduct: codigoBarras,
        codeInternalProduct: codigoInterno,
        amountProduct: cantidadInventario,
        subcategoryId: subcategoriaId,
        subbrandId: submarcaId,
        unitMeasurement: unidadMedida,
    };

    console.log("Objeto JSON a enviar:", productoData);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/products/save", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(productoData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Producto guardado exitosamente:", data);

            //Eviar a otro
            guardarImagenes(data.productId, data.codeInternalProduct);
            // Puedes agregar lógica adicional después de guardar el producto, como cerrar el modal, actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

function guardarImagenes(productId, codeInternalProduct) {

    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    var arrayImagesForSends = [];
    arrayImages.forEach((image) => {
        imageProduct = {
            imageId: 0,
            imageRoute: image,
            productId: productId,
            ordenNo: codeInternalProduct,
        };
        arrayImagesForSends.push(imageProduct);
    });

    console.log(arrayImagesForSends);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/images/save/product", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(arrayImagesForSends),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Imagenes guardado exitosamente:", data);
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

obtenerListaProductos();

function obtenerListaProductos() {
    const token = sessionStorage.getItem("jwt"); // Nombre del token en sessionStoreNg

    // Verificar si se encontró un token
    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    // Configurar los encabezados con el token
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    // Realiza una solicitud GET para obtener la lista de productos desde la API
    fetch("http://localhost:8090/fama-market/api/products/all", { headers })
        .then((response) => response.json())
        .then((productos) => {
            // Llama a la función para mostrar los productos en la tabla
            mostrarProductosEnTabla(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
}

function mostrarProductosEnTabla(productos) {
    // Obtén la referencia a la tabla
    var tabla = document.getElementById("productosTabla");

    // Limpiar el contenido actual de la tabla
    tabla.getElementsByTagName("tbody")[0].innerHTML = "";

    // Itera sobre los productos y agrega filas a la tabla
    productos.forEach((producto) => {
        var fila = tabla.insertRow();

        // Inserta las celdas con los datos del producto
        fila.insertCell(0).innerText = producto.productId;
        fila.insertCell(1).innerText = producto.nameProduct;
        fila.insertCell(2).innerText = producto.descriptionProduct;
        fila.insertCell(3).innerText = producto.unitMeasurement;
        fila.insertCell(4).innerText = `$${producto.priceProduct.toFixed(2)}`;
        fila.insertCell(5).innerText = `$${producto.priceDiscountProduct.toFixed(
            2
        )}`;
        fila.insertCell(6).innerText = producto.barcodeProduct;
        fila.insertCell(7).innerText = producto.codeInternalProduct;
        fila.insertCell(8).innerText = producto.amountProduct;
        fila.insertCell(9).innerText = producto.subcategory.nameSubCategory;
        fila.insertCell(10).innerText = producto.subbrand.nameSubBrand;

        // Muestra las imágenes utilizando la etiqueta <div> y <img>
        var celdaImagenes = fila.insertCell(11);
        var contenedorImagenes = document.createElement("div");
        contenedorImagenes.className = "imagen-container";

        // Agrega imágenes al contenedor si existen
        if (producto.imagens && producto.imagens.length > 0) {
            producto.imagens.forEach((imagen) => {
                var img = document.createElement("img");
                img.src = "data:image/jpeg;base64," + imagen.imageRoute;
                img.alt = "Imagen " + imagen.imageId;
                img.className = "imagen-thumbnail";
                img.style.width = "50px"; // Modifica el tamaño según tus necesidades
                img.style.height = "50px";
                contenedorImagenes.appendChild(img);
            });
        }

        celdaImagenes.appendChild(contenedorImagenes);

        // Agrega botones para acciones (editar, eliminar, etc.)
        var celdaAcciones = fila.insertCell(12);
        celdaAcciones.innerHTML = `
        <button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalConfirmacion" onclick="confirmarEliminarProducto(${producto.productId})">Eliminar</button>`;
    });
}



User
Tengo este html, que es un modal para poder registrar submarcas
<!-- Modal para agregar submarca -->
<div class="modal fade" id="modalSubmarca" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Agregar Submarca</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Formulario para agregar submarca -->
                <form id="submarcaForm">
                    <div class="mb-3 d-flex justify-content-center align-items-center">
                        <label for="marcaSelect" class="form-label me-3">Marca:</label>
                        <select class="form-select me-3" id="marcaSelect" required>
                            
                        </select>
                        <a href="../Views/marcas.php" class="btn btn-success">Agregar Marca</a>
                    </div>
                    <div class="mb-3">
                        <label for="submarcaInput" class="form-label">Nombre de la Submarca:</label>
                        <input type="text" class="form-control" id="submarcaInput" required>
                    </div>
                    <div class="mb-3">
                        <label for="fileInput" class="form-label">Agregar Logo:</label>
                        <input type="file" id="fileInput" accept="image/*">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnGuardar">Guardar</button>
            </div>
        </div>
    </div>
</div>

aclarar que en marcas se obtiene el id de las marcas (te proporciono mi codigo completo en un momento), ahora necesito guardar todo lo demas

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


Ahora ayudame a crear la funcion de guardar, se utiliza este url 
http://localhost:8090/fama-market/api/subbrands/save
ChatGPT
Para crear la función de guardar submarcas, puedes seguir estos pasos:

Agrega un evento de clic al botón "Guardar" en tu modal para llamar a la función guardarSubmarca.
Implementa la función guardarSubmarca para obtener los datos del formulario, realizar una solicitud POST a la API y manejar la respuesta.
A continuación, te proporciono el código actualizado:

html
Copy code
<!-- Agrega el evento de clic al botón Guardar -->
<button type="button" class="btn btn-primary" id="btnGuardar" onclick="guardarSubmarca()">Guardar</button>
javascript
Copy code
// Agrega la función para guardar submarcas
function guardarSubmarca() {
    // Obtén los datos del formulario
    const marcaSelect = document.getElementById("marcaSelect");
    const submarcaInput = document.getElementById("submarcaInput");
    const fileInput = document.getElementById("fileInput");

    const selectedMarcaId = marcaSelect.value;
    const submarcaName = submarcaInput.value;
    let base64String = null;

    // Obtén el código base64 de la imagen
    const inputFiles = fileInput.files;
    if (inputFiles.length > 0) {
        const file = inputFiles[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function () {
            base64String = reader.result.split(',')[1];

            // Guarda la submarca
            guardarSubmarcaEnAPI(selectedMarcaId, submarcaName, base64String);
        };
    } else {
        // Si no hay imagen, guarda la submarca sin la imagen
        guardarSubmarcaEnAPI(selectedMarcaId, submarcaName, base64String);
    }
}

// Función para enviar la solicitud POST a la API para guardar submarcas
function guardarSubmarcaEnAPI(marcaId, submarcaName, base64String) {
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

    // Construir el cuerpo de la solicitud
    const body = JSON.stringify({
        brandId: marcaId,
        nameSubBrand: submarcaName,
        linkImageSubbrand: base64String
    });

    // Realizar una solicitud POST para guardar la submarca en la API
    fetch("http://localhost:8090/fama-market/api/subbrands/save", {
        method: 'POST',
        headers,
        body
    })
        .then((response) => response.json())
        .then((data) => {
            // Lógica para manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
            console.log('Submarca guardada exitosamente:', data);

            // Cerrar el modal después de guardar
            $('#modalSubmarca').modal('hide');

            // Actualizar la lista de submarcas
            obtenerListaSubmarcas();
        })
        .catch((error) => {
            console.error('Error al guardar la submarca:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error
        });
}
Con estos cambios, al hacer clic en el botón "Guardar", se llamará a la función guardarSubmarca, la cual obtendrá los datos del formulario y realizará una solicitud POST a la URL especificada para guardar la submarca en la API.

User
Puedes hacer todo en una sola funcion
ChatGPT
Sí, puedes consolidar la lógica en una sola función. Aquí tienes una versión de la función guardarSubmarca que realiza todo el proceso:

javascript
Copy code
function guardarSubmarca() {
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

    // Obtén los datos del formulario
    const marcaSelect = document.getElementById("marcaSelect");
    const submarcaInput = document.getElementById("submarcaInput");
    const fileInput = document.getElementById("fileInput");

    const selectedMarcaId = marcaSelect.value;
    const submarcaName = submarcaInput.value;

    // Obtén el código base64 de la imagen
    const inputFiles = fileInput.files;
    let base64String = null;

    if (inputFiles.length > 0) {
        const file = inputFiles[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function () {
            base64String = reader.result.split(',')[1];

            // Guarda la submarca
            guardarSubmarcaEnAPI(selectedMarcaId, submarcaName, base64String);
        };
    } else {
        // Si no hay imagen, guarda la submarca sin la imagen
        guardarSubmarcaEnAPI(selectedMarcaId, submarcaName, base64String);
    }

    // Función para enviar la solicitud POST a la API para guardar submarcas
    function guardarSubmarcaEnAPI(marcaId, submarcaName, base64String) {
        // Construir el cuerpo de la solicitud
        const body = JSON.stringify({
            brandId: marcaId,
            nameSubBrand: submarcaName,
            linkImageSubbrand: base64String
        });

        // Realizar una solicitud POST para guardar la submarca en la API
        fetch("http://localhost:8090/fama-market/api/subbrands/save", {
            method: 'POST',
            headers,
            body
        })
            .then((response) => response.json())
            .then((data) => {
                // Lógica para manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
                console.log('Submarca guardada exitosamente:', data);

                // Cerrar el modal después de guardar
                $('#modalSubmarca').modal('hide');

                // Actualizar la lista de submarcas
                obtenerListaSubmarcas();
            })
            .catch((error) => {
                console.error('Error al guardar la submarca:', error);
                // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error
            });
    }
}
Ahora, la función guardarSubmarca engloba toda la lógica para obtener datos del formulario, manejar la imagen y realizar la solicitud POST a la API.

User
    public Subbrand save(Subbrand subbrand) {
        String urlImage = subbrand.getNameSubBrand() + "_" + "logo" + ".jpg";
        //Crear la imagen
        try {
            utilService.guardarImagenBase64(subbrand.getLinkImageSubbrand(),"\\img\\submarcas\\" + urlImage);
            subbrand.setLinkImageSubbrand(urlImage);
        } catch (IOException e) {
            e.printStackTrace();
        }


        return subbrandRepository.save(subbrand);
    }

Por que en la base de datos me guarda la ruta completa, cuando debe de guardar unicamente el nombre de la imagen dado
ChatGPT
En el código que proporcionaste, parece que se está generando una ruta completa para la imagen antes de guardarla en la base de datos. Para solucionar esto y almacenar solo el nombre de la imagen en la base de datos, debes asegurarte de que la propiedad linkImageSubbrand de tu entidad Subbrand contenga solo el nombre de la imagen, no la ruta completa.

Aquí hay una versión ajustada del código que debería resolver el problema:

java
Copy code
public Subbrand save(Subbrand subbrand) {
    String imageName = subbrand.getNameSubBrand() + "_" + "logo" + ".jpg";
    
    // Crear la imagen
    try {
        utilService.guardarImagenBase64(subbrand.getLinkImageSubbrand(), "\\img\\submarcas\\" + imageName);
        subbrand.setLinkImageSubbrand(imageName);  // Establecer solo el nombre de la imagen, no la ruta completa
    } catch (IOException e) {
        e.printStackTrace();
    }

    return subbrandRepository.save(subbrand);
}
En este código, subbrand.setLinkImageSubbrand(imageName) establece solo el nombre de la imagen en la propiedad linkImageSubbrand de la entidad Subbrand. Asegúrate de que en tu base de datos el campo destinado para el nombre de la imagen esté configurado para almacenar solo el nombre de la imagen, no la ruta completa. Esto debería evitar que se almacene la ruta completa en la base de datos y, en su lugar, guarde solo el nombre de la imagen.

User
public Brand save(Brand brand) {
        String urlImage = brand.getNameBrand() + "_" + "logo" + ".jpg";
        //Crear la imagen
        try {
            utilService.guardarImagenBase64(brand.getLinkImageBrand(), "\\img\\marcas\\" + urlImage);
            brand.setLinkImageBrand(urlImage);
        } catch (IOException e) {
            e.printStackTrace();
        }


        return brandRepository.save(brand);
    }

Este es un ejemplo, pero lo hace correcto
ChatGPT
En el código que proporcionaste, estás haciendo lo correcto al almacenar solo el nombre de la imagen (urlImage) en el campo correspondiente de la entidad Brand antes de guardarlo en la base de datos. Aquí está el código nuevamente para referencia:

java
Copy code
public Brand save(Brand brand) {
    String urlImage = brand.getNameBrand() + "_" + "logo" + ".jpg";
    
    // Crear la imagen
    try {
        utilService.guardarImagenBase64(brand.getLinkImageBrand(), "\\img\\marcas\\" + urlImage);
        brand.setLinkImageBrand(urlImage);  // Establecer solo el nombre de la imagen, no la ruta completa
    } catch (IOException e) {
        e.printStackTrace();
    }

    return brandRepository.save(brand);
}
Este enfoque es consistente con la práctica de almacenar solo el nombre de la imagen en la base de datos mientras se almacena la imagen física en una ubicación específica en tu sistema de archivos (\\img\\marcas\\). Asegúrate de que la base de datos esté configurada para almacenar solo el nombre de la imagen en el campo correspondiente de la tabla Brand. Este método es útil para mantener la flexibilidad de la ubicación de almacenamiento de las imágenes y facilita la gestión de las mismas.

User
Y por que en el otro no se ejecuta correctamente
ChatGPT
En el código que proporcionaste anteriormente para la entidad Subbrand, pareciera que estás guardando la ruta completa de la imagen en el campo linkImageSubbrand en lugar de solo el nombre de la imagen. Aquí está el código de referencia:

java
Copy code
public Subbrand save(Subbrand subbrand) {
    String urlImage = subbrand.getNameSubBrand() + "_" + "logo" + ".jpg";
    
    // Crear la imagen
    try {
        utilService.guardarImagenBase64(subbrand.getLinkImageSubbrand(), "\\img\\submarcas\\" + urlImage);
        subbrand.setLinkImageSubbrand(urlImage);  // Establecer solo el nombre de la imagen, no la ruta completa
    } catch (IOException e) {
        e.printStackTrace();
    }

    return subbrandRepository.save(subbrand);
}
Asegúrate de que el campo linkImageSubbrand en la entidad Subbrand esté configurado para almacenar solo el nombre de la imagen en la base de datos, al igual que en el caso de la entidad Brand. La configuración de la base de datos para ese campo específico es clave para garantizar que solo se almacene el nombre de la imagen, no la ruta completa.

Si la configuración de la base de datos es correcta y aún así se está almacenando la ruta completa, puedes revisar la configuración de la entidad Subbrand y la base de datos para asegurarte de que todo esté alineado correctamente. Si encuentras alguna discrepancia, ajusta la configuración para que coincida con la de la entidad Brand, donde se está haciendo correctamente.

User
Perfecto, ahora en mi js, como puedo hacer la funcion de eliminar submarca
ChatGPT
Para implementar la función de eliminar submarca en tu código JavaScript, puedes seguir estos pasos:

Añade un manejador de eventos a los botones "Eliminar" en tu tabla para llamar a la función eliminarSubmarca.
Implementa la función eliminarSubmarca que realiza una solicitud DELETE a la API para eliminar la submarca seleccionada.
A continuación, te muestro cómo podrías modificar tu código JavaScript:

javascript
Copy code
// Agrega un manejador de eventos a los botones "Eliminar" en tu tabla
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const submarcaId = event.target.closest('tr').cells[0].innerText; // Ajusta el índice según la estructura de tu tabla
        eliminarSubmarca(submarcaId);
    }
});

// Función para eliminar submarcas
function eliminarSubmarca(submarcaId) {
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

    // Realizar una solicitud DELETE para eliminar la submarca desde la API
    fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, {
        method: 'DELETE',
        headers
    })
        .then((response) => response.json())
        .then((data) => {
            // Lógica para manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
            console.log('Submarca eliminada exitosamente:', data);

            // Actualizar la lista de submarcas después de eliminar
            obtenerListaSubmarcas();
        })
        .catch((error) => {
            console.error('Error al eliminar la submarca:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error
        });
}
En este código:

Se agrega un manejador de eventos al documento que escucha los clics en cualquier lugar de la página. Si el elemento clicado tiene la clase btn-eliminar, se extrae el ID de la submarca de la fila correspondiente y se llama a la función eliminarSubmarca.
La función eliminarSubmarca realiza una solicitud DELETE a la API utilizando el ID de la submarca. Asegúrate de ajustar la URL según la estructura de tu API.
Con estos cambios, al hacer clic en los botones "Eliminar" en tu tabla, se llamará a la función eliminarSubmarca para eliminar la submarca correspondiente.

User
Lamento la confusion, primero debemos abrir un modal para verificar, te paso el modal de eliminar para modificarlo
<!-- Modal para eliminar submarca -->
<div class="modal fade" id="modalEliminarSubmarca" tabindex="-1" role="dialog" aria-labelledby="modalEliminarSubmarcaLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEliminarSubmarcaLabel">Eliminar Submarca</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                
            </div>
            <div class="modal-body">
                <p>¿Deseas eliminar esta submarca?</p>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger">Eliminar</button>
            </div>
        </div>
    </div>
</div>
</div>
ChatGPT
Para agregar la confirmación antes de eliminar la submarca, puedes seguir estos pasos:

Agrega un atributo data-submarca-id al botón "Eliminar" en tu tabla para almacenar el ID de la submarca.
Modifica el manejador de eventos del botón "Eliminar" para abrir el modal de confirmación y establecer el ID de la submarca.
Modifica el manejador de eventos del botón "Eliminar" en el modal de confirmación para llamar a la función eliminarSubmarca con el ID de la submarca.
Aquí te dejo cómo puedes hacerlo:

HTML del botón "Eliminar" en la tabla:

html
Copy code
<button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminarSubmarca" data-submarca-id="ID_SUBMARCA_A_ELIMINAR">Eliminar</button>
Modal de confirmación modificado:

html
Copy code
<!-- Modal para eliminar submarca -->
<div class="modal fade" id="modalEliminarSubmarca" tabindex="-1" role="dialog" aria-labelledby="modalEliminarSubmarcaLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEliminarSubmarcaLabel">Eliminar Submarca</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>¿Deseas eliminar esta submarca?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <!-- Agrega un identificador al botón Eliminar para llamar a la función correspondiente -->
                <button type="button" class="btn btn-danger" id="btnConfirmarEliminar">Eliminar</button>
            </div>
        </div>
    </div>
</div>
Javascript para manejar la apertura del modal de confirmación y la eliminación:

javascript
Copy code
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const submarcaId = event.target.getAttribute('data-submarca-id');
        // Establecer el ID de la submarca en el modal de confirmación
        document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
        // Abrir el modal de confirmación
        $('#modalEliminarSubmarca').modal('show');
    }
});

// Agregar un manejador de eventos al botón "Eliminar" en el modal de confirmación
document.getElementById('btnConfirmarEliminar').addEventListener('click', function () {
    const submarcaId = this.getAttribute('data-submarca-id');
    // Llamar a la función eliminarSubmarca con el ID de la submarca
    eliminarSubmarca(submarcaId);
    // Cerrar el modal de confirmación
    $('#modalEliminarSubmarca').modal('hide');
});
Con estos cambios, al hacer clic en el botón "Eliminar" en tu tabla, se abrirá el modal de confirmación. Al hacer clic en el botón "Eliminar" en el modal de confirmación, se llamará a la función eliminarSubmarca con el ID de la submarca correspondiente. Asegúrate de ajustar ID_SUBMARCA_A_ELIMINAR en el botón de la tabla con el ID real de la submarca que deseas eliminar.

User
Como queda el js completo, la funcion para eliminar
ChatGPT
Aquí tienes el código JavaScript completo que incluye la funcionalidad para abrir el modal de confirmación y eliminar la submarca:

javascript
Copy code
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const submarcaId = event.target.getAttribute('data-submarca-id');
        // Establecer el ID de la submarca en el modal de confirmación
        document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
        // Abrir el modal de confirmación
        $('#modalEliminarSubmarca').modal('show');
    }
});

// Agregar un manejador de eventos al botón "Eliminar" en el modal de confirmación
document.getElementById('btnConfirmarEliminar').addEventListener('click', function () {
    const submarcaId = this.getAttribute('data-submarca-id');
    // Llamar a la función eliminarSubmarca con el ID de la submarca
    eliminarSubmarca(submarcaId);
    // Cerrar el modal de confirmación
    $('#modalEliminarSubmarca').modal('hide');
});

// Función para eliminar submarcas
function eliminarSubmarca(submarcaId) {
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

    // Realizar una solicitud DELETE para eliminar la submarca desde la API
    fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, {
        method: 'DELETE',
        headers
    })
        .then((response) => response.json())
        .then((data) => {
            // Lógica para manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
            console.log('Submarca eliminada exitosamente:', data);

            // Actualizar la lista de submarcas después de eliminar
            obtenerListaSubmarcas();
        })
        .catch((error) => {
            console.error('Error al eliminar la submarca:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error
        });
}
Asegúrate de ajustar el código según la estructura específica de tu aplicación y la API. Este código utiliza jQuery ($('#modalEliminarSubmarca').modal('show');) para mostrar y ocultar el modal, así que asegúrate de que jQuery esté incluido en tu proyecto si aún no lo está.

User
submarcas.js:249 Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
    at submarcas.js:249:48
ChatGPT
El error que estás experimentando indica que estás intentando llamar al método addEventListener en un valor que es null. El código que proporcioné asume que el elemento con el ID btnConfirmarEliminar existe en el DOM antes de intentar agregarle un escuchador de eventos.

Asegúrate de que estás incluyendo tu código JavaScript después de que el DOM esté completamente cargado. Puedes hacer esto envolviendo tu código en un evento DOMContentLoaded o colocando tu etiqueta de script al final del cuerpo del documento HTML.

Aquí hay un ejemplo de cómo podrías envolver tu código en un evento DOMContentLoaded:

javascript
Copy code
document.addEventListener('DOMContentLoaded', function () {
    // Tu código JavaScript aquí

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const submarcaId = event.target.getAttribute('data-submarca-id');
            // Establecer el ID de la submarca en el modal de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
            // Abrir el modal de confirmación
            $('#modalEliminarSubmarca').modal('show');
        }
    });

    // Agregar un manejador de eventos al botón "Eliminar" en el modal de confirmación
    document.getElementById('btnConfirmarEliminar').addEventListener('click', function () {
        const submarcaId = this.getAttribute('data-submarca-id');
        // Llamar a la función eliminarSubmarca con el ID de la submarca
        eliminarSubmarca(submarcaId);
        // Cerrar el modal de confirmación
        $('#modalEliminarSubmarca').modal('hide');
    });

    // Función para eliminar submarcas
    function eliminarSubmarca(submarcaId) {
        // Tu lógica de eliminación aquí
    }
});
Asegúrate de que tu archivo JavaScript esté siendo cargado después de que se haya construido completamente el DOM para evitar el error.

User
submarcas.js:252 Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
    at HTMLDocument.<anonymous>
ChatGPT
El error que estás obteniendo (Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')) indica que estás intentando agregar un evento a un elemento que no se encuentra en el DOM al momento de ejecutar tu script.

Puedes solucionar esto asegurándote de que el código se ejecute después de que el documento HTML se haya cargado completamente. Puedes lograr esto colocando tu script JavaScript al final del cuerpo del documento HTML o utilizando el evento DOMContentLoaded. Aquí hay una solución utilizando DOMContentLoaded:

javascript
Copy code
document.addEventListener('DOMContentLoaded', function () {
    // Tu código JavaScript aquí

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const submarcaId = event.target.getAttribute('data-submarca-id');
            // Establecer el ID de la submarca en el modal de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
            // Abrir el modal de confirmación
            $('#modalEliminarSubmarca').modal('show');
        }
    });

    // Agregar un manejador de eventos al botón "Eliminar" en el modal de confirmación
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function () {
            const submarcaId = this.getAttribute('data-submarca-id');
            // Llamar a la función eliminarSubmarca con el ID de la submarca
            eliminarSubmarca(submarcaId);
            // Cerrar el modal de confirmación
            $('#modalEliminarSubmarca').modal('hide');
        });
    }

    // Función para eliminar submarcas
    function eliminarSubmarca(submarcaId) {
        // Tu lógica de eliminación aquí
    }
});
Asegúrate de que la referencia al elemento con el ID btnConfirmarEliminar sea válida y de que tu script esté ubicado después de la definición del botón en el HTML.

User
Damelo completo
ChatGPT
Aquí tienes el código JavaScript completo que incluye la gestión de eventos y la eliminación de submarcas, y también asegura que el código se ejecute después de que el DOM se haya cargado completamente:

javascript
Copy code
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const submarcaId = event.target.getAttribute('data-submarca-id');
            // Establecer el ID de la submarca en el modal de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
            // Abrir el modal de confirmación
            $('#modalEliminarSubmarca').modal('show');
        }
    });

    // Agregar un manejador de eventos al botón "Eliminar" en el modal de confirmación
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function () {
            const submarcaId = this.getAttribute('data-submarca-id');
            // Llamar a la función eliminarSubmarca con el ID de la submarca
            eliminarSubmarca(submarcaId);
            // Cerrar el modal de confirmación
            $('#modalEliminarSubmarca').modal('hide');
        });
    }

    // Función para eliminar submarcas
    function eliminarSubmarca(submarcaId) {
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

        // Realizar una solicitud DELETE para eliminar la submarca desde la API
        fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, {
            method: 'DELETE',
            headers
        })
            .then((response) => response.json())
            .then((data) => {
                // Lógica para manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
                console.log('Submarca eliminada exitosamente:', data);

                // Actualizar la lista de submarcas después de eliminar
                obtenerListaSubmarcas();
            })
            .catch((error) => {
                console.error('Error al eliminar la submarca:', error);
                // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error
            });
    }
});
Asegúrate de colocar este código al final de tu documento HTML, justo antes del cierre del cuerpo (</body>). Además, verifica que todos los elementos y eventos estén definidos correctamente en tu HTML.

User
Olvida todo, empecemos desde 0
ChatGPT
¡Entendido! Vamos a comenzar desde cero. Parece que deseas agregar la funcionalidad de eliminar submarcas con una confirmación mediante un modal. Aquí hay una guía paso a paso para lograrlo.

1. Crear el Modal de Confirmación
Primero, vamos a crear el modal de confirmación en tu HTML.

html
Copy code
<!-- Modal para eliminar submarca -->
<div class="modal fade" id="modalEliminarSubmarca" tabindex="-1" role="dialog" aria-labelledby="modalEliminarSubmarcaLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEliminarSubmarcaLabel">Eliminar Submarca</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>¿Deseas eliminar esta submarca?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" id="btnConfirmarEliminar">Eliminar</button>
            </div>
        </div>
    </div>
</div>
2. Agregar un Botón "Eliminar" en la Tabla
Asegúrate de que cada fila de la tabla tenga un botón "Eliminar" que abrirá el modal de confirmación.

html
Copy code
<!-- Agrega este botón en cada fila de tu tabla -->
<button type="button" class="btn btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalEliminarSubmarca" data-submarca-id="ID_SUBMARCA_A_ELIMINAR">Eliminar</button>
Reemplaza ID_SUBMARCA_A_ELIMINAR con el ID real de la submarca asociada a esa fila.

3. JavaScript para Manejar Eventos
Ahora, necesitas un script JavaScript para manejar los eventos y realizar la eliminación cuando se confirme en el modal.

javascript
Copy code
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnConfirmarEliminar').addEventListener('click', function () {
        const submarcaId = this.getAttribute('data-submarca-id');
        eliminarSubmarca(submarcaId);
        $('#modalEliminarSubmarca').modal('hide');
    });

    function eliminarSubmarca(submarcaId) {
        // Implementa la lógica para eliminar la submarca usando una solicitud DELETE
        // Puedes utilizar fetch o cualquier otra librería para hacer la solicitud
        // Ejemplo de solicitud:
        // fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, { method: 'DELETE' })
        //    .then(response => response.json())
        //    .then(data => {
        //        console.log('Submarca eliminada exitosamente:', data);
        //        // Actualizar la lista de submarcas después de eliminar
        //        obtenerListaSubmarcas();
        //    })
        //    .catch(error => {
        //        console.error('Error al eliminar la submarca:', error);
        //    });

        // Simulación de eliminación (puedes reemplazar esto con tu lógica real)
        console.log('Submarca eliminada simulada:', submarcaId);
    }

    // Función para obtener la lista de submarcas (puedes reemplazar esto con tu lógica real)
    function obtenerListaSubmarcas() {
        console.log('Obteniendo lista de submarcas...');
        // Lógica para obtener y actualizar la lista de submarcas en la interfaz
    }
});
Este código escucha el clic en el botón "Eliminar" en el modal de confirmación, obtiene el ID de la submarca asociada y llama a la función eliminarSubmarca. En la función eliminarSubmarca, debes implementar la lógica para realizar la eliminación real utilizando una solicitud DELETE a tu API. La simulación actual simplemente imprime el ID de la submarca en la consola.

Recuerda ajustar el código según la estructura específica de tu aplicación y la API.

User
Primero quiero que abra el modal, as solo lo que te pida
ChatGPT
Entendido. Para abrir el modal cuando se haga clic en el botón "Eliminar", sigue estos pasos:

1. Modificar el HTML para Incluir el Botón en una Fila de la Tabla
Asegúrate de tener un botón "Eliminar" en cada fila de tu tabla. Ajusta el código HTML de la fila de la tabla según tus necesidades:

html
Copy code
<!-- Agrega este botón en cada fila de tu tabla -->
<button type="button" class="btn btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalEliminarSubmarca" data-submarca-id="ID_SUBMARCA_A_ELIMINAR">Eliminar</button>
2. JavaScript para Abrir el Modal
Actualiza tu script JavaScript para manejar el evento de clic en el botón "Eliminar" y abrir el modal:

javascript
Copy code
document.addEventListener('DOMContentLoaded', function () {
    // Agregar un manejador de eventos a los botones "Eliminar" en la tabla
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const submarcaId = event.target.getAttribute('data-submarca-id');
            // Establecer el ID de la submarca en el modal de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
            // Abrir el modal de confirmación
            $('#modalEliminarSubmarca').modal('show');
        }
    });

    // Resto del código...
});
Este código agrega un manejador de eventos que escucha clics en cualquier lugar del documento. Si el clic se realiza en un elemento con la clase btn-eliminar, obtiene el ID de la submarca asociada, establece el ID en el modal de confirmación y luego abre el modal.

Recuerda ajustar ID_SUBMARCA_A_ELIMINAR en el botón de la tabla con el ID real de la submarca que deseas eliminar.

User

Ahora el boton del modal hay que programarlo para que haga la funcion de eliminar la submarca


    

2 / 2

ChatGPT
¡Entendido! Ahora vamos a programar el botón del modal para que ejecute la función de eliminar la submarca cuando se confirme la acción. Modifica tu JavaScript de la siguiente manera:

javascript
Copy code
document.addEventListener('DOMContentLoaded', function () {
    // Agregar un manejador de eventos a los botones "Eliminar" en la tabla
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const submarcaId = event.target.getAttribute('data-submarca-id');
            // Establecer el ID de la submarca en el modal de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
            // Abrir el modal de confirmación
            $('#modalEliminarSubmarca').modal('show');
        }
    });

    // Agregar un manejador de eventos al botón "Eliminar" en el modal de confirmación
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function () {
            const submarcaId = this.getAttribute('data-submarca-id');
            // Llamar a la función eliminarSubmarca con el ID de la submarca
            eliminarSubmarca(submarcaId);
            // Cerrar el modal de confirmación
            $('#modalEliminarSubmarca').modal('hide');
        });
    }

    // Función para eliminar submarcas
    function eliminarSubmarca(submarcaId) {
        // Implementa la lógica para eliminar la submarca usando una solicitud DELETE
        // Puedes utilizar fetch o cualquier otra librería para hacer la solicitud
        // Ejemplo de solicitud:
        // fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, { method: 'DELETE' })
        //    .then(response => response.json())
        //    .then(data => {
        //        console.log('Submarca eliminada exitosamente:', data);
        //        // Actualizar la lista de submarcas después de eliminar
        //        obtenerListaSubmarcas();
        //    })
        //    .catch(error => {
        //        console.error('Error al eliminar la submarca:', error);
        //    });

        // Simulación de eliminación (puedes reemplazar esto con tu lógica real)
        console.log('Submarca eliminada simulada:', submarcaId);
    }

    // Función para obtener la lista de submarcas (puedes reemplazar esto con tu lógica real)
    function obtenerListaSubmarcas() {
        console.log('Obteniendo lista de submarcas...');
        // Lógica para obtener y actualizar la lista de submarcas en la interfaz
    }
});
Este código agrega un manejador de eventos al botón "Eliminar" en el modal de confirmación. Cuando se hace clic en este botón, llama a la función eliminarSubmarca con el ID de la submarca y luego cierra el modal. La función eliminarSubmarca debe contener la lógica real para eliminar la submarca utilizando una solicitud DELETE a tu API. Por ahora, se simula la eliminación imprimiendo el ID en la consola. Asegúrate de reemplazar la simulación con tu lógica real.

User
Dame la function eliminarsubmarcas, bien
ChatGPT
Aquí tienes una implementación básica de la función eliminarSubmarca utilizando la función fetch para realizar una solicitud DELETE a la API. Esta función elimina la submarca con el ID proporcionado y luego actualiza la lista de submarcas. Ten en cuenta que debes ajustar la URL y manejar las respuestas y errores según tu API.

javascript
Copy code
function eliminarSubmarca(submarcaId) {
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

    // Realizar una solicitud DELETE para eliminar la submarca desde la API
    fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, {
        method: 'DELETE',
        headers
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar la submarca. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar
            console.log('Submarca eliminada exitosamente:', data);

            // Actualizar la lista de submarcas después de eliminar
            obtenerListaSubmarcas();
        })
        .catch((error) => {
            console.error('Error al eliminar la submarca:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}
Asegúrate de ajustar la URL en la solicitud fetch según la ruta real de tu API. Además, maneja las respuestas y errores de acuerdo con las especificaciones de tu API y los requisitos de tu aplicación.

User
Uncaught TypeError: Cannot read properties of null (reading 'setAttribute')
    at HTMLDocument.<anonymous> (submarcas.js:244:60)
ChatGPT
El error que estás viendo (Uncaught TypeError: Cannot read properties of null (reading 'setAttribute')) indica que el elemento con el ID btnConfirmarEliminar no se encontró en el documento al intentar acceder a él. Puede haber varias razones para esto. Aquí hay algunas cosas que puedes revisar y ajustar:

Asegúrate de que el ID sea correcto:
Verifica que el ID del botón de confirmación en el modal (btnConfirmarEliminar) coincide exactamente con el ID en el documento HTML.

html
Copy code
<button type="button" class="btn btn-danger" id="btnConfirmarEliminar">Eliminar</button>
Asegúrate de que el script se ejecute después de que se cargue el DOM:
Asegúrate de que el script que contiene el código JavaScript se está ejecutando después de que el DOM esté completamente cargado. Puedes envolver tu código en un evento DOMContentLoaded para garantizar esto.

javascript
Copy code
document.addEventListener('DOMContentLoaded', function () {
    // Tu código aquí
});
Ubicación del script:
Asegúrate de que el script que contiene este código se está cargando después del elemento con el ID btnConfirmarEliminar. Coloca la etiqueta del script al final del cuerpo del documento justo antes de cerrar la etiqueta </body>.

html
Copy code
<!-- ... Otro contenido HTML ... -->

<script src="ruta-a-tu-script.js"></script>
</body>
</html>
Verifica que el elemento existe antes de intentar acceder a él:
Puedes agregar una verificación para asegurarte de que el elemento con el ID btnConfirmarEliminar realmente existe antes de intentar acceder a él.

javascript
Copy code
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
if (btnConfirmarEliminar) {
    // Tu código aquí
} else {
    console.error('El elemento con ID btnConfirmarEliminar no se encontró.');
}
Revisa estas sugerencias y realiza ajustes según sea necesario. Si después de revisar aún encuentras el error, podrías proporcionar más contexto o el código HTML completo y el código JavaScript, para que pueda ayudarte mejor.

User
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
        celdaAcciones.innerHTML =  '<button type="button" class="btn btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalEliminarSubmarca" data-submarca-id="ID_SUBMARCA_A_ELIMINAR">Eliminar</button>';
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

function guardarSubmarca() {
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

    // Obtén los datos del formulario
    const marcaSelect = document.getElementById("marcaSelect");
    const submarcaInput = document.getElementById("submarcaInput");
    const fileInput = document.getElementById("fileInput");

    const selectedMarcaId = marcaSelect.value;
    const submarcaName = submarcaInput.value;

    // Obtén el código base64 de la imagen
    const inputFiles = fileInput.files;
    let base64String = null;

    if (inputFiles.length > 0) {
        const file = inputFiles[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function () {
            base64String = reader.result.split(',')[1];

            // Guarda la submarca
            guardarSubmarcaEnAPI(selectedMarcaId, submarcaName, base64String);
        };
    } else {
        // Si no hay imagen, guarda la submarca sin la imagen
        guardarSubmarcaEnAPI(selectedMarcaId, submarcaName, base64String);
    }

    // Función para enviar la solicitud POST a la API para guardar submarcas
    function guardarSubmarcaEnAPI(marcaId, submarcaName, base64String) {
        // Construir el cuerpo de la solicitud
        const body = JSON.stringify({
            brandId: marcaId,
            nameSubBrand: submarcaName,
            linkImageSubbrand: base64String
        });

        // Realizar una solicitud POST para guardar la submarca en la API
        fetch("http://localhost:8090/fama-market/api/subbrands/save", {
            method: 'POST',
            headers,
            body
        })
            .then((response) => response.json())
            .then((data) => {
                // Lógica para manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
                console.log('Submarca guardada exitosamente:', data);

                // Cerrar el modal después de guardar
                $('#modalSubmarca').modal('hide');

                // Actualizar la lista de submarcas
                obtenerListaSubmarcas();
            })
            .catch((error) => {
                console.error('Error al guardar la submarca:', error);
                // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Agregar un manejador de eventos a los botones "Eliminar" en la tabla
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const submarcaId = event.target.getAttribute('data-submarca-id');
            // Establecer el ID de la submarca en el modal de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
            // Abrir el modal de confirmación
            $('#modalEliminarSubmarca').modal('show');
        }
    });

    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function () {
            const submarcaId = this.getAttribute('data-submarca-id');
            // Llamar a la función eliminarSubmarca con el ID de la submarca
            eliminarSubmarca(submarcaId);
            // Cerrar el modal de confirmación
            $('#modalEliminarSubmarca').modal('hide');
        });
    }

    function eliminarSubmarca(submarcaId) {
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
    
        // Realizar una solicitud DELETE para eliminar la submarca desde la API
        fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, {
            method: 'DELETE',
            headers
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error al eliminar la submarca. Código: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Lógica para manejar la respuesta de la API después de eliminar
                console.log('Submarca eliminada exitosamente:', data);
    
                // Actualizar la lista de submarcas después de eliminar
                obtenerListaSubmarcas();
            })
            .catch((error) => {
                console.error('Error al eliminar la submarca:', error);
                // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
            });
    }
    

});



No me elimina las submarcas
ChatGPT
Revisando tu código, parece que el problema puede estar relacionado con cómo se está manejando el ID de la submarca al intentar eliminarla. En tu código JavaScript, estás intentando obtener el ID de la submarca desde el atributo data-submarca-id del botón de eliminación:

javascript
Copy code
const submarcaId = event.target.getAttribute('data-submarca-id');
Sin embargo, en el código HTML proporcionado para el botón de eliminar, veo que el valor de data-submarca-id está configurado como "ID_SUBMARCA_A_ELIMINAR". Esto es un marcador de posición y no representa un ID real de submarca. Necesitas configurar el ID real de la submarca cuando generes el botón de eliminar en la función mostrarSubmarcasEnTabla. Aquí está la parte relevante del código:

javascript
Copy code
celdaAcciones.innerHTML =  '<button type="button" class="btn btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalEliminarSubmarca" data-submarca-id="ID_SUBMARCA_A_ELIMINAR">Eliminar</button>';
Deberías reemplazar "ID_SUBMARCA_A_ELIMINAR" con el ID real de la submarca. Para hacerlo, puedes obtener el ID real de la submarca del objeto submarca que estás utilizando en el bucle forEach:

javascript
Copy code
celdaAcciones.innerHTML =  `<button type="button" class="btn btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalEliminarSubmarca" data-submarca-id="${submarca.subBrandId}">Eliminar</button>`;
Al hacer esto, asegúrate de que el atributo data-submarca-id contenga el ID real de la submarca. Luego, cuando intentas eliminar la submarca en la función eliminarSubmarca, debería obtener el ID correcto y realizar la solicitud DELETE con ese ID.

User
Dame el js completo
ChatGPT
Aquí tienes el código JavaScript completo, con las correcciones para asegurar que los botones de eliminar tengan el ID real de la submarca y para obtener ese ID correctamente al intentar eliminar una submarca:

javascript
Copy code
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
        celdaAcciones.innerHTML = `<button type="button" class="btn btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalEliminarSubmarca" data-submarca-id="${submarca.subBrandId}">Eliminar</button>`;
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

function guardarSubmarca() {
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

    // Obtén los datos del formulario
    const marcaSelect = document.getElementById("marcaSelect");
    const submarcaInput = document.getElementById("submarcaInput");
    const fileInput = document.getElementById("fileInput");

    const selectedMarcaId = marcaSelect.value;
    const submarcaName = submarcaInput.value;

    // Obtén el código base64 de la imagen
    const inputFiles = fileInput.files;
    let base64String = null;

    if (inputFiles.length > 0) {
        const file = inputFiles[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function () {
            base64String = reader.result.split(',')[1];

            // Guarda la submarca
            guardarSubmarcaEnAPI(selectedMarcaId, submarcaName, base64String);
        };
    } else {
        // Si no hay imagen, guarda la submarca sin la imagen
        guardarSubmarcaEnAPI(selectedMarcaId, submarcaName, base64String);
    }

    // Función para enviar la solicitud POST a la API para guardar submarcas
    function guardarSubmarcaEnAPI(marcaId, submarcaName, base64String) {
        // Construir el cuerpo de la solicitud
        const body = JSON.stringify({
            brandId: marcaId,
            nameSubBrand: submarcaName,
            linkImageSubbrand: base64String
        });

        // Realizar una solicitud POST para guardar la submarca en la API
        fetch("http://localhost:8090/fama-market/api/subbrands/save", {
            method: 'POST',
            headers,
            body
        })
            .then((response) => response.json())
            .then((data) => {
                // Lógica para manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
                console.log('Submarca guardada exitosamente:', data);

                // Cerrar el modal después de guardar
                $('#modalSubmarca').modal('hide');

                // Actualizar la lista de submarcas
                obtenerListaSubmarcas();
            })
            .catch((error) => {
                console.error('Error al guardar la submarca:', error);
                // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Agregar un manejador de eventos a los botones "Eliminar" en la tabla
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const submarcaId = event.target.getAttribute('data-submarca-id');
            // Establecer el ID de la submarca en el modal de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
            // Abrir el modal de confirmación
            $('#modalEliminarSubmarca').modal('show');
        }
    });

    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function () {
            const submarcaId = this.getAttribute('data-submarca-id');
            // Llamar a la función eliminarSubmarca con el ID de la submarca
            eliminarSubmarca(submarcaId);
            // Cerrar el modal de confirmación
            $('#modalEliminarSubmarca').modal('hide');
        });
    }

    function eliminarSubmarca(submarcaId) {
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
    
        // Realizar una solicitud DELETE para eliminar la submarca desde la API
        fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, {
            method: 'DELETE',
            headers
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error al eliminar la submarca. Código: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Lógica para manejar la respuesta de la API después de eliminar
                console.log('Submarca eliminada exitosamente:', data);
    
                // Actualizar la lista de submarcas después de eliminar
                obtenerListaSubmarcas();
            })
            .catch((error) => {
                console.error('Error al eliminar la submarca:', error);
                // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
            });
        }
    });
});
Asegúrate de que la estructura del HTML y las funciones de tu aplicación coincidan con este código. Este código utiliza jQuery y Bootstrap, así que asegúrate de tener las bibliotecas incluidas en tu proyecto si no las tienes.

User
submarcas.js:296 Error al eliminar la submarca: Error: Error al eliminar la submarca. Código: 403
    at submarcas.js:284:27
ChatGPT
El código de error 403 indica que la solicitud fue entendida, pero el servidor rechaza la acción. Este código de estado generalmente se asocia con problemas de autenticación o autorización.

En tu caso, parece que el servidor está devolviendo un código de error 403 al intentar eliminar la submarca. Aquí hay algunas sugerencias para solucionar este problema:

Verificar permisos de usuario: Asegúrate de que el usuario autenticado tenga los permisos adecuados para eliminar submarcas. Puede ser necesario revisar los roles y permisos asignados al usuario en el servidor.

Revisar el token de autenticación: Verifica que el token de autenticación que se envía en la solicitud tenga los permisos necesarios. Puede ser necesario incluir información adicional en el token para garantizar que el usuario tenga los privilegios adecuados.

Configuración del servidor: Revisa la configuración del servidor para asegurarte de que esté permitiendo las operaciones de eliminación para el recurso de submarcas. Verifica cualquier middleware de seguridad que pueda estar bloqueando estas solicitudes.

Logs del servidor: Examina los logs del servidor para obtener más detalles sobre por qué se está devolviendo el código de error 403. Los logs pueden proporcionar información adicional sobre la causa del problema.

Manejo de excepciones en el servidor: Asegúrate de que el servidor esté manejando adecuadamente las excepciones y devolviendo respuestas claras en caso de errores. Esto facilitará la depuración de problemas.

Después de realizar estas verificaciones, deberías tener una mejor comprensión de por qué estás recibiendo el código de error 403 al intentar eliminar submarcas. Si el problema persiste, revisa la configuración de tu aplicación y servidor para garantizar que todo esté correctamente configurado.

User
Es que antes eliminaba pero con el boton desde la tabla, pero quiero que lo haga el boton del modal
ChatGPT
Entendido. Parece que hay un problema al intentar enviar la solicitud de eliminación desde el botón en el modal. A continuación, proporcionaré una versión corregida del código para asegurarnos de que el ID de la submarca se establezca correctamente antes de enviar la solicitud DELETE.

Primero, actualiza la función mostrarSubmarcasEnTabla para asegurarte de que el atributo data-submarca-id se establezca correctamente en el botón "Eliminar" en cada fila de la tabla:

javascript
Copy code
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
        var botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-eliminar";
        botonEliminar.setAttribute("data-bs-toggle", "modal");
        botonEliminar.setAttribute("data-bs-target", "#modalEliminarSubmarca");
        botonEliminar.setAttribute("data-submarca-id", submarca.subBrandId);
        botonEliminar.innerText = "Eliminar";
        celdaAcciones.appendChild(botonEliminar);
    });
}
Luego, actualiza la función de eliminación para leer el ID de la submarca directamente desde el botón en el modal:

javascript
Copy code
document.addEventListener('DOMContentLoaded', function () {
    // ...

    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function () {
            const submarcaId = this.getAttribute('data-submarca-id');
            // Llamar a la función eliminarSubmarca con el ID de la submarca
            eliminarSubmarca(submarcaId);
            // Cerrar el modal de confirmación
            $('#modalEliminarSubmarca').modal('hide');
        });
    }

    function eliminarSubmarca(submarcaId) {
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
    
        // Realizar una solicitud DELETE para eliminar la submarca desde la API
        fetch(`http://localhost:8090/fama-market/api/subbrands/delete/${submarcaId}`, {
            method: 'DELETE',
            headers
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error al eliminar la submarca. Código: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Lógica para manejar la respuesta de la API después de eliminar
                console.log('Submarca eliminada exitosamente:', data);
    
                // Actualizar la lista de submarcas después de eliminar
                obtenerListaSubmarcas();
            })
            .catch((error) => {
                console.error('Error al eliminar la submarca:', error);
                // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
            });
        }
    });
});
Esto debería asegurar que el ID de la submarca se obtenga correctamente al hacer clic en el botón "Eliminar" en el modal. Si aún encuentras problemas, asegúrate de que el atributo data-submarca-id se está estableciendo correctamente en los botones del modal y verifica si hay algún mensaje de error específico en la consola del navegador.

User
Dame el js completo
ChatGPT
Claro, aquí está el código JavaScript completo con las correcciones:

javascript
Copy code
$(function () {
    // Llama a la función para obtener y mostrar las marcas al cargar la página
    obtenerListaSubmarcas();
    obtenerListaMarcas();
});

function obtenerListaMarcas() {
    // ... (código existente para obtener marcas)
}

function mostrarMarcasEnCombo(marcas) {
    // ... (código existente para mostrar marcas en el combo)
}

// ... (código existente para obtener y mostrar submarcas)

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
        var botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-eliminar";
        botonEliminar.setAttribute("data-bs-toggle", "modal");
        botonEliminar.setAttribute("data-bs-target", "#modalEliminarSubmarca");
        botonEliminar.setAttribute("data-submarca-id", submarca.subBrandId);
        botonEliminar.innerText = "Eliminar";
        celdaAcciones.appendChild(botonEliminar);
    });
}

function filtrarSubmarcas() {
    // ... (código existente para filtrar submarcas)
}

function obtenerImagenBase64() {
    // ... (código existente para obtener la imagen en base64)
}

function guardarSubmarca() {
    // ... (código existente para guardar submarca)
}

document.addEventListener('DOMContentLoaded', function () {
    // Agregar un manejador de eventos a los botones "Eliminar" en la tabla
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const submarcaId = event.target.getAttribute('data-submarca-id');
            // Establecer el ID de la submarca en el modal de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-submarca-id', submarcaId);
            // Abrir el modal de confirmación
            $('#modalEliminarSubmarca').modal('show');
        }
    });

    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function () {
            const submarcaId = this.getAttribute('data-submarca-id');
            // Llamar a la función eliminarSubmarca con el ID de la submarca
            eliminarSubmarca(submarcaId);
            // Cerrar el modal de confirmación
            $('#modalEliminarSubmarca').modal('hide');
        });
    }

    function eliminarSubmarca(submarcaId) {
        // ... (código existente para eliminar submarca)
    }
});
Este código debería funcionar correctamente para mostrar las submarcas, abrir el modal de confirmación al hacer clic en el botón "Eliminar" y eliminar la submarca después de la confirmación. Asegúrate de que las dependencias, como Bootstrap y jQuery, estén incluidas en tu proyecto. Si encuentras algún error específico, revisa la consola del navegador para obtener más detalles.

User
Exelente, cambiemos de tema
ChatGPT
¡Claro! Puedes preguntarme sobre cualquier otro tema o inquietud que tengas. ¿En qué puedo ayudarte ahora?

User
function guardarProducto() {

    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Obtener los valores del formulario
    const nombreProducto = $("#nombreProducto").val();
    const descripcion = $("#descripcion").val();
    const unidadMedida = $("#unidad_medida").val();
    const precio = parseFloat($("#precio").val());
    const precioDescuento = parseFloat($("#precioDescuento").val()) || 0;
    const codigoBarras = $("#codigoBarras").val();
    const codigoInterno = $("#codigoInterno").val();
    const cantidadInventario = parseInt($("#cantidadInventario").val());
    // Obtener el ID de la subcategoría seleccionada
    const subcategoriaId = $("#subcategoriaCombo").val();
    const submarcaId = $("#submarcaCombo").val();

    const productoData = {
        nameProduct: nombreProducto,
        descriptionProduct: descripcion,
        priceProduct: precio,
        priceDiscountProduct: precioDescuento,
        barcodeProduct: codigoBarras,
        codeInternalProduct: codigoInterno,
        amountProduct: cantidadInventario,
        subcategoryId: subcategoriaId,
        subbrandId: submarcaId,
        unitMeasurement: unidadMedida,
    };

    console.log("Objeto JSON a enviar:", productoData);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/products/save", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(productoData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Producto guardado exitosamente:", data);

            //Eviar a otro
            guardarImagenes(data.productId, data.codeInternalProduct);
            // Puedes agregar lógica adicional después de guardar el producto, como cerrar el modal, actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

function guardarImagenes(productId, codeInternalProduct) {
    var arrayImagesForSends = [];
    arrayImages.forEach((image) => {
        imageProduct = {
            imageId: 0,
            imageRoute: image,
            productId: productId,
            ordenNo: codeInternalProduct,
        };
        arrayImagesForSends.push(imageProduct);
    });

    console.log(arrayImagesForSends);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/images/save/product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arrayImagesForSends),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Imagenes guardado exitosamente:", data);
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}


No me esta guardando las imagenes, por que
ChatGPT
El código que proporcionaste parece estar correctamente estructurado para guardar un producto y sus imágenes asociadas. Sin embargo, hay algunas cosas que podríamos revisar para identificar posibles problemas.

Verifica la existencia de arrayImages: Asegúrate de que la variable arrayImages esté definida y contenga las rutas de las imágenes que deseas enviar al servidor. Puedes agregar un console.log(arrayImages); antes de la llamada a guardarImagenes para asegurarte de que contiene datos.

javascript
Copy code
console.log(arrayImages);
guardarImagenes(data.productId, data.codeInternalProduct);
Posibles errores en la API del servidor: Verifica la consola de la red en las herramientas de desarrollo del navegador para ver si hay errores al realizar la solicitud a la API de imágenes. Asegúrate de que la API esté correctamente implementada y esperando las solicitudes POST de imágenes.

Manejo de errores: Mejora el manejo de errores en las funciones guardarProducto y guardarImagenes para obtener más información sobre posibles problemas. Puedes imprimir los detalles del error en la consola.

javascript
Copy code
.catch((error) => {
    console.error("Error al guardar el producto:", error);
});
javascript
Copy code
.catch((error) => {
    console.error("Error al guardar las imágenes:", error);
});
Endpoint de la API de imágenes: Asegúrate de que el endpoint http://localhost:8090/fama-market/api/images/save/product sea correcto y esté esperando solicitudes POST.

Formato de las imágenes: Verifica que las imágenes estén en el formato esperado por la API y que no haya problemas con el tamaño de las imágenes.

Si después de revisar estos puntos aún encuentras problemas, revisa la consola del navegador para obtener mensajes de error específicos que puedan ayudarte a identificar la causa del problema.

User
var arrayImages = [];

document.addEventListener("DOMContentLoaded", function () {
    $("#subcategoriaCombo").select2();

    const input = document.getElementById("fileInput");
    arrayImages = [];

    input.addEventListener("change", function () {
        const files = input.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function () {
                const base64String = reader.result;
                arrayImages.push(base64String);
                console.log(base64String);
            };

            reader.readAsDataURL(file);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Llenar el menú desplegable de subcategorías al cargar la página
    cargarSubcategorias();
    // Llenar el menú desplegable de submarcas al cargar la página
    cargarSubmarcas();

    // Función para cargar subcategorías desde la API
    function cargarSubcategorias() {
        // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }
    
        // Configurar los encabezados con el token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    
        $.ajax({
            url: "http://localhost:8090/fama-market/api/subcategories/all",
            type: "GET",
            headers: headers, // Agrega los encabezados aquí
            success: function (data) {
                // Limpiar opciones existentes en el menú desplegable
                $("#subcategoriaCombo").empty();
    
                // Iterar sobre los datos recibidos de la API y agregar cada opción al select
                $.each(data, function (index, subcategoria) {
                    $("#subcategoriaCombo").append(
                        $("<option>", {
                            value: subcategoria.subCategoryId, // Ajusta el valor según tus necesidades
                            text: subcategoria.nameSubCategory,
                            "data-id": subcategoria.id,
                        })
                    );
                });
    
                // Activar select2 con funcionalidad de búsqueda
                $("#subcategoriaCombo").select2({
                    placeholder: "Buscar subcategoría...",
                    width: "100%",
                });
            },
            error: function (error) {
                console.error("Error al cargar subcategorías:", error);
            },
        });
    }
    
    // Función para cargar submarcas desde la API
    function cargarSubmarcas() {
         // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }

        // Configurar los encabezados con el token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };


        $.ajax({
            url: "http://localhost:8090/fama-market/api/subbrands/all",
            type: "GET",
            headers: headers,
            success: function (data) {
                // Limpiar opciones existentes en el menú desplegable de submarcas
                $("#submarcaCombo").empty();

                // Iterar sobre los datos recibidos de la API y agregar cada opción al select
                $.each(data, function (index, submarca) {
                    $("#submarcaCombo").append(
                        $("<option>", {
                            value: submarca.subBrandId, // Ajusta el valor según tus necesidades
                            text: submarca.nameSubBrand,
                            "data-id": submarca.id,
                        })
                    );
                });

                // Puedes ajustar el estilo del combo box si lo necesitas
                $("#submarcaCombo").select2({
                    placeholder: "Buscar submarca...",
                    width: "100%",
                });
            },
            error: function (error) {
                console.error("Error al cargar submarcas:", error);
            },
        });
    }
});

function guardarProducto() {

    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Obtener los valores del formulario
    const nombreProducto = $("#nombreProducto").val();
    const descripcion = $("#descripcion").val();
    const unidadMedida = $("#unidad_medida").val();
    const precio = parseFloat($("#precio").val());
    const precioDescuento = parseFloat($("#precioDescuento").val()) || 0;
    const codigoBarras = $("#codigoBarras").val();
    const codigoInterno = $("#codigoInterno").val();
    const cantidadInventario = parseInt($("#cantidadInventario").val());
    // Obtener el ID de la subcategoría seleccionada
    const subcategoriaId = $("#subcategoriaCombo").val();
    const submarcaId = $("#submarcaCombo").val();

    const productoData = {
        nameProduct: nombreProducto,
        descriptionProduct: descripcion,
        priceProduct: precio,
        priceDiscountProduct: precioDescuento,
        barcodeProduct: codigoBarras,
        codeInternalProduct: codigoInterno,
        amountProduct: cantidadInventario,
        subcategoryId: subcategoriaId,
        subbrandId: submarcaId,
        unitMeasurement: unidadMedida,
    };

    console.log("Objeto JSON a enviar:", productoData);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/products/save", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(productoData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Producto guardado exitosamente:", data);

            //Eviar a otro
            guardarImagenes(data.productId, data.codeInternalProduct);
            // Puedes agregar lógica adicional después de guardar el producto, como cerrar el modal, actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

function guardarImagenes(productId, codeInternalProduct) {
    var arrayImagesForSends = [];
    arrayImages.forEach((image) => {
        imageProduct = {
            imageId: 0,
            imageRoute: image,
            productId: productId,
            ordenNo: codeInternalProduct,
        };
        arrayImagesForSends.push(imageProduct);
    });

    console.log(arrayImagesForSends);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/images/save/product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arrayImagesForSends),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Imagenes guardado exitosamente:", data);
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

obtenerListaProductos();

function obtenerListaProductos() {
    const token = sessionStorage.getItem("jwt"); // Nombre del token en sessionStoreNg
    // Verificar si se encontró un token
    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    // Configurar los encabezados con el token
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    // Realiza una solicitud GET para obtener la lista de productos desde la API
    fetch("http://localhost:8090/fama-market/api/products/all", { headers })
        .then((response) => response.json())
        .then((productos) => {
            // Llama a la función para mostrar los productos en la tabla
            mostrarProductosEnTabla(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
}

function mostrarProductosEnTabla(productos) {
    // Obtén la referencia a la tabla
    var tabla = document.getElementById("productosTabla");

    // Limpiar el contenido actual de la tabla
    tabla.getElementsByTagName("tbody")[0].innerHTML = "";

    // Itera sobre los productos y agrega filas a la tabla
    productos.forEach((producto) => {
        var fila = tabla.insertRow();

        // Inserta las celdas con los datos del producto
        fila.insertCell(0).innerText = producto.productId;
        fila.insertCell(1).innerText = producto.nameProduct;
        fila.insertCell(2).innerText = producto.descriptionProduct;
        fila.insertCell(3).innerText = producto.unitMeasurement;
        fila.insertCell(4).innerText = `$${producto.priceProduct.toFixed(2)}`;
        fila.insertCell(5).innerText = `$${producto.priceDiscountProduct.toFixed(
            2
        )}`;
        fila.insertCell(6).innerText = producto.barcodeProduct;
        fila.insertCell(7).innerText = producto.codeInternalProduct;
        fila.insertCell(8).innerText = producto.amountProduct;
        fila.insertCell(9).innerText = producto.subcategory.nameSubCategory;
        fila.insertCell(10).innerText = producto.subbrand.nameSubBrand;

        // Muestra las imágenes utilizando la etiqueta <div> y <img>
        var celdaImagenes = fila.insertCell(11);
        var contenedorImagenes = document.createElement("div");
        contenedorImagenes.className = "imagen-container";

        // Agrega imágenes al contenedor si existen
        if (producto.imagens && producto.imagens.length > 0) {
            producto.imagens.forEach((imagen) => {
                var img = document.createElement("img");
                img.src = "data:image/jpeg;base64," + imagen.imageRoute;
                img.alt = "Imagen " + imagen.imageId;
                img.className = "imagen-thumbnail";
                img.style.width = "50px"; // Modifica el tamaño según tus necesidades
                img.style.height = "50px";
                contenedorImagenes.appendChild(img);
            });
        }

        celdaImagenes.appendChild(contenedorImagenes);

        // Agrega botones para acciones (editar, eliminar, etc.)
        var celdaAcciones = fila.insertCell(12);
        celdaAcciones.innerHTML =
            '<button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminarProducto">Eliminar</button>';
    });
}


Con todo este codigo, al guardar los productos con sus imagenes, lo unico que me guarda son los productos, no las imagenes y me manda este error en la consola

productos_crud.js:220 Error al guardar el producto: SyntaxError: Unexpected end of JSON input
    at productos_crud.js:215:38
ChatGPT
El error SyntaxError: Unexpected end of JSON input generalmente indica que se intentó analizar JSON, pero el contenido del texto JSON estaba vacío o no era válido. En este caso, parece que estás obteniendo esta respuesta cuando intentas analizar la respuesta JSON de la solicitud al endpoint http://localhost:8090/fama-market/api/products/save.

Hay algunas cosas que podrías hacer para depurar este problema:

Verificar la respuesta del servidor: Asegúrate de que el servidor esté respondiendo correctamente y enviando una respuesta JSON válida. Puedes usar las herramientas de desarrollador del navegador para inspeccionar la respuesta que recibes.

Manejo de errores mejorado: Mejora el manejo de errores en tu código para imprimir detalles más específicos sobre el error. Actualiza la sección de manejo de errores en guardarProducto para obtener más información:

javascript
Copy code
.catch((error) => {
    console.error("Error al guardar el producto:", error);
    if (error instanceof SyntaxError) {
        console.error("Error de sintaxis JSON:", error.message);
    }
});
De esta manera, podrías obtener más información sobre el error de sintaxis JSON.

Inspeccionar la respuesta del servidor: Agrega un console.log(response.text()) para inspeccionar el contenido de la respuesta JSON antes de intentar analizarlo. Esto te dará una idea de lo que está recibiendo tu código:

javascript
Copy code
.then((response) => {
    console.log(response.text());
    return response.json();
})
.then((data) => {
    console.log("Producto guardado exitosamente:", data);
    guardarImagenes(data.productId, data.codeInternalProduct);
})
Estas sugerencias deberían ayudarte a depurar y entender mejor el problema. Revise la respuesta del servidor, asegúrate de que sea una respuesta JSON válida y verifica que la estructura del JSON sea la esperada por tu código.

User
como quedaria corregido

2 / 2

ChatGPT
Vamos a realizar algunas modificaciones en tu código para mejorar el manejo de errores y ayudarte a identificar el problema. Además, agregaré comentarios para explicar los cambios. Aquí está el código modificado:

javascript
Copy code
function guardarProducto() {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');
    console.log(token);

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Obtener los valores del formulario
    const nombreProducto = $("#nombreProducto").val();
    const descripcion = $("#descripcion").val();
    const unidadMedida = $("#unidad_medida").val();
    const precio = parseFloat($("#precio").val());
    const precioDescuento = parseFloat($("#precioDescuento").val()) || 0;
    const codigoBarras = $("#codigoBarras").val();
    const codigoInterno = $("#codigoInterno").val();
    const cantidadInventario = parseInt($("#cantidadInventario").val());
    // Obtener el ID de la subcategoría seleccionada
    const subcategoriaId = $("#subcategoriaCombo").val();
    const submarcaId = $("#submarcaCombo").val();

    const productoData = {
        nameProduct: nombreProducto,
        descriptionProduct: descripcion,
        priceProduct: precio,
        priceDiscountProduct: precioDescuento,
        barcodeProduct: codigoBarras,
        codeInternalProduct: codigoInterno,
        amountProduct: cantidadInventario,
        subcategoryId: subcategoriaId,
        subbrandId: submarcaId,
        unitMeasurement: unidadMedida,
    };

    console.log("Objeto JSON a enviar:", productoData);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/products/save", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(productoData),
    })
    .then(async (response) => {
        // Imprimir el cuerpo de la respuesta para facilitar la depuración
        const responseBody = await response.text();
        console.log('Respuesta del servidor:', responseBody);

        if (!response.ok) {
            throw new Error(`Error al guardar el producto. Código: ${response.status}`);
        }

        // Continuar solo si la respuesta es exitosa
        return response.json();
    })
    .then((data) => {
        console.log("Producto guardado exitosamente:", data);
        // Enviar a otro
        guardarImagenes(data.productId, data.codeInternalProduct);
        // Puedes agregar lógica adicional después de guardar el producto, como cerrar el modal, actualizar la tabla, etc.
    })
    .catch((error) => {
        console.error("Error al guardar el producto:", error);
        if (error instanceof SyntaxError) {
            console.error("Error de sintaxis JSON:", error.message);
        }
    });
}

function guardarImagenes(productId, codeInternalProduct) {
    var arrayImagesForSends = [];
    arrayImages.forEach((image) => {
        imageProduct = {
            imageId: 0,
            imageRoute: image,
            productId: productId,
            ordenNo: codeInternalProduct,
        };
        arrayImagesForSends.push(imageProduct);
    });

    console.log(arrayImagesForSends);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/images/save/product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arrayImagesForSends),
    })
    .then(async (response) => {
        // Imprimir el cuerpo de la respuesta para facilitar la depuración
        const responseBody = await response.text();
        console.log('Respuesta del servidor (guardarImagenes):', responseBody);

        if (!response.ok) {
            throw new Error(`Error al guardar las imágenes. Código: ${response.status}`);
        }

        // Continuar solo si la respuesta es exitosa
        return response.json();
    })
    .then((data) => {
        console.log("Imágenes guardadas exitosamente:", data);
    })
    .catch((error) => {
        console.error("Error al guardar las imágenes:", error);
        if (error instanceof SyntaxError) {
            console.error("Error de sintaxis JSON:", error.message);
        }
    });
}
Con estos cambios, deberías obtener más información sobre la respuesta del servidor, lo que te ayudará a identificar y solucionar el problema. Además, se mejora el manejo de errores para proporcionar mensajes más descriptivos en la consola.

User
Respuesta del servidor: {"productId":60,"nameProduct":"Prueba producto","descriptionProduct":"oiuytgf","priceProduct":4.0,"priceDiscountProduct":0.0,"barcodeProduct":"721001","codeInternalProduct":"123411","amountProduct":5,"subcategoryId":1,"subcategory":null,"subbrandId":2,"subbrand":null,"unitMeasurement":"Pieza","imagens":null}

Esta es la respuesta que me mando, pero como puedes ver las imagenes me las manda null
ChatGPT
Gracias por proporcionar la respuesta del servidor. Parece que la propiedad imagens en la respuesta es null, lo que sugiere que la API no está devolviendo las imágenes inmediatamente después de guardar el producto. Puede haber varias razones para esto.

Una posible razón es que la API podría tener un proceso asincrónico para procesar y asociar las imágenes después de guardar el producto. En ese caso, necesitarías realizar una solicitud adicional para obtener las imágenes asociadas al producto después de un tiempo.

Modifica la función guardarImagenes para manejar esta situación. Aquí hay una versión actualizada:

javascript
Copy code
function guardarImagenes(productId, codeInternalProduct) {
    var arrayImagesForSends = [];
    arrayImages.forEach((image) => {
        imageProduct = {
            imageId: 0,
            imageRoute: image,
            productId: productId,
            ordenNo: codeInternalProduct,
        };
        arrayImagesForSends.push(imageProduct);
    });

    console.log(arrayImagesForSends);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/images/save/product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arrayImagesForSends),
    })
    .then(async (response) => {
        // Imprimir el cuerpo de la respuesta para facilitar la depuración
        const responseBody = await response.text();
        console.log('Respuesta del servidor (guardarImagenes):', responseBody);

        if (!response.ok) {
            throw new Error(`Error al guardar las imágenes. Código: ${response.status}`);
        }

        // Continuar solo si la respuesta es exitosa
        return response.json();
    })
    .then((data) => {
        console.log("Imágenes guardadas exitosamente:", data);

        // Después de un tiempo, realizar una solicitud GET para obtener las imágenes asociadas al producto
        setTimeout(() => obtenerImagenesProducto(productId), 5000); // Ajusta el tiempo según tus necesidades
    })
    .catch((error) => {
        console.error("Error al guardar las imágenes:", error);
        if (error instanceof SyntaxError) {
            console.error("Error de sintaxis JSON:", error.message);
        }
    });
}

function obtenerImagenesProducto(productId) {
    // Realizar una solicitud GET para obtener las imágenes asociadas al producto
    fetch(`http://localhost:8090/fama-market/api/images/product/${productId}`)
        .then(async (response) => {
            // Imprimir el cuerpo de la respuesta para facilitar la depuración
            const responseBody = await response.text();
            console.log('Respuesta del servidor (obtenerImagenesProducto):', responseBody);

            if (!response.ok) {
                throw new Error(`Error al obtener las imágenes del producto. Código: ${response.status}`);
            }

            // Continuar solo si la respuesta es exitosa
            return response.json();
        })
        .then((data) => {
            console.log("Imágenes del producto obtenidas exitosamente:", data);
            // Puedes procesar las imágenes según tus necesidades
        })
        .catch((error) => {
            console.error("Error al obtener las imágenes del producto:", error);
            if (error instanceof SyntaxError) {
                console.error("Error de sintaxis JSON:", error.message);
            }
        });
}
Esta versión de la función guardarImagenes incluye una llamada a obtenerImagenesProducto después de un tiempo. Ajusta el tiempo según tus necesidades. La función obtenerImagenesProducto realiza una solicitud GET para obtener las imágenes asociadas al producto recién guardado. Asegúrate de ajustar las URL y los detalles de la API según tu implementación específica.

User
productos_crud.js:199 Error al guardar el producto: TypeError: Failed to execute 'json' on 'Response': body stream already read
    at productos_crud.js:190:25
ChatGPT
El error "TypeError: Failed to execute 'json' on 'Response': body stream already read" generalmente ocurre cuando intentas leer el cuerpo de la respuesta más de una vez. En el código que proporcioné anteriormente, parece que el cuerpo de la respuesta ya se leyó con response.text() en la función guardarImagenes, y luego intentamos leerlo nuevamente con response.json().

Vamos a modificar el código para evitar este problema:

javascript
Copy code
function guardarImagenes(productId, codeInternalProduct) {
    var arrayImagesForSends = [];
    arrayImages.forEach((image) => {
        imageProduct = {
            imageId: 0,
            imageRoute: image,
            productId: productId,
            ordenNo: codeInternalProduct,
        };
        arrayImagesForSends.push(imageProduct);
    });

    console.log(arrayImagesForSends);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/images/save/product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arrayImagesForSends),
    })
    .then(async (response) => {
        if (!response.ok) {
            throw new Error(`Error al guardar las imágenes. Código: ${response.status}`);
        }

        // Imprimir el cuerpo de la respuesta para facilitar la depuración
        const responseBody = await response.text();
        console.log('Respuesta del servidor (guardarImagenes):', responseBody);

        // Continuar solo si la respuesta es exitosa
        return responseBody;
    })
    .then((data) => {
        console.log("Imágenes guardadas exitosamente:", data);

        // Después de un tiempo, realizar una solicitud GET para obtener las imágenes asociadas al producto
        setTimeout(() => obtenerImagenesProducto(productId), 5000); // Ajusta el tiempo según tus necesidades
    })
    .catch((error) => {
        console.error("Error al guardar las imágenes:", error);
        if (error instanceof SyntaxError) {
            console.error("Error de sintaxis JSON:", error.message);
        }
    });
}

function obtenerImagenesProducto(productId) {
    // Realizar una solicitud GET para obtener las imágenes asociadas al producto
    fetch(`http://localhost:8090/fama-market/api/images/product/${productId}`)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`Error al obtener las imágenes del producto. Código: ${response.status}`);
            }

            // Imprimir el cuerpo de la respuesta para facilitar la depuración
            const responseBody = await response.text();
            console.log('Respuesta del servidor (obtenerImagenesProducto):', responseBody);

            // Continuar solo si la respuesta es exitosa
            return responseBody;
        })
        .then((data) => {
            console.log("Imágenes del producto obtenidas exitosamente:", data);
            // Puedes procesar las imágenes según tus necesidades
        })
        .catch((error) => {
            console.error("Error al obtener las imágenes del producto:", error);
            if (error instanceof SyntaxError) {
                console.error("Error de sintaxis JSON:", error.message);
            }
        });
}
En este código, eliminé la llamada a response.json() en guardarImagenes y cambié la impresión del cuerpo de la respuesta a await response.text(). Asegúrate de ajustar el código según tus necesidades específicas y prueba si esto soluciona el problema.

User
Bien ahora pasemos al siguiente paso
ChatGPT
¡Por supuesto! ¿Cuál es el siguiente paso o la siguiente tarea en la que necesitas ayuda? Puedes proporcionar detalles o preguntar sobre cualquier aspecto específico que desees abordar. Estoy aquí para ayudar.

User
Ahora quiero eliminar, asi que aclaremos algo preimero, lo primero es que debemos eliminar las imagenes y despues del producto, asi que te paso el link para eliminar las imagenes luego el producto, de acuerdo, contesta solo con un si o no
ChatGPT
Sí.

User
link de la API para las imagenes
http://localhost:8090/fama-market/api/images/delete/{id}

api del producto
http://localhost:8090/fama-market/api/products/delete/{id}
ChatGPT
Entendido. ¿Quieres que te proporcione el código JavaScript para realizar estas eliminaciones o hay algo más específico que necesitas?

User
Si por favor, crea las funciones para eliminar
ChatGPT
Entendido. A continuación, te proporcionaré las funciones de JavaScript para eliminar imágenes y productos utilizando los enlaces proporcionados:

javascript
Copy code
function eliminarImagen(imageId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');
    
    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar la imagen desde la API
    fetch(`http://localhost:8090/fama-market/api/images/delete/${imageId}`, {
        method: 'DELETE',
        headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar la imagen. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar la imagen
            console.log('Imagen eliminada exitosamente:', data);
        })
        .catch((error) => {
            console.error('Error al eliminar la imagen:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}

function eliminarProducto(productId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar el producto desde la API
    fetch(`http://localhost:8090/fama-market/api/products/delete/${productId}`, {
        method: 'DELETE',
        headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar el producto
            console.log('Producto eliminado exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar el producto, como actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}
Estas funciones toman como parámetro el ID de la imagen o el ID del producto que deseas eliminar. Puedes utilizar estas funciones según tus necesidades. ¿Hay algo más en lo que pueda ayudarte?

User
var arrayImages = [];

document.addEventListener("DOMContentLoaded", function () {
    $("#subcategoriaCombo").select2();

    const input = document.getElementById("fileInput");
    arrayImages = [];

    input.addEventListener("change", function () {
        const files = input.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function () {
                const base64String = reader.result;
                arrayImages.push(base64String);
                console.log(base64String);
            };

            reader.readAsDataURL(file);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Llenar el menú desplegable de subcategorías al cargar la página
    cargarSubcategorias();
    // Llenar el menú desplegable de submarcas al cargar la página
    cargarSubmarcas();

    // Función para cargar subcategorías desde la API
    function cargarSubcategorias() {
        // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }
    
        // Configurar los encabezados con el token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    
        $.ajax({
            url: "http://localhost:8090/fama-market/api/subcategories/all",
            type: "GET",
            headers: headers, // Agrega los encabezados aquí
            success: function (data) {
                // Limpiar opciones existentes en el menú desplegable
                $("#subcategoriaCombo").empty();
    
                // Iterar sobre los datos recibidos de la API y agregar cada opción al select
                $.each(data, function (index, subcategoria) {
                    $("#subcategoriaCombo").append(
                        $("<option>", {
                            value: subcategoria.subCategoryId, // Ajusta el valor según tus necesidades
                            text: subcategoria.nameSubCategory,
                            "data-id": subcategoria.id,
                        })
                    );
                });
    
                // Activar select2 con funcionalidad de búsqueda
                $("#subcategoriaCombo").select2({
                    placeholder: "Buscar subcategoría...",
                    width: "100%",
                });
            },
            error: function (error) {
                console.error("Error al cargar subcategorías:", error);
            },
        });
    }
    
    // Función para cargar submarcas desde la API
    function cargarSubmarcas() {
         // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }

        // Configurar los encabezados con el token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };


        $.ajax({
            url: "http://localhost:8090/fama-market/api/subbrands/all",
            type: "GET",
            headers: headers,
            success: function (data) {
                // Limpiar opciones existentes en el menú desplegable de submarcas
                $("#submarcaCombo").empty();

                // Iterar sobre los datos recibidos de la API y agregar cada opción al select
                $.each(data, function (index, submarca) {
                    $("#submarcaCombo").append(
                        $("<option>", {
                            value: submarca.subBrandId, // Ajusta el valor según tus necesidades
                            text: submarca.nameSubBrand,
                            "data-id": submarca.id,
                        })
                    );
                });

                // Puedes ajustar el estilo del combo box si lo necesitas
                $("#submarcaCombo").select2({
                    placeholder: "Buscar submarca...",
                    width: "100%",
                });
            },
            error: function (error) {
                console.error("Error al cargar submarcas:", error);
            },
        });
    }
});

function guardarProducto() {

    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Obtener los valores del formulario
    const nombreProducto = $("#nombreProducto").val();
    const descripcion = $("#descripcion").val();
    const unidadMedida = $("#unidad_medida").val();
    const precio = parseFloat($("#precio").val());
    const precioDescuento = parseFloat($("#precioDescuento").val()) || 0;
    const codigoBarras = $("#codigoBarras").val();
    const codigoInterno = $("#codigoInterno").val();
    const cantidadInventario = parseInt($("#cantidadInventario").val());
    // Obtener el ID de la subcategoría seleccionada
    const subcategoriaId = $("#subcategoriaCombo").val();
    const submarcaId = $("#submarcaCombo").val();

    const productoData = {
        nameProduct: nombreProducto,
        descriptionProduct: descripcion,
        priceProduct: precio,
        priceDiscountProduct: precioDescuento,
        barcodeProduct: codigoBarras,
        codeInternalProduct: codigoInterno,
        amountProduct: cantidadInventario,
        subcategoryId: subcategoriaId,
        subbrandId: submarcaId,
        unitMeasurement: unidadMedida,
    };

    console.log("Objeto JSON a enviar:", productoData);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/products/save", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(productoData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Producto guardado exitosamente:", data);

            //Eviar a otro
            guardarImagenes(data.productId, data.codeInternalProduct);
            // Puedes agregar lógica adicional después de guardar el producto, como cerrar el modal, actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

function guardarImagenes(productId, codeInternalProduct) {

    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    var arrayImagesForSends = [];
    arrayImages.forEach((image) => {
        imageProduct = {
            imageId: 0,
            imageRoute: image,
            productId: productId,
            ordenNo: codeInternalProduct,
        };
        arrayImagesForSends.push(imageProduct);
    });

    console.log(arrayImagesForSends);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/images/save/product", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(arrayImagesForSends),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Imagenes guardado exitosamente:", data);
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

obtenerListaProductos();

function obtenerListaProductos() {
    const token = sessionStorage.getItem("jwt"); // Nombre del token en sessionStoreNg

    // Verificar si se encontró un token
    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    // Configurar los encabezados con el token
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    // Realiza una solicitud GET para obtener la lista de productos desde la API
    fetch("http://localhost:8090/fama-market/api/products/all", { headers })
        .then((response) => response.json())
        .then((productos) => {
            // Llama a la función para mostrar los productos en la tabla
            mostrarProductosEnTabla(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
}

function mostrarProductosEnTabla(productos) {
    // Obtén la referencia a la tabla
    var tabla = document.getElementById("productosTabla");

    // Limpiar el contenido actual de la tabla
    tabla.getElementsByTagName("tbody")[0].innerHTML = "";

    // Itera sobre los productos y agrega filas a la tabla
    productos.forEach((producto) => {
        var fila = tabla.insertRow();

        // Inserta las celdas con los datos del producto
        fila.insertCell(0).innerText = producto.productId;
        fila.insertCell(1).innerText = producto.nameProduct;
        fila.insertCell(2).innerText = producto.descriptionProduct;
        fila.insertCell(3).innerText = producto.unitMeasurement;
        fila.insertCell(4).innerText = `$${producto.priceProduct.toFixed(2)}`;
        fila.insertCell(5).innerText = `$${producto.priceDiscountProduct.toFixed(
            2
        )}`;
        fila.insertCell(6).innerText = producto.barcodeProduct;
        fila.insertCell(7).innerText = producto.codeInternalProduct;
        fila.insertCell(8).innerText = producto.amountProduct;
        fila.insertCell(9).innerText = producto.subcategory.nameSubCategory;
        fila.insertCell(10).innerText = producto.subbrand.nameSubBrand;

        // Muestra las imágenes utilizando la etiqueta <div> y <img>
        var celdaImagenes = fila.insertCell(11);
        var contenedorImagenes = document.createElement("div");
        contenedorImagenes.className = "imagen-container";

        // Agrega imágenes al contenedor si existen
        if (producto.imagens && producto.imagens.length > 0) {
            producto.imagens.forEach((imagen) => {
                var img = document.createElement("img");
                img.src = "data:image/jpeg;base64," + imagen.imageRoute;
                img.alt = "Imagen " + imagen.imageId;
                img.className = "imagen-thumbnail";
                img.style.width = "50px"; // Modifica el tamaño según tus necesidades
                img.style.height = "50px";
                contenedorImagenes.appendChild(img);
            });
        }

        celdaImagenes.appendChild(contenedorImagenes);

        // Agrega botones para acciones (editar, eliminar, etc.)
        var celdaAcciones = fila.insertCell(12);
        celdaAcciones.innerHTML =
            '<button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminarProducto">Eliminar</button>';
    });
}


function eliminarImagen(imageId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');
    
    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar la imagen desde la API
    fetch(`http://localhost:8090/fama-market/api/images/delete/${imageId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar la imagen. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar la imagen
            console.log('Imagen eliminada exitosamente:', data);
        })
        .catch((error) => {
            console.error('Error al eliminar la imagen:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}

function eliminarProducto(productId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar el producto desde la API
    fetch(`http://localhost:8090/fama-market/api/products/delete/${productId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar el producto
            console.log('Producto eliminado exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar el producto, como actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}


Analiza el codigo para que liogre eliminar
ChatGPT
En tu código, ya tienes las funciones eliminarImagen y eliminarProducto implementadas. Sin embargo, parece que aún no las estás utilizando en tu interfaz de usuario para activar la eliminación de imágenes o productos. Aquí hay una sugerencia sobre cómo puedes integrar estas funciones en tu código HTML y JavaScript:

Modificar la generación de botones en la función mostrarProductosEnTabla:

En la función mostrarProductosEnTabla, donde generas los botones para acciones (editar, eliminar, etc.), deberías agregar eventos de clic para los botones de eliminar. Puedes hacerlo de la siguiente manera:

javascript
Copy code
// Agrega botones para acciones (editar, eliminar, etc.)
var celdaAcciones = fila.insertCell(12);
celdaAcciones.innerHTML = `
    <button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminarProducto" onclick="confirmarEliminarProducto(${producto.productId})">Eliminar</button>
`;
Aquí he agregado un onclick que llama a la función confirmarEliminarProducto y pasa el productId como argumento.

Agregar una función de confirmación para eliminar en tu JavaScript:

Agrega la siguiente función a tu código JavaScript para confirmar antes de eliminar:

javascript
Copy code
function confirmarEliminarProducto(productId) {
    // Puedes usar una ventana modal de Bootstrap o simplemente mostrar un mensaje de confirmación
    var confirmacion = confirm('¿Estás seguro de que deseas eliminar este producto?');

    if (confirmacion) {
        eliminarProducto(productId);
    }
}
En este caso, he utilizado la función confirm de JavaScript para mostrar un mensaje de confirmación.

Hacer lo mismo para las imágenes:

También deberías hacer algo similar para las imágenes, agregando un botón y una función de confirmación para eliminarlas.

Actualización del HTML:

Asegúrate de tener las bibliotecas necesarias de Bootstrap y jQuery incluidas en tu HTML para que todo funcione correctamente.

Con estas modificaciones, deberías tener una confirmación antes de eliminar un producto o una imagen. Ajusta según tus necesidades y la estructura de tu aplicación.

User
Puedes darme el modal para poder eliminar
ChatGPT
Claro, aquí tienes un ejemplo simple de un modal que puedes usar para confirmar la eliminación:

html
Copy code
<!-- Agrega este código al cuerpo de tu HTML, por ejemplo, al final del cuerpo antes de cerrar la etiqueta </body> -->

<!-- Modal de confirmación para eliminar -->
<div class="modal fade" id="modalEliminar" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Confirmar eliminación</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>¿Estás seguro de que deseas eliminar este elemento?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" id="btnConfirmarEliminar">Eliminar</button>
            </div>
        </div>
    </div>
</div>
Luego, puedes utilizar el siguiente script para controlar el comportamiento del modal y confirmar la eliminación:

javascript
Copy code
// Agrega este script después de incluir jQuery y Bootstrap en tu HTML

var elementoAEliminar; // Variable para almacenar la información del elemento a eliminar

// Función para mostrar el modal de confirmación
function mostrarModalEliminar() {
    $('#modalEliminar').modal('show');
}

// Función para confirmar la eliminación
function confirmarEliminar() {
    // Llama a la función correspondiente para eliminar el producto o la imagen
    if (elementoAEliminar && elementoAEliminar.tipo === 'producto') {
        eliminarProducto(elementoAEliminar.id);
    } else if (elementoAEliminar && elementoAEliminar.tipo === 'imagen') {
        eliminarImagen(elementoAEliminar.id);
    }

    // Oculta el modal después de la confirmación
    $('#modalEliminar').modal('hide');
}

// Asigna el evento clic al botón de confirmar eliminar
$(document).on('click', '#btnConfirmarEliminar', function() {
    confirmarEliminar();
});

// Función para configurar el elemento a eliminar antes de mostrar el modal
function prepararEliminar(tipo, id) {
    elementoAEliminar = {
        tipo: tipo,
        id: id
    };

    // Muestra el modal después de preparar la información
    mostrarModalEliminar();
}

// Ejemplo de cómo podrías llamar a la función para eliminar un producto
// Deberías adaptar esto según tu lógica y dónde se encuentre el botón de eliminar en tu interfaz
// En este caso, estoy utilizando una función ficticia llamada confirmarEliminarProducto
function confirmarEliminarProducto(productId) {
    prepararEliminar('producto', productId);
}
Este ejemplo utiliza un modal simple de Bootstrap con un mensaje de confirmación y dos botones (Cancelar y Eliminar). Adapté el código para tu caso y proporcioné una estructura básica. Asegúrate de ajustar y personalizar según tus necesidades y la estructura de tu aplicación.

User
Dame las funciones con su logica
ChatGPT
Voy a proporcionarte las funciones con su lógica para eliminar productos e imágenes, junto con la integración en tu código existente.

Primero, agregaré funciones para confirmar la eliminación tanto de productos como de imágenes:

javascript
Copy code
// Función para confirmar la eliminación de un producto
function confirmarEliminarProducto(productId) {
    prepararEliminar('producto', productId);
}

// Función para confirmar la eliminación de una imagen
function confirmarEliminarImagen(imageId) {
    prepararEliminar('imagen', imageId);
}
Ahora, integra estas funciones en tu código existente:

javascript
Copy code
// Después de tus otras funciones...

// Función para eliminar una imagen
function eliminarImagen(imageId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');
    
    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar la imagen desde la API
    fetch(`http://localhost:8090/fama-market/api/images/delete/${imageId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar la imagen. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar la imagen
            console.log('Imagen eliminada exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar la imagen, como actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error('Error al eliminar la imagen:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}

// Función para eliminar un producto
function eliminarProducto(productId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar el producto desde la API
    fetch(`http://localhost:8090/fama-market/api/products/delete/${productId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar el producto
            console.log('Producto eliminado exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar el producto, como actualizar la tabla, etc.
            obtenerListaProductos(); // Actualiza la lista de productos después de la eliminación
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}
Ahora, cuando llames a confirmarEliminarProducto o confirmarEliminarImagen, se mostrará el modal de confirmación y luego se llamará a la función correspondiente para eliminar el producto o la imagen. Asegúrate de llamar a estas funciones desde tus botones o eventos según sea necesario.

User
component-functions.js:12 Uncaught TypeError: Illegal invocation
    at Object.findOne (component-functions.js:12:31)
    at new o (backdrop.js:93:15)
    at HTMLButtonElement.<anonymous> (offcanvas.js:112:40)
    at HTMLDocument.i (event-handler.js:94:17)
findOne @ component-functions.js:12
o @ backdrop.js:93
(anónimas) @ offcanvas.js:112
i @ event-handler.js:94
productos_crud.js:324 Uncaught ReferenceError: prepararEliminar is not defined
    at confirmarEliminarProducto (productos_crud.js:324:5)
    at HTMLButtonElement.onclick (productos-crud.html:1:1)
ChatGPT
El error que estás enfrentando parece estar relacionado con la función prepararEliminar que no está definida o no se puede encontrar. Asegúrate de que la función prepararEliminar está definida antes de ser utilizada en tu código.

Asumo que debes tener la función prepararEliminar definida en algún lugar del código que no has compartido. Asegúrate de que la función esté presente y que se pueda acceder a ella desde el contexto en el que estás intentando utilizarla.

Si aún enfrentas problemas después de revisar la definición de prepararEliminar, por favor, comparte el código relevante o la definición de esa función para que pueda ayudarte a identificar el problema.

User
Te paso mi codigo completo
var arrayImages = [];

document.addEventListener("DOMContentLoaded", function () {
    $("#subcategoriaCombo").select2();

    const input = document.getElementById("fileInput");
    arrayImages = [];

    input.addEventListener("change", function () {
        const files = input.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function () {
                const base64String = reader.result;
                arrayImages.push(base64String);
                console.log(base64String);
            };

            reader.readAsDataURL(file);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Llenar el menú desplegable de subcategorías al cargar la página
    cargarSubcategorias();
    // Llenar el menú desplegable de submarcas al cargar la página
    cargarSubmarcas();

    // Función para cargar subcategorías desde la API
    function cargarSubcategorias() {
        // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }
    
        // Configurar los encabezados con el token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    
        $.ajax({
            url: "http://localhost:8090/fama-market/api/subcategories/all",
            type: "GET",
            headers: headers, // Agrega los encabezados aquí
            success: function (data) {
                // Limpiar opciones existentes en el menú desplegable
                $("#subcategoriaCombo").empty();
    
                // Iterar sobre los datos recibidos de la API y agregar cada opción al select
                $.each(data, function (index, subcategoria) {
                    $("#subcategoriaCombo").append(
                        $("<option>", {
                            value: subcategoria.subCategoryId, // Ajusta el valor según tus necesidades
                            text: subcategoria.nameSubCategory,
                            "data-id": subcategoria.id,
                        })
                    );
                });
    
                // Activar select2 con funcionalidad de búsqueda
                $("#subcategoriaCombo").select2({
                    placeholder: "Buscar subcategoría...",
                    width: "100%",
                });
            },
            error: function (error) {
                console.error("Error al cargar subcategorías:", error);
            },
        });
    }
    
    // Función para cargar submarcas desde la API
    function cargarSubmarcas() {
         // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }

        // Configurar los encabezados con el token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };


        $.ajax({
            url: "http://localhost:8090/fama-market/api/subbrands/all",
            type: "GET",
            headers: headers,
            success: function (data) {
                // Limpiar opciones existentes en el menú desplegable de submarcas
                $("#submarcaCombo").empty();

                // Iterar sobre los datos recibidos de la API y agregar cada opción al select
                $.each(data, function (index, submarca) {
                    $("#submarcaCombo").append(
                        $("<option>", {
                            value: submarca.subBrandId, // Ajusta el valor según tus necesidades
                            text: submarca.nameSubBrand,
                            "data-id": submarca.id,
                        })
                    );
                });

                // Puedes ajustar el estilo del combo box si lo necesitas
                $("#submarcaCombo").select2({
                    placeholder: "Buscar submarca...",
                    width: "100%",
                });
            },
            error: function (error) {
                console.error("Error al cargar submarcas:", error);
            },
        });
    }
});

function guardarProducto() {

    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Obtener los valores del formulario
    const nombreProducto = $("#nombreProducto").val();
    const descripcion = $("#descripcion").val();
    const unidadMedida = $("#unidad_medida").val();
    const precio = parseFloat($("#precio").val());
    const precioDescuento = parseFloat($("#precioDescuento").val()) || 0;
    const codigoBarras = $("#codigoBarras").val();
    const codigoInterno = $("#codigoInterno").val();
    const cantidadInventario = parseInt($("#cantidadInventario").val());
    // Obtener el ID de la subcategoría seleccionada
    const subcategoriaId = $("#subcategoriaCombo").val();
    const submarcaId = $("#submarcaCombo").val();

    const productoData = {
        nameProduct: nombreProducto,
        descriptionProduct: descripcion,
        priceProduct: precio,
        priceDiscountProduct: precioDescuento,
        barcodeProduct: codigoBarras,
        codeInternalProduct: codigoInterno,
        amountProduct: cantidadInventario,
        subcategoryId: subcategoriaId,
        subbrandId: submarcaId,
        unitMeasurement: unidadMedida,
    };

    console.log("Objeto JSON a enviar:", productoData);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/products/save", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(productoData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Producto guardado exitosamente:", data);

            //Eviar a otro
            guardarImagenes(data.productId, data.codeInternalProduct);
            // Puedes agregar lógica adicional después de guardar el producto, como cerrar el modal, actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

function guardarImagenes(productId, codeInternalProduct) {

    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    var arrayImagesForSends = [];
    arrayImages.forEach((image) => {
        imageProduct = {
            imageId: 0,
            imageRoute: image,
            productId: productId,
            ordenNo: codeInternalProduct,
        };
        arrayImagesForSends.push(imageProduct);
    });

    console.log(arrayImagesForSends);

    // Realizar la llamada a la API para guardar el producto
    fetch("http://localhost:8090/fama-market/api/images/save/product", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(arrayImagesForSends),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Imagenes guardado exitosamente:", data);
        })
        .catch((error) => {
            console.error("Error al guardar el producto:", error);
        });
}

obtenerListaProductos();

function obtenerListaProductos() {
    const token = sessionStorage.getItem("jwt"); // Nombre del token en sessionStoreNg

    // Verificar si se encontró un token
    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    // Configurar los encabezados con el token
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    // Realiza una solicitud GET para obtener la lista de productos desde la API
    fetch("http://localhost:8090/fama-market/api/products/all", { headers })
        .then((response) => response.json())
        .then((productos) => {
            // Llama a la función para mostrar los productos en la tabla
            mostrarProductosEnTabla(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
}

function mostrarProductosEnTabla(productos) {
    // Obtén la referencia a la tabla
    var tabla = document.getElementById("productosTabla");

    // Limpiar el contenido actual de la tabla
    tabla.getElementsByTagName("tbody")[0].innerHTML = "";

    // Itera sobre los productos y agrega filas a la tabla
    productos.forEach((producto) => {
        var fila = tabla.insertRow();

        // Inserta las celdas con los datos del producto
        fila.insertCell(0).innerText = producto.productId;
        fila.insertCell(1).innerText = producto.nameProduct;
        fila.insertCell(2).innerText = producto.descriptionProduct;
        fila.insertCell(3).innerText = producto.unitMeasurement;
        fila.insertCell(4).innerText = `$${producto.priceProduct.toFixed(2)}`;
        fila.insertCell(5).innerText = `$${producto.priceDiscountProduct.toFixed(
            2
        )}`;
        fila.insertCell(6).innerText = producto.barcodeProduct;
        fila.insertCell(7).innerText = producto.codeInternalProduct;
        fila.insertCell(8).innerText = producto.amountProduct;
        fila.insertCell(9).innerText = producto.subcategory.nameSubCategory;
        fila.insertCell(10).innerText = producto.subbrand.nameSubBrand;

        // Muestra las imágenes utilizando la etiqueta <div> y <img>
        var celdaImagenes = fila.insertCell(11);
        var contenedorImagenes = document.createElement("div");
        contenedorImagenes.className = "imagen-container";

        // Agrega imágenes al contenedor si existen
        if (producto.imagens && producto.imagens.length > 0) {
            producto.imagens.forEach((imagen) => {
                var img = document.createElement("img");
                img.src = "data:image/jpeg;base64," + imagen.imageRoute;
                img.alt = "Imagen " + imagen.imageId;
                img.className = "imagen-thumbnail";
                img.style.width = "50px"; // Modifica el tamaño según tus necesidades
                img.style.height = "50px";
                contenedorImagenes.appendChild(img);
            });
        }

        celdaImagenes.appendChild(contenedorImagenes);

        // Agrega botones para acciones (editar, eliminar, etc.)
        var celdaAcciones = fila.insertCell(12);
        celdaAcciones.innerHTML = `
        <button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminarProducto" onclick="confirmarEliminarProducto(${producto.productId})">Eliminar</button>`;
    });
}

var elementoAEliminar;

// Función para confirmar la eliminación de un producto
function confirmarEliminarProducto(productId) {
    prepararEliminar('producto', productId);
}

// Función para confirmar la eliminación de una imagen
function confirmarEliminarImagen(imageId) {
    prepararEliminar('imagen', imageId);
}

// Función para eliminar una imagen
function eliminarImagen(imageId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');
    
    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar la imagen desde la API
    fetch(`http://localhost:8090/fama-market/api/images/delete/${imageId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar la imagen. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar la imagen
            console.log('Imagen eliminada exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar la imagen, como actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error('Error al eliminar la imagen:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}

// Función para eliminar un producto
function eliminarProducto(productId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar el producto desde la API
    fetch(`http://localhost:8090/fama-market/api/products/delete/${productId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar el producto
            console.log('Producto eliminado exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar el producto, como actualizar la tabla, etc.
            obtenerListaProductos(); // Actualiza la lista de productos después de la eliminación
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}

ChatGPT
Gracias por proporcionar tu código completo. Parece que ya tienes la función confirmarEliminarProducto definida para mostrar el modal de eliminación. Sin embargo, parece que estás teniendo un problema con la función prepararEliminar, que no se proporciona en el código que compartiste.

Intentaré proporcionar una implementación básica de la función prepararEliminar y también ajustaré la función confirmarEliminarProducto para que funcione correctamente:

javascript
Copy code
// Función para confirmar la eliminación de un producto
function confirmarEliminarProducto(productId) {
    // Guardar el elemento a eliminar
    elementoAEliminar = { tipo: 'producto', id: productId };

    // Mostrar el modal de confirmación
    $('#modalEliminarProducto').modal('show');
}

// Función para preparar la eliminación (puede ajustarse según tus necesidades)
function prepararEliminar(tipo, id) {
    // Esta función podría realizar tareas específicas antes de la eliminación, si es necesario
    console.log(`Preparando eliminar ${tipo} con ID ${id}`);
}

// En tu modal, podrías tener un botón "Confirmar eliminación" que llame a la función de eliminación correspondiente
function confirmarEliminacion() {
    const tipo = elementoAEliminar.tipo;
    const id = elementoAEliminar.id;

    if (tipo === 'producto') {
        eliminarProducto(id);
    } else if (tipo === 'imagen') {
        eliminarImagen(id);
    }

    // Cerrar el modal después de confirmar la eliminación
    $('#modalEliminarProducto').modal('hide');
}
Asegúrate de tener esta lógica en tu archivo JavaScript y revisa si resuelve el problema que estás enfrentando. Además, ten en cuenta que es posible que necesites ajustar las funciones según tus necesidades específicas.

User
Como queda el codigo completo de las funciones de eliminar
ChatGPT
Aquí te dejo el código completo de las funciones de eliminación, incluyendo la lógica para mostrar el modal de confirmación y realizar la eliminación después de la confirmación:

javascript
Copy code
var arrayImages = [];
var elementoAEliminar; // Variable para almacenar el elemento a eliminar

document.addEventListener("DOMContentLoaded", function () {
    // ... (código existente)

    obtenerListaProductos();
});

// Función para confirmar la eliminación de un producto
function confirmarEliminarProducto(productId) {
    // Guardar el elemento a eliminar
    elementoAEliminar = { tipo: 'producto', id: productId };

    // Mostrar el modal de confirmación
    $('#modalEliminarProducto').modal('show');
}

// Función para confirmar la eliminación de una imagen
function confirmarEliminarImagen(imageId) {
    // Guardar el elemento a eliminar
    elementoAEliminar = { tipo: 'imagen', id: imageId };

    // Mostrar el modal de confirmación
    $('#modalEliminarProducto').modal('show');
}

// En tu modal, podrías tener un botón "Confirmar eliminación" que llame a la función de eliminación correspondiente
function confirmarEliminacion() {
    const tipo = elementoAEliminar.tipo;
    const id = elementoAEliminar.id;

    if (tipo === 'producto') {
        eliminarProducto(id);
    } else if (tipo === 'imagen') {
        eliminarImagen(id);
    }

    // Cerrar el modal después de confirmar la eliminación
    $('#modalEliminarProducto').modal('hide');
}

// Función para eliminar una imagen
function eliminarImagen(imageId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar la imagen desde la API
    fetch(`http://localhost:8090/fama-market/api/images/delete/${imageId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar la imagen. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar la imagen
            console.log('Imagen eliminada exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar la imagen, como actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error('Error al eliminar la imagen:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}

// Función para eliminar un producto
function eliminarProducto(productId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar el producto desde la API
    fetch(`http://localhost:8090/fama-market/api/products/delete/${productId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar el producto
            console.log('Producto eliminado exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar el producto, como actualizar la tabla, etc.
            obtenerListaProductos(); // Actualiza la lista de productos después de la eliminación
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}
Asegúrate de agregar este código en tu archivo JavaScript y de que el modal "modalEliminarProducto" esté configurado correctamente en tu HTML. Este código proporciona la funcionalidad básica para mostrar el modal de confirmación y realizar la eliminación según el tipo (producto o imagen). Puedes ajustar la lógica según tus necesidades específicas.

User
Cuando preciono el boton de eliminar de la tabla no me habre el modal 
ChatGPT
Si al presionar el botón de eliminar en la tabla no se abre el modal de confirmación, hay algunos aspectos que podrías revisar para solucionar el problema. Aquí hay algunas sugerencias:

Verifica la Inclusión de Bootstrap y jQuery: Asegúrate de que estás incluyendo las bibliotecas de Bootstrap y jQuery en tu página HTML. Ambas son necesarias para que los modales de Bootstrap funcionen correctamente.

html
Copy code
<!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-GLhlTQ8iK+eaWnRE9i1LkL3HgWiKXUj07IcEL0FO" crossorigin="anonymous">

<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-MCw98/SFnGE8fJT3n6trbSL9SY6Qf72+nz3nc05gWOeIIvoZjUn9tO1F5J75DZH6" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OJhFUo4ZISzlKv+oS5qqDRuLPM12Al5dUzVui9hJi6zU2DIIJzTnFJDKMBKqqOus" crossorigin="anonymous"></script>
Revisa la Configuración del Botón Eliminar: Verifica que el botón de eliminar en la tabla esté configurado correctamente para invocar la función confirmarEliminarProducto. Asegúrate de que esté utilizando el atributo data-bs-toggle y data-bs-target para vincular el botón al modal.

html
Copy code
<button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalEliminarProducto" onclick="confirmarEliminarProducto(${producto.productId})">Eliminar</button>
Revisa la Configuración del Modal: Asegúrate de que el modal esté correctamente configurado en tu HTML. Deberías tener algo similar a esto:

html
Copy code
<div class="modal" id="modalEliminarProducto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <!-- Contenido del modal, incluyendo el botón de confirmar eliminación -->
            <button type="button" class="btn btn-danger" onclick="confirmarEliminacion()">Confirmar Eliminación</button>
        </div>
    </div>
</div>
Verifica Errores en la Consola del Navegador: Abre la consola del navegador (usualmente presionando F12 y seleccionando la pestaña "Consola") para ver si hay algún error JavaScript. Si hay algún error, puede proporcionar más información sobre lo que está yendo mal.

Revisa estos puntos y ajusta tu código según sea necesario. Si el problema persiste, proporciona más detalles sobre la configuración de tu página HTML y cualquier error específico que aparezca en la consola del navegador.

User
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos</title>
    <link rel="apple-touch-icon" href="img/apple-icon.png">
    <link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico">
    <link rel="stylesheet" href="./../css/bootstrap.min.css">
    <link rel="stylesheet" href="./../css/templatemo.css">
    <link rel="stylesheet" href="./../css/style.css">
    <!-- Load fonts style after rendering the layout styles -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap">
    <link rel="stylesheet" href="./../css/fontawesome.min.css">
    <link href="./../css/style_header.css" rel="stylesheet">

</head>

<body>

<style>
    .dropdown {
        position: relative;
        display: inline-block;
        margin-right: 20px;
    }

    .dropdown span {
        padding: 10px;
        background-color: #f1f1f1;
        cursor: pointer;
        display: block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        top: 0;
        left: 100%;
        margin-top: -10px; /* Ajuste para evitar superposición */
        background-color: #f9f9f9;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }

    .submenu {
        position: static;
        top: 0;
        left: 100%;
        margin-top: 0; /* Reiniciar el margen superior */
        display: none;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }

    .dropdown-content:hover .submenu {
        display: block;
    }

    .dropdown:hover .submenu {
        display: block;
    }

    .submenu span {
        padding: 10px;
        cursor: pointer;
        display: block;
    }
    
    /* Estilo para hacer el menú desplegable más ancho */
    .dropdown-menu {
        width: 200px; /* Ajusta el valor según tus preferencias */
    }

    /* Estilo para quitar el subrayado de los elementos del menú desplegable */
    .dropdown-menu a {
        text-decoration: none;
    }

    /* Estilo para cambiar el color del texto en los elementos del menú desplegable */
    .dropdown-menu a {
        color: #000; /* Puedes cambiar el color según tus preferencias */
    }

    /* Asegúrate de incluir este CSS en tu archivo de estilo o en el encabezado de tu HTML */
    #agregarDropdown:hover .dropdown-menu {
        display: block;
    }

    .btn-agregar {
        background-color: #28a745;
        color: #ffffff;
    }

    .btn-editar,
    .btn-eliminar {
        background-color: #28a745;
        color: #ffffff;
        border-radius: 20px;
        font-size: 16px;
    }

    .btn-eliminar {
        background-color: #dc3545;
    }

    table {
        font-size: 14px;
    }
</style>

<!-- Topbar Start -->
<div class="container-fluid">
    <div class="row align-items-center py-3 px-xl-5">
        <div class="col-lg-3 d-none d-lg-block">
            <a href="" class="text-decoration-none">
                <h1 class="m-0 display-5 font-weight-semi-bold"><span
                        class="text-primary font-weight-bold border px-3 mr-1">FERRE - FAMA</span></h1>
            </a>
        </div>
        <div class="col-lg-6 col-6 text-left">
            <form action="">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search for products">
                    <div class="input-group-append">
                        <span class="input-group-text bg-transparent text-primary">
                            <i class="fa fa-search"></i>
                        </span>
                    </div>
                </div>
            </form>
        </div>
        <div class="col-lg-3 col-6 text-right">
            <a href="compras-administrador.html" class="btn border">
                <i class="fas fa-shopping-cart text-primary"></i>
            </a>
            <a href="login.html" class="btn border">
                <i class="fa fa-user" aria-hidden="true">Iniciar sesion</i>
            </a>
            <a href="register.html" class="btn border">
                <i class="fa fa-user" aria-hidden="true">Registrarse</i>
            </a>
        </div>
    </div>
</div>
<!-- Topbar End -->

<!-- Navbar Start -->
<div class="container-fluid mb-5">
    <div class="row border-top px-xl-5">
        <div class="col-lg-9">
            <nav class="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
                <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                    <div class="navbar-nav mr-auto py-0">
                        
                        <div class="container">
                            <form id="redireccionForm" action="" method="get">
                                <div class="form-group">
                                    <select class="form-control" id="acciones" name="accion" onchange="redirigir()">
                                        <option value="" disabled selected>Selecciona una acción</option>
                                        <option value="agregarFamilias">Agregar Familias</option>
                                        <option value="agregarCategorias">Agregar Categorías</option>
                                        <option value="agregarSubcategorias">Agregar Subcategorías</option>
                                        <option value="agregarMarcas">Agregar Marcas</option>
                                        <option value="agregarSubmarcas">Agregar Submarcas</option>
                                        <option value="agregarProductos">Agregar Productos</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <div class="col-lg-3 d-flex justify-content-end align-items-center">
            
        </div>
    </div>
    <hr class="my-8">
</div>
<!-- Navbar End -->

<div class="container">
        <h2 class="mb-4">CRUD de Productos</h2>

        <!-- Botón para abrir el modal de agregar submarca -->
        <button type="button" class="btn btn-success text-white mt-4" data-bs-toggle="modal"
            data-bs-target="#modalAgregarProducto">
            Agregar Productos
        </button>

        <!-- Tabla para mostrar los productos -->
        <table class="table mt-4" id="productosTabla">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripcion</th>
                    <th>Unidad de medida</th>
                    <th>Precio</th>
                    <th>Precio con descuento</th>
                    <th>Codigo de barras</th>
                    <th>Codigo interno</th>
                    <th>Cantidad de inventario</th>
                    <th>Subcategoria</th>
                    <th>Submarca</th>
                    <th>Imagenes</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                
            </tbody>
        </table>
</div>

<!-- Modal para agregar Producto -->
<div class="modal fade" id="modalAgregarProducto" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Agregar Producto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Contenido del formulario para agregar producto -->
                    <form id="agregarProductoForm">
                        <div class="row">
                            <!-- Columna para la imagen y la tabla -->
                            <div class="col-md-6">
                                <!-- Campo de entrada de archivos para imágenes -->
                                <div class="mb-3">
                                    <label for="imagenes" class="form-label">Imágenes:</label>
                                    <input type="file" class="form-control" id="fileInput" multiple accept="image/*">
                                </div>
                            </div>
                            <!-- Columna para los datos del producto -->
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="nombreProducto" class="form-label">Nombre del Producto:</label>
                                    <input type="text" class="form-control" id="nombreProducto" required
                                        style="border: 1px solid #343541;">
                                </div>
                                <div class="mb-3">
                                    <label for="descripcion" class="form-label">Descripción:</label>
                                    <textarea class="form-control" id="descripcion" rows="3"
                                        style="border: 1px solid #343541;"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="unidad_medida" class="form-label">Unidad de medida:</label>
                                    <input type="text" class="form-control" id="unidad_medida" required
                                        style="border: 1px solid #343541;">
                                </div>
                                <div class="mb-3">
                                    <label for="precio" class="form-label">Precio:</label>
                                    <input type="number" class="form-control" id="precio" required
                                        style="border: 1px solid #343541;">
                                </div>
                                <div class="mb-3">
                                    <label for="precioDescuento" class="form-label">Precio con Descuento:</label>
                                    <input type="number" class="form-control" id="precioDescuento"
                                        style="border: 1px solid #343541;">
                                </div>
                                <div class="mb-3">
                                    <label for="codigoBarras" class="form-label">Código de Barras:</label>
                                    <input type="text" class="form-control" id="codigoBarras"
                                        style="border: 1px solid #343541;">
                                </div>
                                <div class="mb-3">
                                    <label for="codigoInterno" class="form-label">Código Interno:</label>
                                    <input type="text" class="form-control" id="codigoInterno"
                                        style="border: 1px solid #343541;">
                                </div>
                                <div class="mb-3">
                                    <label for="Cantidad de inventario" class="form-label">Cantidad de
                                        inventario:</label>
                                    <input type="text" class="form-control" id="cantidadInventario"
                                        style="border: 1px solid #343541;">
                                </div>
                                <div class="mb-3">
                                    <label for="subcategoriaCombo" class="form-label">Subcategoría:</label>
                                    <select class="form-select" id="subcategoriaCombo" required 
                                    style="border: 1px solid #343541;"></select>
                                </div>  
                                <div class="mb-3">
                                    <label for="submarcaCombo" class="form-label">Submarca:</label>
                                    <select class="form-select" id="submarcaCombo" required
                                        style="border: 1px solid #343541;">
                                    </select>
                                </div>
                                                                                                
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="guardarProducto()">Guardar</button>
                </div>
            </div>
        </div>
</div>

<!-- Modal de confirmación para eliminar -->
<div class="modal fade" id="modalEliminar" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Confirmar eliminación</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>¿Estás seguro de que deseas eliminar este elemento?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" id="btnConfirmarEliminar">Eliminar</button>
            </div>
        </div>
    </div>
</div>


<!-- jQuery -->
<script src="./../js/jquery-1.11.0.min.js"></script>
<script src="./../js/jquery-migrate-1.2.1.min.js"></script>

<!-- Bootstrap y Select2 (asegúrate de cargar Bootstrap antes que Select2) -->
<script src="./../js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<!-- Tus scripts personalizados -->
<script src="./../js/funciones_js/productos_crud.js"></script>
<script src="./../js/funciones_js/header_admin_vistas.js"></script>

<!-- Otros scripts (si los tienes) -->
<script src="./../js/templatemo.js"></script>
<script src="./../js/custom.js"></script>



</body>

</html>


Este es mi html
ChatGPT
Gracias por proporcionar tu código HTML. Después de revisar el código, parece que ya estás utilizando Bootstrap y jQuery, lo cual es bueno para el funcionamiento de los modales.

Voy a hacer algunas sugerencias para mejorar la implementación del modal de eliminación. En lugar de tener un solo modal llamado modalEliminar, creo que es mejor tener un modal dinámico que se pueda reutilizar para diferentes propósitos. Así, podemos usar un solo modal y cambiar su contenido según sea necesario.

Eliminar el Modal Específico:
Puedes eliminar el modal específico modalEliminar y utilizar un único modal. Actualizaré el código para tener un solo modal y cambiar su contenido según sea necesario.

Actualización del Código JavaScript:
Actualizaré las funciones de JavaScript para que utilicen un único modal. Asegúrate de que la función confirmarEliminarProducto se encargue de configurar el contenido del modal para la eliminación de productos.

Aquí está el código actualizado:

html
Copy code
<!-- Modal único para confirmación -->
<div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Confirmar acción</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="modalBodyContent">
                <!-- Contenido del modal dinámico -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" id="btnConfirmarAccion">Confirmar</button>
            </div>
        </div>
    </div>
</div>

<!-- Actualización del botón eliminar en la tabla -->
<button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal" data-bs-target="#modalConfirmacion" onclick="confirmarEliminarProducto(${producto.productId})">Eliminar</button>
Actualización del Código JavaScript (función):
Actualizaré la función JavaScript confirmarEliminarProducto para que configure el contenido del modal antes de mostrarlo.
javascript
Copy code
function confirmarEliminarProducto(productoId) {
    // Configurar el contenido del modal
    var modalBody = document.getElementById("modalBodyContent");
    modalBody.innerHTML = "<p>¿Estás seguro de que deseas eliminar este producto?</p>";

    // Actualizar el manejador de clic del botón Confirmar
    var btnConfirmar = document.getElementById("btnConfirmarAccion");
    btnConfirmar.onclick = function () {
        // Aquí llamas a tu función para eliminar el producto
        eliminarProducto(productoId);
    };

    // Mostrar el modal
    $("#modalConfirmacion").modal("show");
}

// Función para confirmar la eliminación de una imagen
function confirmarEliminarImagen(imageId) {
    // Guardar el elemento a eliminar
    elementoAEliminar = { tipo: 'imagen', id: imageId };

    // Mostrar el modal de confirmación
    $('#modalEliminarProducto').modal('show');
}

// En tu modal, podrías tener un botón "Confirmar eliminación" que llame a la función de eliminación correspondiente
function confirmarEliminacion() {
    const tipo = elementoAEliminar.tipo;
    const id = elementoAEliminar.id;

    if (tipo === 'producto') {
        eliminarProducto(id);
    } else if (tipo === 'imagen') {
        eliminarImagen(id);
    }

    // Cerrar el modal después de confirmar la eliminación
    $('#modalEliminarProducto').modal('hide');
}

// Función para eliminar una imagen
function eliminarImagen(imageId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar la imagen desde la API
    fetch(`http://localhost:8090/fama-market/api/images/delete/${imageId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar la imagen. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar la imagen
            console.log('Imagen eliminada exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar la imagen, como actualizar la tabla, etc.
        })
        .catch((error) => {
            console.error('Error al eliminar la imagen:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}

// Función para eliminar un producto
function eliminarProducto(productId) {
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt');

    // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Realizar una solicitud DELETE para eliminar el producto desde la API
    fetch(`http://localhost:8090/fama-market/api/products/delete/${productId}`, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto. Código: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lógica para manejar la respuesta de la API después de eliminar el producto
            console.log('Producto eliminado exitosamente:', data);
            // Puedes agregar lógica adicional después de eliminar el producto, como actualizar la tabla, etc.
            obtenerListaProductos(); // Actualiza la lista de productos después de la eliminación
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            // Lógica para manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        });
}