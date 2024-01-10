function agregarAlCarrito(productId) {
    var usuarioIniciadoSesion = true; // Aquí deberías implementar tu lógica real

    if (usuarioIniciadoSesion) {
        alert("Producto agregado al carrito");

        const token = sessionStorage.getItem('jwt');
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        fetch("https://back-david.azurewebsites.net/fama-market/api/users/email/" + sessionStorage.getItem("email"), { headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no fue exitosa: ' + response.status);
                }
                return response.json();
            })
            .then(usuario => {
                const dataOrder = {
                    "orderId": 0,
                    "userId": usuario.userId,
                    "orderProduct": {
                        "productOrderId": 0,
                        "orderId": 0,
                        "productId": productId
                    }
                };

                fetch("https://back-david.azurewebsites.net/fama-market/api/pedido/agregarProducto", {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(dataOrder)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('La solicitud no fue exitosa: ' + response.status);
                        }
                        if (response.status === 204) {
                            // Respuesta vacía, manejar según sea necesario
                            console.log('El servidor devolvió una respuesta vacía.');
                            return null;
                        }
                        return response.json();
                    })
                    .then(resultado => {
                        console.log('Producto agregado al carrito:', resultado);
                    })
                    .catch(error => {
                        if (error.name === 'SyntaxError') {
                            console.error('Error de análisis JSON:', error.message);
                        } else {
                            console.error('Error al agregar producto al carrito:', error);
                        }
                    });
            })
            .catch(error => {
                console.error('Error al obtener el usuario:', error);
            });
    } else {
        window.location.href = "/login.html";
    }
}