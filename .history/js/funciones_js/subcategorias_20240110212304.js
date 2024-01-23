$(function () {
    obtenerListaSubcategorias();
    
});

// Función para obtener y mostrar la lista de subcategorías
function obtenerListaSubcategorias() {

        // Obtener el token desde sessionStoreNg
        const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
        console.log(token);
        // Verificar si se encontró un token
        if (!token) {
            console.error('No se encontró un token en sessionStoreNg');
            return;
        }
    
        // Configurar los encabezados con el token
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });


        fetch("http://localhost:8090/fama-market/api/subcategories/all", { headers })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((subcategorias) => {
            // Obtener la referencia de la tabla
            var tablaSubcategorias = document.getElementById('tablaSubcategorias').getElementsByTagName('tbody')[0];

            // Limpiar filas existentes (si las hay)
            tablaSubcategorias.innerHTML = '';

            // Iterar sobre las subcategorías y agregar filas a la tabla
            subcategorias.forEach((subcategoria) => {
                var fila = tablaSubcategorias.insertRow();

                // Ajustar las siguientes líneas según la estructura de tu JSON
                var celda1 = fila.insertCell(0);
                celda1.textContent = subcategoria.subCategoryId;

                var celda2 = fila.insertCell(1);
                celda2.textContent = subcategoria.nameSubCategory;

                var celda3 = fila.insertCell(2);
                // Acceder a la categoría asociada a través de la propiedad 'category'
                if (subcategoria.category) {
                    celda3.textContent = subcategoria.category.nameCategory;
                } else {
                    celda3.textContent = 'N/A'; // O cualquier valor por defecto si no hay una categoría asociada
                }

                var celda4 = fila.insertCell(3);
                // Puedes personalizar la columna de acciones según tus necesidades
                celda4.innerHTML = `
                    <button type="button" class="btn btn-eliminar btn-sm" data-bs-toggle="modal"
                        data-bs-target="#modalEliminarSubcategorias" onclick="mostrarModalEliminarSubcategoria(${subcategoria.subCategoryId})">
                        Eliminar
                    </button>
                `;
            });
        })
        .catch((error) => {
            console.error('Error al obtener la lista de subcategorías:', error);
        });
}

// Función para mostrar el modal de eliminación de subcategorías
function mostrarModalEliminarSubcategoria(idSubcategoria) {
    // Guardar el ID de la subcategoría que se eliminará
    subcategoriaIdAEliminar = idSubcategoria;

    // Mostrar el modal
    $('#modalEliminarSubcategorias').modal('show');
}

