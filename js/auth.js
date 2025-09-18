const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "7041") {
    // Guardar sesión en localStorage
    localStorage.setItem("loggedIn", "true");

    // Redirigir al index
    window.location.href = "index.html";
  } else {
    loginError.style.display = "block";
  }
});
