function agregarAlCarrito(productId) {
    // Aquí debes verificar si el usuario ha iniciado sesión
    var usuarioIniciadoSesion = true; // Aquí deberías implementar tu lógica real

    if (usuarioIniciadoSesion) {
        // Si el usuario ha iniciado sesión, puedes agregar el producto al carrito
        alert("Producto agregado al carrito");
        //Contactar a la api /pedido/agregarProducto

        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        console.log(token);

        // Configurar los encabezados con el token
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

                // Recuperar el ID del usuario
                fetch("http://localhost:8090/fama-market/api/users/email/" + sessionStorage.getItem("email"), { headers })
                    .then((response) => response.json())
                    .then((usuario) => {
                        // Crear el objeto de pedido
                        const dataOrder = {
                            "orderId": 0,
                            "userId": usuario.userId,
                            "orderProduct": {
                                    "productOrderId": 0,
                                    "orderId": 0,
                                    "productId": productId
                                }
                        };
                        

                // Realizar la solicitud POST usando Fetch
                fetch("https://back-david.azurewebsites.net/fama-market/api/pedido/agregarProducto", {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(dataOrder) // Ajustado el nombre del objeto a enviar
                })
                    .then(response => response.json())
                    .then(resultado => {
                        console.log('Producto agregado al carrito:', resultado);
                    })
                    .catch(error => {
                        console.error('Error al agregar producto al carrito:', error);
                    });
            })
            .catch((error) => {
                console.error('Error al obtener el usuario:', error);
            });
    } else {
        // Si el usuario no ha iniciado sesión, redirige a la página de inicio de sesión
        window.location.href = "/login.html"; // Reemplaza con la URL real
    }
}