// Función para eliminar la subcategoría y actualizar la tabla
function eliminarSubcategoria() {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    // Realizar la solicitud DELETE usando Fetch
    fetch(`http://localhost:8090/fama-market/api/subcategories/delete/${subcategoriaIdAEliminar}`, {
        method: 'DELETE',
        headers: headers
    })
    .then(response => {
        if (response.ok) {
            console.log('Subcategoría eliminada exitosamente.');

            // Actualizar la tabla después de eliminar la subcategoría
            obtenerListaSubcategorias();

            // Cerrar el modal
            $('#modalEliminarSubcategorias').modal('hide');
        } else {
            console.error('Error al eliminar subcategoría:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error al eliminar subcategoría:', error);
        // Puedes manejar el error de alguna manera, como mostrar un mensaje al usuario
    });
}

function filtrarTabla() {
    // Obtener el valor del buscador
    var input = document.getElementById('buscadorInput');
    var filtro = input.value.toUpperCase();

    // Obtener la tabla y las filas
    var tabla = document.getElementById('tablaSubcategorias');
    var filas = tabla.getElementsByTagName('tr');

    // Iterar sobre las filas y mostrar u ocultar según el filtro
    for (var i = 0; i < filas.length; i++) {
        var celdaNombre = filas[i].getElementsByTagName('td')[1]; // Ajusta el índice según tu estructura de la tabla
        if (celdaNombre) {
            var textoCelda = celdaNombre.textContent || celdaNombre.innerText;
            if (textoCelda.toUpperCase().indexOf(filtro) > -1) {
                filas[i].style.display = '';
            } else {
                filas[i].style.display = 'none';
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', function () {
    cargarCategoriasEnCombobox();
});

function cargarCategoriasEnCombobox() {
     // Obtener el token desde sessionStoreNg
     const token = sessionStorage.getItem('jwt'); // Nombre del token en sessionStoreNg
    console.log(token);
     // Verificar si se encontró un token
    if (!token) {
        console.error('No se encontró un token en sessionStoreNg');
        return;
    }

     // Configurar los encabezados con el token
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
    // Obtener el combobox de categorías
    var categoriasSelect = document.getElementById('categoriasSelect');

    // Realizar una solicitud para obtener la lista de categorías desde tu API
    fetch('http://localhost:8090/fama-market/api/categories/all',{headers})
        .then(response => response.json())
        .then(categorias => {
            // Limpiar las opciones actuales del combobox
            categoriasSelect.innerHTML = '';

            // Agregar cada categoría como una opción en el combobox
            categorias.forEach(categoria => {
                var opcion = document.createElement('option');
                opcion.value = categoria.categoryId;
                opcion.textContent = categoria.nameCategory;
                categoriasSelect.appendChild(opcion);
            });
        })
        .catch(error => {
            console.error('Error al obtener las categorías:', error);
        });
}


function guardarSubcategorias() {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Obtener el valor del nombre de la subcategoría desde el formulario
    var nombreSubcategoria = document.getElementById('subcategoriaInput').value;

    // Obtener el valor de la categoría seleccionada en el combobox
    var categoriaSeleccionada = document.getElementById('categoriasSelect').value;

    // Construir el objeto de datos para enviar en la solicitud
    var data = {
        nameSubCategory: nombreSubcategoria,
        categoryId: categoriaSeleccionada
        // Agrega más campos según la estructura de tu API
    };

    // Realizar la solicitud POST usando Fetch
    fetch('http://localhost:8090/fama-market/api/subcategories/save', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resultado => {
        console.log('Subcategoría agregada exitosamente:', resultado);
        // Actualizar la tabla después de agregar la subcategoría
        actualizarTablaSubcategorias();

        // Puedes realizar otras acciones aquí, como cerrar el modal
        // ...

        // Cerrar el modal
        $('#modalSubcategorias').modal('hide');
    })
    .catch(error => {
        console.error('Error al agregar subcategoría:', error);
        // Puedes manejar el error de alguna manera, como mostrar un mensaje al usuario
    });
}

function actualizarTablaSubcategorias() {
    const token = sessionStorage.getItem("jwt");

    if (!token) {
        console.error("No se encontró un token en sessionStoreNg");
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Obtener la referencia de la tabla
    var tablaSubcategorias = document.getElementById('tablaSubcategorias');

    // Realizar una solicitud para obtener la lista actualizada de subcategorías desde tu API
    fetch('http://localhost:8090/fama-market/api/subcategories/all', {headers})
        .then(response => response.json())
        .then(subcategorias => {
            // Limpiar las filas actuales de la tabla
            while (tablaSubcategorias.rows.length > 1) {
                tablaSubcategorias.deleteRow(1);
            }

            // Agregar las nuevas filas con las subcategorías actualizadas
            subcategorias.forEach(subcategoria => {
                var fila = tablaSubcategorias.insertRow(-1);

                // Ajusta los índices según la estructura de tu objeto subcategoría
                var celdaId = fila.insertCell(0);
                var celdaNombre = fila.insertCell(1);
                var celdaCategoria = fila.insertCell(2);
                var celdaAcciones = fila.insertCell(3);

                celdaId.textContent = subcategoria.subCategoryId;
                celdaNombre.textContent = subcategoria.nameSubCategory;
                celdaCategoria.textContent = subcategoria.category.nameCategory;

                // Agrega los botones de editar y eliminar según sea necesario
                var btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'btn btn-editar btn-sm';
                btnEditar.setAttribute('data-bs-toggle', 'modal');
                btnEditar.setAttribute('data-bs-target', '#modalEditarSubcategorias');
                celdaAcciones.appendChild(btnEditar);

                var btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.className = 'btn btn-eliminar btn-sm';
                btnEliminar.setAttribute('data-bs-toggle', 'modal');
                btnEliminar.setAttribute('data-bs-target', '#modalEliminarSubcategorias');
                celdaAcciones.appendChild(btnEliminar);
            });
        })
        .catch(error => {
            console.error('Error al obtener las subcategorías:', error);
        });
}

