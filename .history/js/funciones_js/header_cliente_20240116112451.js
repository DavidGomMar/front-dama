document.addEventListener("DOMContentLoaded", function () {
    // Verifica si hay un usuario en sessionStorage
    const usuarioLogeado = sessionStorage.getItem("usuario");

    // Obtén la referencia al elemento del menú
    const navbarNav = document.getElementById("navbarNav");

    if (usuarioLogeado) {
        navbarNav.style.display = "none";
    } else {
        navbarNav.style.display = "block";
    }

    const familiasMenu = document.getElementById("familiasMenu");
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

    // Hacer la solicitud a la API
    fetch("http://localhost:8090/fama-market/api/subcategories/all", {headers})
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Datos recibidos de la API:", data);

            const familiasMap = new Map();

            // Agrupar subcategorías por familias y categorías
            data.forEach((subcategoria) => {
                const familiaName = subcategoria.category.family.nameFamily;
                const categoriaName = subcategoria.category.nameCategory;
                const subcategoriaName = subcategoria.nameSubCategory;

                if (!familiasMap.has(familiaName)) {
                    familiasMap.set(familiaName, new Map());
                }

                const categoriasMap = familiasMap.get(familiaName);

                if (!categoriasMap.has(categoriaName)) {
                    categoriasMap.set(categoriaName, []);
                }

                const subcategoriasArray = categoriasMap.get(categoriaName);
                subcategoriasArray.push(subcategoriaName);
            });

            // Construir el menú
            familiasMap.forEach((categoriasMap, familiaName) => {
                const familiaItem = document.createElement("li");
                familiaItem.innerHTML = `<a href="#">${familiaName}</a>`;
                // Ajustar el ancho del menú de las familias (ajusta el valor según tus necesidades)
                familiaItem.style.width = "300px";

                const categoriasList = document.createElement("ul");

                categoriasMap.forEach((subcategoriasArray, categoriaName) => {
                    const categoriaItem = document.createElement("li");
                    categoriaItem.innerHTML = `<a href="Views/productos.html">${categoriaName}</a>`;

                    if (subcategoriasArray.length > 0) {
                        const subcategoriasList = document.createElement("ul");

                        // Ajustar el ancho del submenú (ajusta el valor según tus necesidades)
                        subcategoriasList.style.width = "400px";

                        subcategoriasArray.forEach((subcategoriaName) => {
                            const subcategoriaItem = document.createElement("li");
                            // Añadir el ID de la subcategoría como parámetro en la URL
                            subcategoriaItem.innerHTML = `<a href="Views/productos.html">${subcategoriaName}</a>`;
                            subcategoriasList.appendChild(subcategoriaItem);
                        });

                        categoriaItem.appendChild(subcategoriasList);
                    }

                    categoriasList.appendChild(categoriaItem);
                });

                familiaItem.appendChild(categoriasList);
                familiasMenu.appendChild(familiaItem);
            });

            // Agregar eventos para mostrar/ocultar submenús al pasar el ratón
            const menuItems = document.querySelectorAll(".nav > li");
            menuItems.forEach((item) => {
                item.addEventListener("mouseover", function () {
                    const submenu = this.querySelector("ul");
                    if (submenu) {
                        const rect = submenu.getBoundingClientRect();
                        const viewportHeight =
                            window.innerHeight || document.documentElement.clientHeight;
                        const shouldFlip = rect.bottom > viewportHeight;

                        if (shouldFlip) {
                            submenu.style.top = "auto";
                            submenu.style.bottom = "100%";
                        } else {
                            submenu.style.top = "100%";
                            submenu.style.bottom = "auto";
                        }

                        submenu.style.display = "block";
                    }
                });

                item.addEventListener("mouseout", function () {
                    const submenu = this.querySelector("ul");
                    if (submenu) {
                        submenu.style.display = "none";
                    }
                });
                // Agregar evento para redirigir a productos al hacer clic en la subcategoría
                const subcategoriaEnlace = item.querySelector("ul > li > ul > li > a");
                if (subcategoriaEnlace) {
                    const subcategoriaId = subcategoriaEnlace.getAttribute(
                        "data-subcategoria-id"
                    );
                    subcategoriaEnlace.addEventListener("click", function (event) {
                        event.preventDefault();
                        redirigirAProductosPorSubcategoria(subcategoriaId);
                    });
                }
            });
        })
        .catch((error) =>
            console.error("Error al obtener datos desde la API:", error)
        );

    // Obtiene el ancho del primer submenú
    var primerSubmenuAncho = $("#familiasMenu > li > ul").first().width();

    // Aplica el ancho a todos los submenús
    $("#familiasMenu > li > ul").width(primerSubmenuAncho);
});

function redirigirAProductosPorSubcategoria(subcategoriaId) {
    // Construye la URL con el ID de la subcategoría
    const apiUrl = `http://localhost:8090/fama-market/api/products/findBySubcategoriaIdCategoria/${subcategoriaId}`;

    // Realiza la solicitud GET para obtener los productos de la subcategoría
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then((productos) => {
            // Puedes manejar la respuesta de la API y mostrar los productos según tus necesidades
            console.log("Productos de la subcategoría:", productos);
        })
        .catch((error) => {
            console.error("Error al obtener productos de la subcategoría:", error);
        });
}
