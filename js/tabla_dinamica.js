// scripts.js

// Función para agregar nueva fila de características
function agregarCaracteristica() {
    var tabla = document.getElementById('tablaCaracteristicas').getElementsByTagName('tbody')[0];
    var nuevaFila = tabla.insertRow(tabla.rows.length);
    var celdaNombre = nuevaFila.insertCell(0);
    var celdaDescripcion = nuevaFila.insertCell(1);
    var celdaAccion = nuevaFila.insertCell(2);

    celdaNombre.innerHTML = '<input type="text" class="form-control" name="nombreCaracteristica[]" required>';
    celdaDescripcion.innerHTML = '<input type="text" class="form-control" name="descripcionCaracteristica[]" required>';
    celdaAccion.innerHTML = '<button type="button" class="btn btn-danger" onclick="eliminarFila(this)">Eliminar</button>';
}

// Función para eliminar fila de características
function eliminarFila(boton) {
    var fila = boton.parentNode.parentNode;
    fila.parentNode.removeChild(fila);
}
