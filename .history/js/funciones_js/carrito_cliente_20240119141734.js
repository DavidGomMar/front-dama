document.addEventListener("DOMContentLoaded", function () {
    // Obtener todos los elementos con la clase "quantity-btn"
    const quantityButtons = document.querySelectorAll(".quantity-btn");

    // Iterar sobre cada botón
    quantityButtons.forEach(function (button) {
        // Agregar un evento de clic a cada botón
        button.addEventListener("click", function () {
            // Obtener el elemento padre del botón (cart-item)
            const cartItem = this.closest(".cart-item");

            if (cartItem) {
                // Obtener el elemento de cantidad dentro del cart-item
                const quantityElement = cartItem.querySelector(".quantity");

                if (quantityElement) {
                    // Obtener la cantidad actual
                    let currentQuantity = parseInt(quantityElement.textContent);

                    // Incrementar o decrementar la cantidad según el botón presionado
                    if (this.classList.contains("increment-btn")) {
                        currentQuantity++;
                    } else if (this.classList.contains("decrement-btn") && currentQuantity > 1) {
                        currentQuantity--;
                    }

                    // Actualizar la cantidad en el elemento de cantidad
                    quantityElement.textContent = currentQuantity;
                }
            }
        });
    });

    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        // Podrías redirigir al usuario a la página de inicio de sesión
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });





    // Obtener el ID del usuario y realizar otras operaciones después de obtenerlo
    fetch("http://localhost:8090/fama-market/api/users/email/" + sessionStorage.getItem("email"), {headers})
        .then((response) => response.json())
        .then((usuario) => {
            // Obtener el ID del usuario
            const userId = usuario.userId;

            // Crear el objeto de pedido
            const dataOrder = {
                "orderId": 0,
                "userId": userId,
                "orderProduct": {
                    "productOrderId": 0,
                    "orderId": 0,
                }
            };

            // Si se obtuvo el ID del usuario, obtener y mostrar el carrito
            if (userId) {
                obtenerCarritoCliente(userId);
            } else {
                console.error("No se pudo obtener el ID de usuario.");
            }
        })
        .catch((error) => {
            console.error("Error al obtener el ID de usuario:", error);
        });
});

// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(productId) {
    // Realizar la llamada a la API para eliminar el producto del carrito
    fetch(`http://localhost:8090/fama-market/api/pedido_producto/delete/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto eliminado exitosamente:', data);

        // Volver a cargar y mostrar el carrito después de eliminar el producto
        const userId = obtenerIdUsuario();
        obtenerCarritoCliente(userId);
    })
    .catch(error => {
        console.error('Error al eliminar el producto:', error);
        // Puedes mostrar un mensaje de error al usuario
    });
}


function obtenerCarritoCliente(userId) {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        // Podrías redirigir al usuario a la página de inicio de sesión
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    fetch(`http://localhost:8090/fama-market/api/pedido_producto/carrito/${userId}`, { headers })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .then((productos) => {
            // Llama a la función para mostrar los productos en la tabla
            mostrarProductos(productos);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
            // Puedes mostrar un mensaje de error al usuario
        });
}

let totalAmount = 0;

