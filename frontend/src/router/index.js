import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Notes from "../views/Notes.vue";

Vue.use(VueRouter);

function alreadyLoggedIn(to, from, next) {
  if (localStorage.token) next("/notes");
  else next();
}

function isLogged(to, from, next) {
  if (localStorage.token) next();
  else next("/login");
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    beforeEnter: alreadyLoggedIn,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: alreadyLoggedIn,
  },
  {
    path: "/notes",
    name: "notes",
    component: Notes,
    beforeEnter: isLogged,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
