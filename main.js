console.log("Hello");






const navlinks = document.querySelector("nav");
const toggleMenu = () => navlinks.style.display = navlinks.style.display === "none" ? "flex" : "none";

document.addEventListener("DOMContentLoaded", () => {
    navlinks.style.display = "none";
});


document.addEventListener("DOMContentLoaded", () => {
    navlinks.style.display = window.innerWidth > 600 ? "flex" : "none";
});

window.addEventListener("resize", () => {
    navlinks.style.display = window.innerWidth > 600 ? "flex" : "none";
});