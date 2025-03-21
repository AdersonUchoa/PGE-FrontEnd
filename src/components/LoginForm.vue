<template>
    <div>
        <div id="login-container">
            <form id="login-form" @submit.prevent="logar">
                <div class="input-container">
                    <label for="login">Login:</label>
                    <input type="text" id="login" name="login" v-model="login" placeholder="Digite seu login" required>
                </div>
                <div class="input-container">
                    <label for="senha">Senha:</label>
                    <input type="password" id="senha" name="senha" v-model="senha" placeholder="Digite sua senha" required>
                </div>
                <div class="input-container">
                    <input type="submit" class="submit-btn" value="Entrar">
                </div>
            </form>
            <p v-if="erro" class="error">{{ erro }}</p>
            <div class="cadastrar-container">
                Não possui uma conta? <a href="http://localhost:8080/cadastro">Crie aqui</a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../eventBus";
import { jwtDecode } from "jwt-decode";

export default {
    name: "LoginForm",
    data() {
        return {
            login: "",
            senha: "",
            tipo: "",
            erro: ""
        };
    },
    methods: {
        async logar() {
            try {
                const LoginModel = {
                    loginPessoa: this.login,
                    password: this.senha,
                };

                const response = await axios.post("https://localhost:7091/Pessoa/login", LoginModel);

                if (response.status === 200 && response.data && response.data.tokenString) {
                        const { tokenString } = response.data
                        localStorage.setItem("token", tokenString);
                        localStorage.setItem("tipoUsuario", jwtDecode(tokenString).tipoPessoa);
                        localStorage.setItem("id", jwtDecode(tokenString).id);
                        localStorage.setItem("oab", jwtDecode(tokenString).oab);
                        localStorage.setItem("nome", jwtDecode(tokenString).nome);
                        localStorage.setItem("login", jwtDecode(tokenString).login);
                        localStorage.setItem("senha", jwtDecode(tokenString).senha);

                        alert("Login realizado com sucesso! Você já está autenticado.");
                        
                        eventBus.loginSucesso();
                        
                        this.$router.push("/");
                        
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    this.erro = error.response.data;
                } else {
                    this.erro = "Erro ao tentar entrar.";
                }
            }
        }
    }
};
</script>

<style scoped>
#login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 1000px;
    margin: 0 auto;
}

.input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.cadastrar-container {
    text-align: center; /* Centraliza o texto */
    margin-top: 20px; /* Adiciona um espaço acima */
    font-size: 16px; /* Ajusta o tamanho da fonte */
}

.cadastrar-container a {
    color: blue;
    text-decoration: none;
    font-weight: bold;
}

.cadastrar-container a:hover {
    text-decoration: underline;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
    color: white;
    padding: 5px 10px;
    border-left: 4px solid #FCBA03;
}

input, select {
    padding: 8px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.submit-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
    max-width: 300px;
}

.submit-btn:hover {
    background-color: #45a049;
}

.error {
    color: red;
    text-align: center;
    margin-top: 10px;
}
</style>
