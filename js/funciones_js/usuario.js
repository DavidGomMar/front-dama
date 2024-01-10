
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el token de sesión almacenado
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStorage.");
        // Puedes redirigir al usuario a la página de inicio de sesión o manejar de otra manera.
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });


            // Recuperar el ID del usuario
            fetch("http://localhost:8090/fama-market/api/users/email/" + sessionStorage.getItem("email"), { headers })
                .then((response) => response.json())
                .then((usuario) => {

                    fetch(`http://localhost:8090/fama-market/api/directions/direccion/user/${usuario.userId}`, { headers })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Error en la solicitud: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then((datosDireccion) => {
                        // Mostrar los datos de dirección en la consola
                        console.log("Datos de Dirección:", datosDireccion);
                
                        // Llamar a la función para mostrar la información de dirección en el HTML
                        mostrarInformacionDireccion(datosDireccion); // Nota: asumiendo que las direcciones están dentro de la propiedad "directions"
                        agregarDireccionesAlCombobox(datosDireccion);
                    })
                    .catch((error) => {
                        console.error("Error al obtener los datos de dirección:", error);
                        // Puedes mostrar un mensaje de error al usuario o manejar de otra manera.
                    });
                


                    // Hacer una solicitud para obtener la lista de colonias desde la API
                    fetch(`http://localhost:8090/fama-market/api/colonies/all`, { headers })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Error en la solicitud: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then((colonias) => {
                            // Mostrar las colonias en el combo
                            mostrarColoniasEnCombo(colonias);
                        })
                        .catch((error) => {
                            console.error("Error al obtener la lista de colonias:", error);
                            // Puedes mostrar un mensaje de error al usuario o manejar de otra manera.
                        });


            // Hacer una solicitud para obtener los datos del usuario desde la API
            fetch(`http://localhost:8090/fama-market/api/users/${usuario.userId}`, { headers })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((datosUsuario) => {
                    // Mostrar los datos del usuario en la consola
                    console.log("Datos del Usuario:", datosUsuario);

                    // Llamar a la función para mostrar la información del usuario en el HTML
                    mostrarInformacionUsuario(datosUsuario);
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del usuario:", error);
                    // Puedes mostrar un mensaje de error al usuario o manejar de otra manera.
                });
        })
        .catch((error) => {
            console.error("Error al obtener el ID de usuario:", error);
            // Puedes mostrar un mensaje de error al usuario o manejar de otra manera.
        });
});

function mostrarInformacionUsuario(usuario) {
    // Actualizar los elementos HTML con los datos del usuario
    document.getElementById("personName").textContent = usuario.person.personName;
    document.getElementById("lastName").textContent = usuario.person.lastName;
    document.getElementById("secondLastName").textContent = usuario.person.secondLastName;
    document.getElementById("personPhone").textContent = usuario.person.personPhone;
    document.getElementById("userEmail").textContent = usuario.userEmail;
    document.getElementById("userName").textContent = usuario.userName;
    // Puedes agregar más actualizaciones según sea necesario
}

function mostrarInformacionDireccion(datosUsuario){
    
}
// Función para agregar una dirección al contenedor
function agregarDireccionAlContenedor(container, direccion) {
    // Crear elementos HTML para cada dirección
    const direccionItem = document.createElement("div");
    direccionItem.classList.add("row");
    direccionItem.innerHTML = `
        <div class="col-md-6">
            <section class="seccion-perfil-usuario seccion-perfil-direccion">
                <div class="perfil-usuario-body">
                    <div class="perfil-usuario-footer">
                        <ul class="lista-datos">
                            <li><i class="icono fas fa-map-signs"></i> Direccion de usuario:</li>
                            <li><strong>Calle:</strong> <span>${direccion.directionStreet || ""}</span></li>
                            <li><strong>No. Int:</strong> <span>${direccion.noIntDirection || ""}</span></li>
                            <li><strong>No. Ext:</strong> <span>${direccion.noExtDirection || ""}</span></li>
                            <li><strong>C.P.:</strong> <span>${direccion.directionCP || ""}</span></li>
                            <li><strong>Referencia:</strong> <span>${direccion.directionReference || ""}</span></li>
                            <li><strong>Colonia:</strong> <span>${direccion.colonies.nameColony || ""}</span></li>
                        </ul>
                        <!-- Agregar un botón más pequeño en altura para abrir el modal de edición -->
                        <button type="button" class="btn btn-danger btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalEliminarDireccion">
                            Eliminar
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `;

    // Agregar el contenedor de dirección al contenedor principal
    container.appendChild(direccionItem);
}

// Función para mostrar las colonias en el combo
function mostrarColoniasEnCombo(colonias) {
    const coloniaSelect = document.getElementById("colonia");

    // Limpiar opciones existentes
    coloniaSelect.innerHTML = "";

    // Crear opciones y agregarlas al combo
    colonias.forEach((colonia) => {
        const option = document.createElement("option");
        option.value = colonia.colonyId;
        option.text = colonia.nameColony;
        coloniaSelect.appendChild(option);
    });
}

