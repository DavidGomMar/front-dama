document.addEventListener("DOMContentLoaded", function () {
    // Obtener la URL actual
    const currentUrl = window.location.href;

    // Obtener el parámetro "categoriaId" de la URL
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const categoriaId = urlParams.get("categoriaId");
    const subcategoriaId = urlParams.get("subcategoriaId"); // Nuevo código para obtener subcategoriaId

    // Mostrar el ID en la consola
    console.log("ID de la categoría:", categoriaId);
    console.log("ID de la subcategoría:", subcategoriaId); // Mostrar también el ID de la subcategoría

    if (categoriaId) {
        obtenerListaProductosByCategoria(categoriaId);
        mostrarProductosByCategoria(categoriaId);
        console.log("Ejecutas esto primero");
    } else if (subcategoriaId) {
        obtenerListaProductosBySubcategoria(subcategoriaId);
        mostrarProductosBySubcategoria(subcategoriaId);
        console.log("Ejecutas esto solo si hay subcategoriaId");
    } else {
        obtenerListaProductos();
        mostrarProductos();
        console.log("Pero estoy loco y también ejecuto este a pesar de ejecutar un if antes que yo un else");
    }
});


// Llama a esta función al cargar la página o cuando necesites mostrar los productos
function cargarProductos() {

}

