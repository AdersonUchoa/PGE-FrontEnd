<template>
    <div>
        <div id = "cadastro-container">
            <form id="cadastro-form" @submit.prevent="cadastrar">
                <div class="input-container">
                    <label for="nome">Nome Completo:</label>
                    <input type="text" id="nome" name="nome" v-model="nome" placeholder="Digite seu nome" required>
                </div>
                <div class="input-container">
                    <label for="tipo">Tipo do Usuário:</label>
                    <select name="tipo" id="tipo" v-model="tipo" required>
                        <option value="Cliente">Cliente</option>
                        <option value="Procurador">Procurador</option>
                    </select>
                </div>
                <div class="input-container">
                    <label for="login">Login:</label>
                    <input type="text" id="login" name="login" v-model="login" placeholder="Digite seu login" required>
                </div>
                <div class="input-container">
                    <label for="senha">Senha:</label>
                    <input type="password" id="senha" name="senha" v-model="senha" placeholder="Digite sua senha" required>
                </div>
                <div class="input-container">
                    <input type="submit" class="submit-btn" value="Cadastrar">
                </div>
            </form>
            <p v-if="erro" class="error">{{ erro }}</p>
            <div class="entrar-container">
                Já tem uma conta? <a href="http://localhost:8080/login">Entre aqui</a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../eventBus"; 

export default {
    name: "CadastroForm",
    data() {
        return {
            nome: "",
            tipo: "",
            login: "",
            senha: "",
            erro: ""
        };
    },
    methods: {
        async cadastrar() {
            try {
                const pessoaCadastroDTO = {
                    NomePessoa: this.nome,
                    TipoPessoa: this.tipo,
                    LoginPessoa: this.login,
                    Senha: this.senha,
                    Oab: this.tipo === "Procurador" // Se for Procurador, true; se Cliente, false
                };

                const response = await axios.post("https://localhost:7091/Pessoa/registrar", pessoaCadastroDTO);

                if (response.status === 200 && response.data && response.data.tokenString) {
                        localStorage.setItem("token", response.data.tokenString);
                        localStorage.setItem("tipoUsuario", this.tipo);
                        localStorage.setItem("id", response.data.id);
                        localStorage.setItem("oab", response.data.oab);
                        localStorage.setItem("nome", response.data.nome);
                        localStorage.setItem("login", response.data.login);
                        localStorage.setItem("senha", response.data.senha);

                        alert("Cadastro realizado com sucesso! Você já está autenticado.");
                        
                        eventBus.loginSucesso();

                        this.$router.push("/");
                        this.$root.$forceUpdate();
                        
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    this.erro = error.response.data;
                } else {
                    this.erro = "Erro ao tentar cadastrar.";
                }
            }
        }
    }
};
</script>

<style scoped>
#cadastro-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centraliza o formulário e as mensagens */
    justify-content: center;
    margin: 0 auto;
}

.input-container {
    display: flex;
    flex-direction: column;
    color: white;
    margin-bottom: 15px;
}

.entrar-container {
    text-align: center; /* Centraliza o texto */
    margin-top: 20px; /* Adiciona um espaço acima */
    font-size: 16px; /* Ajusta o tamanho da fonte */
}

.entrar-container a {
    color: blue;
    text-decoration: none;
    font-weight: bold;
}

.entrar-container a:hover {
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
