<template>
  <div class="main-container">
    <div class="header">
      <h1>Gerenciamento de Processos Jurídicos</h1>
    </div>
    <div class="content">
      <div class="info-box">
        <h2>Processos Ativos</h2>
        <p>Confira os processos jurídicos em andamento e suas atualizações mais recentes.</p>
        <button @click="goToProcessos" class="processos-button">Veja Seus Processos</button>
      </div>
      <div class="info-box">
        <h2>Seu Perfil</h2>
        <p>Verifique seu perfil e altere seus dados conforme sua necessidade.</p>
        <button @click="goToProfile" class="perfil-button">Acesse Seu Perfil</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      isAuthenticated: !!localStorage.getItem("token")
    };
  },
  methods: {
    goToProcessos(){
      if(this.isAuthenticated){
        this.$router.push('/meus-processos');
      } else{
        this.$router.push('/login');
      }
    },
    goToProfile(){
      if(this.isAuthenticated){
        this.$router.push('/perfil');
      } else{
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style scoped>
.main-container {
  background: linear-gradient(300deg, #FCBA03, black);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Arial', sans-serif;
}

.header h1 {
  font-size: 36px;
  margin: 0;
  padding: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  color: white;
}

.content {
  display: flex;
  gap: 30px;
  margin-top: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.info-box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  width: 250px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-box:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.info-box h2 {
  font-size: 22px;
  margin-bottom: 10px;
}

.cta {
  margin-top: 30px;
}

.cta-button {
  background-color: #5c77e6;
  color: white;
  padding: 15px 30px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #4a65c7;
}

.perfil-button {
  background-color: #5c77e6;
  color: white;
  padding: 10px 20px;
  font-size: 12px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.perfil-button:hover {
  background-color: #4a65c7;
}

.processos-button {
  background-color: #5c77e6;
  color: white;
  padding: 10px 20px;
  font-size: 12px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.processos-button:hover {
  background-color: #4a65c7;
}

</style>
