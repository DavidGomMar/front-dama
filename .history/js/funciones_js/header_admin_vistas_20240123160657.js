function redirigir() {
        
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);

    // Verificar si se encontró un token
    if (!token) {
        return;
    }

    // Configurar los encabezados con el token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    var seleccion = document.getElementById("acciones");
var opcionSeleccionada = seleccion.options[seleccion.selectedIndex].value;

// Definir las rutas para cada opción del menú
var rutas = {
    agregarFamilias: "familias.html#",
    agregarCategorias: "categoria.html",
    agregarSubcategorias: "subcategoria.html",
    agregarMarcas: "marcas.html",
    agregarSubmarcas: "submarcas.html",
    agregarProductos: "Views/productos-crud.html",
};

// Redireccionar a la URL correspondiente
window.location.href = rutas[opcionSeleccionada];
}

cerrarSesionButton.addEventListener("click", function () {
    // Eliminar los datos del sessionStorage
    sessionStorage.clear(); // Esto eliminará todos los datos almacenados en sessionStorage
        // Recargar la página
        window.location.href = "index.html";
    console.log("Datos eliminados del sessionStorage");
});