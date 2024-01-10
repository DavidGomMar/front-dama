
    function redirigir() {
    var seleccion = document.getElementById("acciones");
    var opcionSeleccionada = seleccion.options[seleccion.selectedIndex].value;

    // Definir las rutas para cada opción del menú
    var rutas = {
        agregarFamilias: "Views/familias.html#",
        agregarCategorias: "Views/categoria.html",
        agregarSubcategorias: "Views/subcategoria.html",
        agregarMarcas: "Views/marcas.html",
        agregarSubmarcas: "Views/submarcas.html",
        agregarProductos: "Views/productos-crud.html",
    };

    // Redireccionar a la URL correspondiente
    window.location.href = rutas[opcionSeleccionada];
    }