function obtenerListaProductos() {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    fetch("http://localhost:8090/fama-market/api/products/all", { headers })
        .then((response) => response.json())
        .then((productos) => {
                        console.log("Respuesta del servidor:", productos);
            // Llama a la función para mostrar los productos en la tabla
            mostrarProductos(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
}

function mostrarProductos(productos) {
    const contenedorProductos = document.querySelector('.contenedor-productos');

    // Limpia el contenedor de productos antes de agregar nuevos
    contenedorProductos.innerHTML = '';

    // Itera sobre la lista de productos
    // Itera sobre la lista de productos
    productos.forEach((producto) => {
        // Crea un nuevo elemento de producto
        const nuevoProducto = document.createElement('div');
        nuevoProducto.classList.add('item');

        // Crea elementos internos del producto
        const contenedorFoto = document.createElement('div');
        contenedorFoto.classList.add('contenedor-foto');

        const nombreProducto = document.createElement('p');
        nombreProducto.classList.add('descripcion');

        // Declaración de precioProducto aquí para evitar el error
        let precioProducto;

        // Agrega los elementos al nuevo producto
        nuevoProducto.appendChild(contenedorFoto);
        nuevoProducto.appendChild(nombreProducto);

        // Verifica si hay un descuento y muestra el precio adecuado
        const precioMostrar = producto.priceDiscountProduct > 0 ? producto.priceDiscountProduct : producto.priceProduct;

        // Asigna precioMostrar a precioProducto aquí
        precioProducto = document.createElement('span');
        precioProducto.classList.add('precio');
        precioProducto.textContent = `$ ${precioMostrar}`;
        nuevoProducto.appendChild(precioProducto);

        const enlaceProducto = document.createElement('a');
        enlaceProducto.href = `descripcion_producto.html?id=${producto.productId}`;
        enlaceProducto.classList.add('agregar-carrito-btn');
        enlaceProducto.textContent = 'Ver descripción';
        nuevoProducto.appendChild(enlaceProducto);

        const carritoProducto = document.createElement('button');
        carritoProducto.classList.add('btn-azul');
        carritoProducto.onclick = function () {
            agregarAlCarrito(producto.productId);
        };
        carritoProducto.textContent = 'Agregar al carrito';
        nuevoProducto.appendChild(carritoProducto);

        // Agrega el nuevo producto al contenedor de productos
        contenedorProductos.appendChild(nuevoProducto);

        // Agrega los elementos al nuevo producto
        nuevoProducto.appendChild(contenedorFoto);
        nuevoProducto.appendChild(nombreProducto);
        nuevoProducto.appendChild(precioProducto);
        nuevoProducto.appendChild(enlaceProducto);
        nuevoProducto.appendChild(carritoProducto);


        // Agrega el nuevo producto al contenedor de productos
        contenedorProductos.appendChild(nuevoProducto);

        // Llena los elementos internos con la información del producto
        // Agrega el nombre del producto al elemento correspondiente
        nombreProducto.textContent = producto.nameProduct;

        // Agrega el precio del producto al elemento correspondiente
        precioProducto.textContent = `$ ${producto.priceProduct}`;

        // Programa el botón "Ver descripción" para redirigir a la página de detalles
        enlaceProducto.onclick = (event) => {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            window.location.href = `descripcion_producto.html?id=${producto.productId}`;
        };

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
    });
}

function obtenerListaProductosBySubcategoria(subcategoriaId) {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    fetch(`http://localhost:8090/fama-market/api/products/findByIdSubcategoria/${subcategoriaId}`, { headers })
        .then((response) => response.json())
        .then((productos) => {
                        console.log("Respuesta del servidor:", productos);
            // Llama a la función para mostrar los productos en la tabla
            mostrarProductos(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
}

function mostrarProductosBySubcategoria(productos) {
    const contenedorProductos = document.querySelector('.contenedor-productos');

    // Limpia el contenedor de productos antes de agregar nuevos
    contenedorProductos.innerHTML = '';

    // Itera sobre la lista de productos
    productos.forEach((producto) => {
        // Crea un nuevo elemento de producto
        const nuevoProducto = document.createElement('div');
        nuevoProducto.classList.add('item');

        // Crea elementos internos del producto
        const contenedorFoto = document.createElement('div');
        contenedorFoto.classList.add('contenedor-foto');

        const nombreProducto = document.createElement('p');
        nombreProducto.classList.add('descripcion');

        const precioProducto = document.createElement('span');
        precioProducto.classList.add('precio');

        const enlaceProducto = document.createElement('a');
        enlaceProducto.href = `descripcion_producto.html?id=${producto.productId}`;
        enlaceProducto.classList.add('agregar-carrito-btn' );
        enlaceProducto.textContent = 'Ver descripción';

        const carritoProducto = document.createElement('button');
        carritoProducto.classList.add('btn-azul');
        carritoProducto.onclick = function() {
            agregarAlCarrito(producto.productId);
        };
        carritoProducto.textContent = 'Agregar al carrito';

        // Agrega los elementos al nuevo producto
        nuevoProducto.appendChild(contenedorFoto);
        nuevoProducto.appendChild(nombreProducto);
        nuevoProducto.appendChild(precioProducto);
        nuevoProducto.appendChild(enlaceProducto);
        nuevoProducto.appendChild(carritoProducto);

        // Agrega el nuevo producto al contenedor de productos
        contenedorProductos.appendChild(nuevoProducto);

        // Llena los elementos internos con la información del producto
        // Agrega el nombre del producto al elemento correspondiente
        nombreProducto.textContent = producto.nameProduct;

        // Agrega el precio del producto al elemento correspondiente
        precioProducto.textContent = `$ ${producto.priceProduct}`;

        // Programa el botón "Ver descripción" para redirigir a la página de detalles
        enlaceProducto.onclick = (event) => {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            window.location.href = `descripcion_producto.html?id=${producto.productId}`;
        };

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
    });
}

function obtenerListaProductosByCategoria(categoriaId) { 
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    fetch(`http://localhost:8090/fama-market/api/products/findBySubcategoriaIdCategoria/${categoriaId}`, { headers })
        .then((response) => response.json())
        .then((productos) => {
            console.log("Respuesta del servidor:", productos);
            // Llama a la función para mostrar los productos en la tabla
            mostrarProductos(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
}

function mostrarProductosByCategoria(productos) {
    const contenedorProductos = document.querySelector('.contenedor-productos');

    // Limpia el contenedor de productos antes de agregar nuevos
    contenedorProductos.innerHTML = '';

    // Itera sobre la lista de productos
    if (Array.isArray(productos)) {
        productos.forEach((producto) => {
            // Crea un nuevo elemento de producto
            const nuevoProducto = document.createElement('div');
            nuevoProducto.classList.add('item');

            // Crea elementos internos del producto
            const contenedorFoto = document.createElement('div');
            contenedorFoto.classList.add('contenedor-foto');

            const nombreProducto = document.createElement('p');
            nombreProducto.classList.add('descripcion');

            const precioProducto = document.createElement('span');
            precioProducto.classList.add('precio');

            const enlaceProducto = document.createElement('a');
            enlaceProducto.href = `descripcion_producto.html?id=${producto.productId}`;
            enlaceProducto.classList.add('agregar-carrito-btn' );
            enlaceProducto.textContent = 'Ver descripción';

            const carritoProducto = document.createElement('button');
            carritoProducto.classList.add('btn-azul');
            carritoProducto.onclick = function() {
                agregarAlCarrito(producto.productId);
            };
            carritoProducto.textContent = 'Agregar al carrito';

            // Agrega los elementos al nuevo producto
            nuevoProducto.appendChild(contenedorFoto);
            nuevoProducto.appendChild(nombreProducto);
            nuevoProducto.appendChild(precioProducto);
            nuevoProducto.appendChild(enlaceProducto);
            nuevoProducto.appendChild(carritoProducto);

            // Agrega el nuevo producto al contenedor de productos
            contenedorProductos.appendChild(nuevoProducto);

            // Llena los elementos internos con la información del producto
            // Agrega el nombre del producto al elemento correspondiente
            nombreProducto.textContent = producto.nameProduct;

            // Agrega el precio del producto al elemento correspondiente
            precioProducto.textContent = `$ ${producto.priceProduct}`;

            // Programa el botón "Ver descripción" para redirigir a la página de detalles
            enlaceProducto.onclick = (event) => {
                event.preventDefault(); // Evita el comportamiento predeterminado del enlace
                window.location.href = `descripcion_producto.html?id=${producto.productId}`;
            };

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
        });
    }   
}


cargarProductos();



function actualizarInformacionProducto(idProducto, producto) {
    const elementoProducto = document.getElementById(idProducto);

    if (elementoProducto) {
        const contenedorFoto = elementoProducto.querySelector('.contenedor-foto');
        const nombreProducto = elementoProducto.querySelector('.descripcion');
        const precioProducto = elementoProducto.querySelector('.precio');

        contenedorFoto.innerHTML = ''; // Limpiar el contenedor de fotos antes de agregar nuevas imágenes

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

        nombreProducto.textContent = producto.nameProduct;
        precioProducto.textContent = `$ ${producto.priceProduct}`;
    }
}
