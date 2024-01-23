document.addEventListener("DOMContentLoaded", function () {
    // Verifica si hay un usuario en sessionStorage
    const usuarioLogeado = sessionStorage.getItem("usuario");
    console.log("Usuario logeado:", usuarioLogeado);


    const navbarNav = document.getElementById("navbarNav");

    console.log("Antes de la verificación del usuario logeado");
    if (usuarioLogeado) {
        navbarNav.classList.add("d-none");
    } else {
        navbarNav.classList.remove("d-none");
    }


    const familiasMenu = document.getElementById("familiasMenu");
    // Obtener el token desde sessionStoreNg
    const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg

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
    fetch("http://localhost:8090/fama-market/api/subcategories/all", { headers })
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
                subcategoriasArray.push(subcategoria);
            });

            // Construir el menú
            familiasMap.forEach((categoriasMap, familiaName) => {
                const familiaItem = document.createElement("li");
                familiaItem.innerHTML = `<a href="#">${familiaName}</a>`;
                // Ajustar el ancho del menú de las familias (ajusta el valor según tus necesidades)
                familiaItem.style.width = "300px";

                const categoriasList = document.createElement("ul");
                categoriasList.style.height = "400px";

                categoriasMap.forEach((subcategoriasArray, categoriaName) => {
                    const categoriaItem = document.createElement("li");
                    const categoryId = subcategoriasArray.length > 0 ? subcategoriasArray[0].categoryId : null;

                    categoriaItem.innerHTML = `<a href="productos.html?categoriaId=${categoryId}">${categoriaName}</a>`;

                    if (subcategoriasArray.length > 0) {
                        const subcategoriasList = document.createElement("ul");

                        // Ajustar el ancho del submenú (ajusta el valor según tus necesidades)
                        subcategoriasList.style.width = "400px";
                        subcategoriasList.style.height = "450px";

                        subcategoriasArray.forEach((subcategoria) => {
                            const subcategoriaItem = document.createElement("li");
                            const subcategoryId = subcategoria.subCategoryId;
                            // Añadir el ID de la subcategoría como parámetro en la URL
                            subcategoriaItem.innerHTML = `<a href="productos.html?categoriaId=${categoryId}&subcategoriaId=${subcategoryId}">${subcategoria.nameSubCategory}</a>`;
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
                        rJFExu5NouR7CUdQrUbMPjxysaRauzYP5b(subcategoriaId);
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
