import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProcessosView from '../views/ProcessosView.vue'
import DocumentosView from '../views/DocumentosView.vue'
import PrazosView from '../views/PrazosView.vue'
import CadastroView from '../views/CadastroView.vue'
import ProfileView from '../views/ProfileView.vue'
import UsuarioView from '../views/UsuarioView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: CadastroView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/documentos',
    name: 'documentos',
    component: DocumentosView
  },
  {
    path: '/prazos',
    name: 'prazos',
    component: PrazosView    
  },
  {
    path: '/meus-processos',
    name: 'meus-processos',
    component: ProcessosView
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: ProfileView
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsuarioView
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  const publicRoutes = ["/login", "/cadastro"];

  if (!isAuthenticated && !publicRoutes.includes(to.path)) {
    return next("/login");
  }

  if (isAuthenticated && publicRoutes.includes(to.path)) {
    return next("/");
  }

  const isClient = localStorage.getItem("tipoUsuario") === "Cliente";
  const isProcurador = localStorage.getItem("tipoUsuario") === "Procurador";  
  const isAdmin = localStorage.getItem("tipoUsuario") === "Admin";

  if (to.name === "usuarios" && !isAdmin) { 
    return next("/"); 
  }

  if (to.name === "processos" && isClient) { 
    return next("/"); 
  }

  if (to.name === "documentos" && isClient) { 
    return next("/"); 
  }

  if (to.name === "prazos" && isClient) { 
    return next("/"); 
  }

  next();
});

export default router
