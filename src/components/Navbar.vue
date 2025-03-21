<template>
    <div id="nav">
        <li v-if="!isAuthenticated"><router-link to="/cadastro">Cadastro</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
        
        <li v-if="isAuthenticated"><router-link to="/">Home</router-link></li>
        
        <li v-for="route in userRoutes" :key="route.path">
            <router-link :to="route.path">{{ route.label }}</router-link>
        </li>

        <li v-if="isAuthenticated">
            <button @click="logout" class="logout-btn">Sair</button>
        </li>
    </div>
</template>

<script>
export default {
    name: "Navbar",
    data() {
        return {
            isAuthenticated: !!localStorage.getItem("token"),
            tipoUsuario: localStorage.getItem("tipoUsuario")
        };
    },
    computed: {
        isCliente() {
            return this.tipoUsuario === "Cliente";
        },
        isProcurador() {
            return this.tipoUsuario === "Procurador";
        },
        isAdmin() {
            return this.tipoUsuario === "Admin";
        },
        userRoutes() {
            // Definição das rotas por tipo de usuário
            const routes = {
                Cliente: [
                    { path: "/meus-processos", label: "Meus Processos" },
                    { path: "/perfil", label: "Perfil" }
                ],
                Procurador: [
                    { path: "/meus-processos", label: "Meus Processos" },
                    { path: "/documentos", label: "Documentos" },
                    { path: "/prazos", label: "Prazos" },
                    { path: "/perfil", label: "Perfil" }
                ],
                Admin: [
                    { path: "/usuarios", label: "Usuários" },
                    { path: "/meus-processos", label: "Meus Processos" },
                    { path: "/documentos", label: "Documentos" },
                    { path: "/prazos", label: "Prazos" },
                    { path: "/perfil", label: "Perfil" }
                ]
            };

            // Retorna as rotas do usuário autenticado
            return this.isAuthenticated ? (routes[this.tipoUsuario] || []) : [];
        }
    },
    methods: {
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("tipoUsuario");
            this.isAuthenticated = false;
            this.tipoUsuario = null;
            this.$router.push("/login");
        }
    },
    mounted() {
        this.isAuthenticated = !!localStorage.getItem("token");
        this.tipoUsuario = localStorage.getItem("tipoUsuario");
    }
};
</script>


<style scoped>
    #nav {
        background: #222;
        border-bottom: 4px solid #111;
        padding: 15px 50px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    #nav li {
        list-style: none; /* Remove os marcadores */
    }

    #nav #logo-url {
        margin: auto;
        margin-left: 0;
    }

    #logo {
        width: 40px;
        height: 40px;
    }

    #nav a {
        color: #FCBA03;
        text-decoration: none;
        margin: 12px;
        transition: .5s;
    }

    #nav a:hover{
        color: #FFF;
    }

    .logout-btn {
        background: transparent;
        border: 2px solid #FCBA03;
        color: #FCBA03;
        padding: 8px 12px;
        cursor: pointer;
        transition: 0.3s;
        font-size: 16px;
        border-radius: 5px;
    }

    .logout-btn:hover {
        background: #FCBA03;
        color: #222;
    }   
</style>