<template>
  <div class="main-container">
    <div class="main-processos">Lista de processos</div>
    <Dashboard />
  </div>
</template>

<script>
    import Dashboard from '@/components/DashboardVisualize.vue';
    export default {
        name: "ProcessosView",
        components: {
            Dashboard
        }
    }

</script>

<style scoped>
  .main-processos{
    text-align: center;
    color: white;
    font-size: 20px;
    margin-bottom: 60px;
    font-weight: bold;
  }
</style>