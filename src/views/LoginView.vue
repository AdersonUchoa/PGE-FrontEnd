<template>
    <Banner />
    <div class="main-container">
      <div class="main-login">Login</div>
      <LoginForm />
    </div>
  </template>
  
  <script>
      import Banner from '@/components/Banner.vue';
      import LoginForm from '@/components/LoginForm.vue';
  
      export default {
          name: "LoginView",
          components: {
              Banner,
              LoginForm
          }
      }
  </script>
  
  <style>
    .main-login{
      text-align: center;
      color: white;
      font-size: 20px;
      margin-bottom: 60px;
      font-weight: bold;
    }
  </style>