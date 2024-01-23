const btn = document.querySelector("#btnSubmit");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const feedback = document.querySelector("#feedback");
const alert = document.querySelector(".alert");
const fields = document.querySelectorAll(".validate");

function validate(errors) {
    fields.forEach(function (field) {
        if (field.value == "") {
            field.classList.add("errorField");
            errors.push(field.id);
        }
    });
}

function showErrorMessage(message) {
    alert.style.display = "block";
    feedback.innerHTML = message;
    setTimeout(function () {
        alert.style.display = "none";
    }, 3000);
}

btn.addEventListener("click", async function (event) {
    let errors = [];
    event.preventDefault();
    alert.style.display = "none";
    feedback.innerHTML = ``;
    validate(errors);

    if (errors.length > 0) {
        showErrorMessage(`Los campos ${errors.toString()} no pueden estar vacíos`);
        return false;
    }

    const data = {
        username: username.value,
        password: password.value,
    };

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        console.log("Datos a enviar:", JSON.stringify(data));
        const response = await fetch("http://localhost:8090/fama-market/api/auth/login", options);
        console.log("Respuesta del servidor:", response);

        if (!response.ok) {
            console.error("Error en la solicitud:", response.status);
            // Puedes agregar más detalles de error según sea necesario
            return false;
        }

        const jsonResponse = await response.json();
        const authorizationToken = jsonResponse.jwt;

        sessionStorage.setItem("jwt", authorizationToken);
        sessionStorage.setItem("email", jsonResponse.email);
        sessionStorage.setItem("profile", jsonResponse.perfil); 
        // Redirigir según el perfil
        // Redirigir según el perfil
        if (jsonResponse.profile == 1) {
            // Perfil de usuario, redirigir al index normal
            window.location = "./../index.html";
        } else if (jsonResponse.profile == 2) {
            // Perfil de administrador, redirigir al index_admin
            window.location = "./../index_admin.html";
        } else {
            // Otro perfil, manejar según sea necesario
            console.error("Perfil no reconocido");
            // Puedes redirigir a una página por defecto o mostrar un mensaje de error
        }
    } catch (error) {
        console.error("Error al procesar la respuesta:", error);
        // Puedes manejar el error de manera específica aquí
        showErrorMessage("Error al procesar la respuesta del servidor");
    }
});

fields.forEach(function (field) {
    field.addEventListener("keyup", function () {
        field.classList.remove("errorField");
    });
});
