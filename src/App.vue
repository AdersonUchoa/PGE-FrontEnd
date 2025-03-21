<template>
   <ConfirmDialog />
   <Toast/>
  <Navbar v-if="!ignoreRoutes.includes(router)" :logo="logoSrc" :alt="appTitle" />
  <router-view/>
  <Footer v-if="!ignoreRoutes.includes(router)" />
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { ConfirmDialog, Toast } from 'primevue';

export default {
  components: {
    Navbar,
    Footer,
    ConfirmDialog,
    Toast
  },
  data() {
    return {
      logoSrc: "/img/logo.jpg",
      appTitle: "PGE-SE",
      router: this.$route.path,
      ignoreRoutes: ["/login", "/cadastro"]
    }
  },
  watch: {
    $route(to, from) {
      this.router = to.path
    }
  }
}
</script>

<style>
  *{
    font-family: Helvetica;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  html, body {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ocupa 100% da altura da tela */
}

  .main-container{
    flex: 1;
    margin: 50px;
    min-height: 250px;
  }

  h1{
    text-align: center;
    font-size: 42px;
    margin-bottom: 30px;
    color: #222;
  }
</style>
