<template>
  <Banner />
  <div class="main-container">
    <div class="main-cadastro">Cadastro</div>
    <CadastroForm />
  </div>
</template>

<script>
    import Banner from '@/components/Banner.vue';
    import CadastroForm from '@/components/CadastroForm.vue';

    export default {
        name: "CadastroView",
        components: {
            Banner,
            CadastroForm
        }
    }
</script>

<style>
  .main-cadastro{
    text-align: center;
    color: white;
    font-size: 20px;
    margin-bottom: 60px;
    font-weight: bold;
  }
</style>