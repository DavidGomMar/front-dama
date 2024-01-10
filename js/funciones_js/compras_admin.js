obtenerCompras();

function obtenerCompras(){

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

    fetch("https://back-david.azurewebsites.net/fama-market/api/compras/all",{headers})
        .then((response) => response.json())
        .then((compras) => {
            // Llama a la función para mostrar los productos en la tabla
            mostrarComprasEnTabla(compras)
            console.log(compras);
        })
        .catch((error) => {
            console.error("Error al obtener la lista de productos:", error);
        });
        
}

function mostrarComprasEnTabla(compras) {
    const tabla = document.querySelector('.table tbody');

    // Iterar sobre las compras y agregar filas a la tabla
    compras.forEach((compra) => {
        const fila = document.createElement('tr');

        // Ajustar las propiedades según la estructura de tu objeto
        const orderId = compra.order.orderId;
        const nameProduct = compra.order.orderProduct.product.nameProduct;
        const barcodeProduct = compra.order.orderProduct.product.barcodeProduct;
        const userName = compra.order.user.userName;
        const statusName = compra.order.statusOrder.status.statusName;

        fila.innerHTML = `
            <td>${orderId}</td>
            <td>${nameProduct}</td>
            <td>${barcodeProduct}</td>
            <td>${userName}</td>
            <td>${statusName}</td>
            <td>
                <button class="btn btn-primary">Guardar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