function mostrarProductos(productos) {
    const productosContainer = document.getElementById("productos");

    // Limpiar el contenedor de productos
    productosContainer.innerHTML = "";

    // Iterar sobre los productos y agregarlos al contenedor
    productos.forEach((pedidoProducto, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.setAttribute("data-product-id", pedidoProducto.product.productId);

        const itemInfo = document.createElement("div");
        itemInfo.classList.add("item-info");

        const contenedorFoto = document.createElement("div");
        contenedorFoto.classList.add("contenedor-foto");

        // Agrega las imágenes al contenedor de fotos si existen
        if (pedidoProducto.product.imagens && pedidoProducto.product.imagens.length > 0) {
            pedidoProducto.product.imagens.forEach((imagen) => {
                const img = document.createElement('img');
                img.src = "data:image/jpeg;base64," + imagen.imageRoute;
                img.alt = "Imagen " + imagen.imageId;
                img.className = "imagen-thumbnail";
                img.style.width = "50px"; // Modifica el tamaño según tus necesidades
                img.style.height = "50px";
                contenedorFoto.appendChild(img);
            });
        }

        const details = document.createElement("div");
        details.classList.add("details");

        const h2 = document.createElement("h2");
        h2.textContent = pedidoProducto.product.nameProduct;

        const pPrecio = document.createElement("p");
        pPrecio.textContent = `Precio: $${pedidoProducto.product.priceProduct.toFixed(2)}`;

        const quantitySection = document.createElement("div");
        quantitySection.classList.add("quantity-section");

        

        // Construir la estructura del carrito
        details.appendChild(h2);
        details.appendChild(pPrecio);
        details.appendChild(quantitySection);
        itemInfo.appendChild(contenedorFoto);
        itemInfo.appendChild(details);

        const itemActions = document.createElement("div");
        itemActions.classList.add("item-actions");

        const btnRemove = document.createElement("button");
        btnRemove.classList.add("remove-btn");
        btnRemove.textContent = "Eliminar";
        btnRemove.addEventListener("click", function () {
            // Implementa la lógica para eliminar el producto
        });

        // Construir el elemento completo del carrito
        cartItem.appendChild(itemInfo);
        cartItem.appendChild(itemActions);
        itemActions.appendChild(btnRemove);

        // Agregar el elemento al contenedor de productos
        productosContainer.appendChild(cartItem);

        // Sumar el priceProduct al totalAmount
        totalAmount += pedidoProducto.product.priceProduct;
    });

    // Mostrar el totalAmount en el elemento correspondiente
    const totalPagarElement = document.getElementById("totalpagar");
    totalPagarElement.textContent = `$${totalAmount.toFixed(2)}`;
}


// Obtener el token de sesión almacenado
const token = sessionStorage.getItem("jwt");

if (!token) {
    console.error("No se encontró un token en sessionStorage.");
    // Puedes redirigir al usuario a la página de inicio de sesión o manejar de otra manera.
} else {
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    // Recuperar el ID del usuario
    fetch("http://localhost:8090/fama-market/api/users/email/" + sessionStorage.getItem("email"), { headers })
        .then((response) => response.json())
        .then((usuario) => {
            // Mostrar el ID del usuario en la consola (puedes quitar esta línea después de verificar)
            console.log("ID del Usuario:", usuario.userId);

            // Hacer una solicitud para obtener las direcciones del usuario desde la API
            fetch(`http://localhost:8090/fama-market/api/directions/direccion/user/${usuario.userId}`, { headers })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((direcciones) => {
                    // Mostrar las direcciones en el combobox
                    agregarDireccionesAlCombobox(direcciones);
                })
                .catch((error) => {
                    console.error("Error al obtener las direcciones del usuario:", error);
                    // Puedes mostrar un mensaje de error al usuario o manejar de otra manera.
                });
        })
        .catch((error) => {
            console.error("Error al obtener el ID de usuario:", error);
            // Puedes mostrar un mensaje de error al usuario o manejar de otra manera.
        });
}

// Función para agregar direcciones al combobox
function agregarDireccionesAlCombobox(direcciones) {
    // Obtener el elemento select
    const seleccionDireccion = document.getElementById("seleccionDireccion");

    // Limpiar opciones existentes
    seleccionDireccion.innerHTML = "";

    // Agregar cada dirección como una opción al select
    direcciones.forEach((direccion) => {
        const option = document.createElement("option");
        option.value = direccion.directionId; // Puedes establecer el valor según sea necesario
        option.text = `${direccion.directionStreet}, ${direccion.noIntDirection}, ${direccion.noExtDirection}, ${direccion.directionCP}, ${direccion.directionReference}, ${direccion.colonies.nameColony}`;
        seleccionDireccion.appendChild(option);
    });
}

