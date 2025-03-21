<template>
  <div class="main-container">
    <div class="main-perfil">Meu Perfil</div>
    <ProfileComponent />
  </div>
</template>

<script>
import ProfileComponent from '@/components/ProfileComponent.vue';
    export default {
        name: "ProfileView",
        components: {
            ProfileComponent
        }
    }

</script>

<style scoped>
  .main-perfil{
    text-align: center;
    color: white;
    font-size: 20px;
    margin-bottom: 60px;
    font-weight: bold;
  }
</style>