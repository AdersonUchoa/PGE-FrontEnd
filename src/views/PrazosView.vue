<template>
    <div class="main-container">
      <div class="main-prazo">Lista de Prazos</div>
      <PrazosDashboard />
    </div>
  </template>
  
<script>
    import PrazosDashboard from '@/components/PrazosDashboard.vue';
  
      export default {
          name: "PrazosView",
          components: {
              PrazosDashboard
          }
      }
  </script>
  
  <style scoped>
    .main-prazo{
      text-align: center;
      color: white;
      font-size: 20px;
      margin-bottom: 60px;
      font-weight: bold;
    }
  </style>