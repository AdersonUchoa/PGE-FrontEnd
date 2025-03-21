<template>
    <div class="main-container">
      <div class="main-pessoa">Lista de Usuários</div>
      <UsuarioDashboard />
    </div>
  </template>
  
  <script>
    import UsuarioDashboard from '@/components/UsuarioDashboard.vue';
      export default {
          name: "UsuarioView",
          components: {
              UsuarioDashboard
          }
      }
  
  </script>
  
  <style scoped>
    .main-pessoa{
      text-align: center;
      color: white;
      font-size: 20px;
      margin-bottom: 60px;
      font-weight: bold;
    }
  </style>