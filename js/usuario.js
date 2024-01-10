    document.getElementById("verContraseña").addEventListener("click", function () {
        var contraseñaInput = document.getElementById("contraseña");
        var tipo = contraseñaInput.type === "password" ? "text" : "password";
        contraseñaInput.type = tipo;
    });
