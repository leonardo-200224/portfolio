function showMenu() {
    var menu = document.getElementsByClassName("barra_navegacion")[0];
    var boton = document.getElementById("bmenu");

    menu.classList.toggle("active");

    if (menu.classList.contains("active")) {
        boton.innerText = "❐";
    } else {
        boton.innerText = "☰";
    }
}