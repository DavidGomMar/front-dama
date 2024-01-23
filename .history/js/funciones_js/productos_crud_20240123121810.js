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