// Función para mostrar la información de dirección en el HTML
function mostrarInformacionDireccion(direcciones) {
    // Obtener el contenedor donde se mostrarán las direcciones
    const contenedorDirecciones = document.getElementById("contenedorDirecciones");

    // Limpiar el contenido existente
    contenedorDirecciones.innerHTML = "";

    // Verificar si hay direcciones
    if (direcciones && direcciones.length > 0) {
        // Iterar sobre las direcciones y agregar cada una al contenedor
        direcciones.forEach((direccion) => {
            // Crear elementos HTML para cada dirección
            const direccionItem = document.createElement("div");
            direccionItem.classList.add("col-md-12", "mx-6"); // Ajusta las clases según tus necesidades
            direccionItem.innerHTML = `
                <section class="seccion-perfil-usuario seccion-perfil-direccion">
                    <div class="perfil-usuario-body">
                        <div class="perfil-usuario-footer m-lg-auto col-12" id="contenedorDirecciones">
                            <ul class="lista-datos">
                                <li><i class="icono fas fa-map-signs"></i> Direccion de usuario:</li>
                                <li><strong>Calle:</strong> <span>${direccion.directionStreet || ""}</span></li>
                                <li><strong>No. Int:</strong> <span>${direccion.noIntDirection || ""}</span></li>
                                <li><strong>No. Ext:</strong> <span>${direccion.noExtDirection || ""}</span></li>
                                <li><strong>C.P.:</strong> <span>${direccion.directionCP || ""}</span></li>
                                <li><strong>Referencia:</strong> <span>${direccion.directionReference || ""}</span></li>
                                <li><strong>Colonia:</strong> <span>${direccion.colonies.nameColony || ""}</span></li>
                            </ul>
                        </div>
                        <!-- Agregar un botón más pequeño en altura para abrir el modal de edición -->
                            <button type="button" class="btn btn-danger btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalEliminarDireccion">
                                Eliminar
                            </button>
                    </div>
                </section>
            `;

            // Agregar el contenedor de dirección al contenedor principal
            contenedorDirecciones.appendChild(direccionItem);
            console.log("Ancho del contenedorDirecciones:", contenedorDirecciones.offsetWidth);

        });
    } else {
        // Mostrar un mensaje si no hay direcciones
        contenedorDirecciones.innerHTML = "<p>No hay direcciones registradas para este usuario.</p>";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Obtener el token de sesión almacenado
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStorage.");
        // Puedes redirigir al usuario a la página de inicio de sesión o manejar de otra manera.
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    // Función para obtener el userId
    function obtenerUserId() {
        return fetch("http://localhost:8090/fama-market/api/users/email/" + sessionStorage.getItem("email"), { headers })
            .then((response) => response.json())
            .then((usuario) => {
                // Mostrar el ID del usuario en la consola (puedes quitar esta línea después de verificar)
                console.log("ID del Usuario:", usuario.userId);
                return usuario.userId;
            })
            .catch((error) => {
                console.error("Error al obtener el ID de usuario:", error);
                // Puedes mostrar un mensaje de error al usuario o manejar de otra manera.
                throw error;
            });
    }

    function agregarDireccion() {
        // Obtener los valores del formulario
        const calle = document.getElementById("calle").value;
        const noInt = document.getElementById("noInt").value;
        const noExt = document.getElementById("noExt").value;
        const cp = document.getElementById("cp").value;
        const referencia = document.getElementById("referencia").value;
        const colonia = document.getElementById("colonia").value;
    
        // Validar que todos los campos estén llenos
        if (!calle || !noInt || !noExt || !cp || !referencia || !colonia) {
            alert("Todos los campos son obligatorios");
            return;
        }
    
        // Obtener el userId
        obtenerUserId()
            .then((userId) => {
                // Crear el objeto de dirección
                const dataDireccion = {
                    "directionStreet": calle,
                    "noIntDirection": noInt,
                    "noExtDirection": noExt,
                    "directionCP": cp,
                    "directionReference": referencia,
                    "colonyId": colonia,
                    "userId": userId,
                };
    
                // Realizar la solicitud para guardar la dirección
                return fetch("http://localhost:8090/fama-market/api/directions/save", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(dataDireccion),
                });
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then((direccionGuardada) => {
                // Aquí puedes agregar lógica adicional después de guardar la dirección
                console.log("Dirección guardada:", direccionGuardada);
    
                // Cerrar el modal después de agregar la dirección
                $("#modalAgregarDireccion").modal("hide");
    
                // Puedes realizar acciones adicionales después de agregar la dirección si es necesario
            })
            .catch((error) => {
                console.error("Error al guardar la dirección:", error);
                // Puedes mostrar un mensaje de error al usuario o manejar de otra manera.
            });
    }
    
    // Agregar el evento click al botón de agregar dirección usando el identificador
    document.getElementById("btnAgregarDireccion").addEventListener("click", agregarDireccion);

});


