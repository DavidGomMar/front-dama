// Obtener el ID del producto de los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// Verificar si se proporcionó un ID válido
if (!productId) {
    console.error("No se proporcionó un ID de producto válido en la URL");
} else {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
    } else {
        const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        });

        fetch(`http://localhost:8090/fama-market/api/products/${productId}`, {
            method: 'GET',
            headers: headers,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then((producto) => {
                // Aquí puedes usar la información del producto para actualizar la página
                mostrarInformacionDetalleProducto(producto);

                // Llena el carrusel con las imágenes del producto
                const carouselElemento = document.querySelector('.carousel-inner');
                if (carouselElemento && producto.imagens && producto.imagens.length > 0) {
                    producto.imagens.forEach((imagen, index) => {
                        const carouselItemElemento = document.createElement('div');
                        carouselItemElemento.classList.add('carousel-item');
                        carouselItemElemento.classList.toggle('active', index === 0);

                        const imgElemento = document.createElement('img');
                        imgElemento.src = "data:image/jpeg;base64," + imagen.imageRoute;
                        imgElemento.alt = `Imagen ${imagen.imageId}`;

                        // Agrega la imagen al elemento del carrusel
                        carouselItemElemento.appendChild(imgElemento);
                        carouselElemento.appendChild(carouselItemElemento);
                    });
                }
            })
            .catch((error) => {
                console.error("Error al obtener la información detallada del producto:", error);
            });
    }
}

function mostrarInformacionDetalleProducto(producto) {
    // Actualiza la página con la información del producto
    const nombreProductoElemento = document.getElementById('nameProduct');
    const precioProductoElemento = document.getElementById('priceProduct');
    const amountProductElemento = document.getElementById('amountProduct');
    const nameBrandElemento = document.getElementById('nameBrand');

    if (nombreProductoElemento && precioProductoElemento && amountProductElemento && nameBrandElemento) {
        // Llena elementos HTML con la información del producto
        nombreProductoElemento.textContent = producto.nameProduct;
        precioProductoElemento.textContent = `$ ${producto.priceProduct}`;
        amountProductElemento.value = producto.amountProduct; // Suponiendo que 'amountProduct' es un número
        nameBrandElemento.textContent = producto.subbrand.brand.nameBrand; // Ajusta según la estructura real de tu JSON
    }
}
