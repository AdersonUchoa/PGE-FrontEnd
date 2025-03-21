<template>
    <div id="pessoas">
        <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Atualizar usuário.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="nome" class="font-semibold w-24">Nome</label>
                <input id="nome" class="flex-auto" autocomplete="off" v-model="objEditar.nomePessoa" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="senha" class="font-semibold w-24">Nova senha</label>
                <input id="senha" class="flex-auto" autocomplete="off" v-model="objEditar.senha" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visible = false">Cancelar</Button>
                <Button type="button" label="Salvar" @click="async () => { await updatePessoa(objEditar); visible = false }">Salvar</Button>
            </div>
        </Dialog>

        <!-- Cabeçalho da Tabela -->
        <div id="pessoas-heading">
            <div class="col">#</div>
            <div class="col">Nome</div>
            <div class="col">Tipo</div>
            <div class="col">Login</div>
            <div class="col">Ações</div>
        </div>

        <!-- Linha com os Dados do Usuário -->
        <div id="pessoas-table-rows" v-if="pessoa">
            <div class="pessoas-table-row">
                <div class="col">{{ pessoa.id }}</div>
                <div class="col">{{ pessoa.nomePessoa }}</div>
                <div class="col">{{ pessoa.tipoPessoa }}</div>
                <div class="col">{{ pessoa.loginPessoa }}</div>
                <div class="col">
                    <button class="edit-btn" @click="() => { objEditar = { ...pessoa }; visible = true }">Editar</button>
                    <button class="delete-btn" @click="deletePessoa(pessoa.id)">Excluir</button>
                </div>
            </div>
        </div>

        <!-- Mensagem de Carregamento -->
        <div v-else>
            <p>Carregando informações do usuário...</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { Button } from "primevue";
import Dialog from 'primevue/dialog';

export default {
    name: "PerfilUsuario",
    components: {
        Dialog,
        Button,
    },
    data() {
        return {
            visible: false,
            objEditar: {
                nomePessoa: "",
                senha: ""
            },
            pessoa: null,
            tipoPessoa: localStorage.getItem("tipoUsuario"),
            senhaOriginal: localStorage.getItem("senha"),
        };
    },
    methods: {
        async getPessoa() {
            try {
                const token = localStorage.getItem("token");
                const id = localStorage.getItem("id");
                const response = await axios.get(`https://localhost:7091/Pessoa/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.body) {
                    this.pessoa = response.data.body;
                    this.senhaOriginal = this.pessoa.senha; // Armazena a senha original
                } else {
                    onsole.error("Usuário não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao obter usuário:", error);
            }
        },

        async deletePessoa(id) {
            try {
                this.$confirm.require({
                    message: 'Tem certeza que deseja excluir?',
                    header: 'Confirmação',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'Sim',
                    rejectLabel: 'Não',
                    accept: async () => {
                        const token = localStorage.getItem("token");
                        await axios.delete(`https://localhost:7091/Pessoa/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        next("/"); 
                    },
                    reject: () => {}
                });
            } catch (error) {
                console.error("Erro ao deletar usuário:", error);
            }
        },

        async updatePessoa(pessoa) {
            try {
                const token = localStorage.getItem("token");
                const pessoaCadastroDTO = {
                    id: pessoa.id,
                    nomePessoa: pessoa.nomePessoa,
                    loginPessoa: pessoa.loginPessoa,
                    tipoPessoa: pessoa.tipoPessoa
                };

                // Só inclui senha se for preenchida
                if (pessoa.senha && pessoa.senha.trim() !== "") {
                    pessoaCadastroDTO.senha = pessoa.senha;
                }

                const response = await axios.put(`https://localhost:7091/Pessoa`, pessoaCadastroDTO, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Usuário atualizado com sucesso.',
                    life: 3000
                });

                this.getPessoa(); // Atualiza os dados após a alteração
            } catch (error) {
                console.error("Erro ao atualizar usuário:", error);
                console.error("Resposta do erro:", error.response?.data);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao atualizar usuário.',
                    life: 3000
                });
            }
        }


    },
    mounted() {
        this.getPessoa();
    }
};
</script>

<style scoped>
/* Container Principal */
#pessoas {
    max-width: 1200px;
    margin: 0 auto;
    color: white;
}

/* Cabeçalho da Tabela */
#pessoas-heading {
    display: flex;
    background: #222;
    padding: 12px;
    font-weight: bold;
    border-bottom: 3px solid white;
}

/* Linha de Dados */
.pessoas-table-row {
    display: flex;
    padding: 12px;
    border-bottom: 1px solid #CCC;
}

/* Colunas */
.col {
    width: 20%;
    text-align: center;
}

/* Botões */
.edit-btn, .delete-btn {
    border: 2px solid #FCBA03;
    color: #FCBA03;
    padding: 8px 12px;
    cursor: pointer;
    transition: 0.3s;
    font-size: 16px;
    border-radius: 5px;
    margin-right: 10px;
}

.edit-btn:hover, .delete-btn:hover {
    background: #FCBA03;
    color: black;
}
</style>
