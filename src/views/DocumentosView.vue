<template>
  <div class="main-container">
    <div class="main-documento">Documentos</div>
    <DocumentosDashboard />
  </div>
</template>

<script>
import DocumentosDashboard from '@/components/DocumentosDashboard.vue';

    export default {
        name: "DocumentosView",
        components: {
            DocumentosDashboard
        }
    }
</script>

<style scoped>
  .main-documento{
    text-align: center;
    color: white;
    font-size: 20px;
    margin-bottom: 60px;
    font-weight: bold;
  }
</style>