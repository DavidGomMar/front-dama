document.addEventListener("DOMContentLoaded", function () {
    const jwtToken = sessionStorage.getItem("jwt");
    const loginButton = document.querySelector("#loginButton");
    const registerButton = document.querySelector("#registerButton");

    if (jwtToken) {
        // Si hay un token en el sessionStorage, ocultar los botones de login y registro
        loginButton.style.display = "none";
        registerButton.style.display = "none";
    } else {
        // Si no hay un token, mostrar los botones de login y registro
        loginButton.style.display = "inline-block";
        registerButton.style.display = "inline-block";
    }
});



$(function () {
    // Llama a la función para obtener y mostrar las submarcas al cargar la página
    obtenerListaSubmarcas();
});
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
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    // Realiza una solicitud GET para obtener la lista de submarcas desde la API
    fetch("http://localhost:8090/fama-market/api/subbrands/all", {headers})
        .then((response) => response.json())
        .then((submarcas) => {
            // Filtra las dos primeras submarcas
            var submarcasAMostrar = submarcas.slice(0, 2);

            // Llama a la función para mostrar las submarcas en el contenedor
            mostrarSubmarcas(submarcasAMostrar);
        })
        .catch((error) => {
            console.error('Error al obtener la lista de submarcas:', error);
        });
}

function mostrarSubmarcas(submarcas) {
    // Obtén la referencia al contenedor
    var contenedor = document.getElementById("submarcaContainer");

    // Crea un div para contener las imágenes y el botón
    var contenedorImagenes = document.createElement("div");
    contenedorImagenes.className = "d-flex justify-content-center"; // Agrega la clase para centrar horizontalmente

    // Itera sobre las dos primeras submarcas y agrega imágenes al contenedor
    submarcas.forEach((submarca) => {
        var img = document.createElement("img");
        img.src = "data:image/jpeg;base64," + submarca.linkImageSubbrand;
        img.alt = submarca.nameSubBrand;
        img.className = "rounded-circle img-fluid border mr-3"; // Agrega margen derecho

        img.onclick = function () {
            redirigirAProductos(submarca.nameSubBrand);
        };

        contenedorImagenes.appendChild(img);
    });

    // Agrega un botón para redirigir a la página correspondiente
    var botonRedireccion = document.createElement("button");
    botonRedireccion.innerText = "Redirigir a productos";
    botonRedireccion.className = "btn btn-primary mt-3";

    botonRedireccion.onclick = function () {
        // Redirige a la página correspondiente (puedes ajustar la lógica según sea necesario)
        console.log("Redirigiendo a productos...");
    };

    // Agrega el contenedor de imágenes y el botón al contenedor principal
    contenedor.appendChild(contenedorImagenes);
    contenedor.appendChild(botonRedireccion);
}

obtenerListaProductos();

function obtenerListaProductos() {
    const token = sessionStorage.getItem("jwt"); // Nombre del token en sessionStoreNg
    console.log(token);
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
            mostrarProductos(productos);
            console.log(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
}

function mostrarProductos(productos) {
    // Itera sobre la lista de productos
    productos.forEach((producto, index) => {
        // Obtiene el elemento del producto por su ID
        const elementoProducto = document.getElementById(`producto${index + 3}`);

        // Verifica si el elemento existe
        if (elementoProducto) {
            // Obtiene los elementos hijos del producto
            const contenedorFoto = elementoProducto.querySelector('.contenedor-foto');
            const nombreProducto = elementoProducto.querySelector('.descripcion');
            const precioProducto = elementoProducto.querySelector('.precio');

            // Verifica si los elementos hijos existen
            if (contenedorFoto && nombreProducto && precioProducto) {
                // Agrega las imágenes al contenedor de fotos si existen
                if (producto.imagens && producto.imagens.length > 0) {
                    producto.imagens.forEach((imagen) => {
                        const img = document.createElement('img');
                        img.src = "data:image/jpeg;base64," + imagen.imageRoute;
                        img.alt = "Imagen " + imagen.imageId;
                        img.className = "imagen-thumbnail";
                        img.style.width = "50px"; // Modifica el tamaño según tus necesidades
                        img.style.height = "50px";
                        contenedorFoto.appendChild(img);
                    });
                }

                // Agrega el nombre del producto al elemento correspondiente
                nombreProducto.textContent = producto.nameProduct;

                // Agrega el precio del producto al elemento correspondiente
                precioProducto.textContent = `$ ${producto.priceProduct}`;
            }
        }
    });
}



