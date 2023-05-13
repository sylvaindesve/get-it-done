import { Router } from "./components/Router";

document.addEventListener("DOMContentLoaded", () => {
  const router = document.getElementById("router");
  if (router && router instanceof Router) {
    router.addRouteListener("/", (route, routerElement) => {
      routerElement.innerHTML = "Home page";
    });
    router.addRouteListener("/register", (route, routerElement) => {
      routerElement.innerHTML = "Register page";
    });
    router.addRouteListener("/login", (route, routerElement) => {
      routerElement.innerHTML = "Login page";
    });
  }
});
