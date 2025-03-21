<template>
    <div id="pessoas">
        <Dialog  v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Atualizar usuario.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="nome" class="font-semibold w-24">Nome</label>
                <input id="nome" class="flex-auto" autocomplete="off" v-model="objEditar.nomePessoa" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="senha" class="font-semibold w-24">Nova senha</label>
                <input id="senha" class="flex-auto" autocomplete="off" v-model="objEditar.senha"/>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false">Cancelar</Button>
                <Button type="button" label="Save" @click="async () => { await updatePessoa(objEditar); visible = false}">Salvar</Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="visibleCadastrar" modal header="Cadastrar Usuário" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Criar novo usuário.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="novo-nome" class="font-semibold w-24">Nome</label>
                <input id="novo-nome" class="flex-auto" autocomplete="off" v-model="novaPessoa.nomePessoa" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="novo-tipo" class="font-semibold w-24">Tipo</label>
                <select id="novo-tipo" class="flex-auto" autocomplete="off" v-model="novaPessoa.tipoPessoa" required>
                    <option value="Cliente">Cliente</option>
                    <option value="Procurador">Procurador</option>
			        <option value="Admin">Admin</option>
                </select>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="novo-login" class="font-semibold w-24">Login</label>
                <input id="novo-login" class="flex-auto" autocomplete="off" v-model="novaPessoa.loginPessoa"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="nova-senha" class="font-semibold w-24">Senha</label>
                <input id="nova-senha" class="flex-auto" autocomplete="off" v-model="novaPessoa.senha"/>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleCadastrar = false">Cancelar</Button>
                <Button type="button" label="Salvar" @click="async () => { await cadastrarPessoa(novaPessoa); visibleCadastrar = false}">Salvar</Button>
            </div>
        </Dialog>

        <div>
            <button class="post-btn" @click="visibleCadastrar = true">Cadastrar</button>
        </div>

        <div>
            <div id="pessoas-heading">
                <div class="pessoa-id">#:</div>
                <div class="pessoa-name">Nome:</div>
                <div class="pessoa-tipo">Tipo:</div>
                <div class="pessoa-login">Login:</div>
                <div class="pessoa-actions">Ações:</div>
            </div>
        </div>
        <div id="pessoas-table-rows">
            <div class="pessoas-table-row" v-for="pessoa in paginatedPessoas" :key="pessoa.id">
                <div class="pessoa-number">{{ pessoa.id }}</div>
                <div v-if="pessoa.editando">
                    <input v-model="pessoa.nomePessoa" />
                </div>
                <div v-else>{{ pessoa.nomePessoa }}</div>

                <div v-if="pessoa.editando">
                    <input v-model="pessoa.tipoPessoa" />
                </div>
                <div v-else>{{ pessoa.tipoPessoa }}</div>

                <div v-if="pessoa.editando">
                    <input v-model="pessoa.loginPessoa" />
                </div>
                <div v-else>{{ pessoa.loginPessoa }}</div>
                <div v-if="pessoa.editando">
                    <input v-model="pessoa.senha" />
                </div>
                <div v-else>{{ pessoa.senha }}</div>
                <div>
                    <button v-if="!pessoa.editando" class="edit-btn" @click="() => {objEditar = pessoa ; visible = true}">Editar</button>
                    <button v-if="pessoa.editando" class="save-btn" @click="updatePessoa(pessoa)">Salvar</button>
                    <button class="delete-btn" @click="deletePessoa(pessoa.id)">Excluir</button>
                </div>
            </div>
        </div>
        <Paginator :rows="rowsPerPage" :totalRecords="totalRecords" :rowsPerPageOptions="[10, 20, 30]" @page="onPageChange" :page="currentPage - 1"></Paginator>
    </div>
</template>


<script>
    import axios from "axios";
    import { Button } from "primevue";
    import Dialog from 'primevue/dialog';
    import Paginator from 'primevue/paginator';


    export default {
        name: "DocumentosDashboard",
        components: {
            Dialog,
            Button,
            Paginator        
        },
        data() {
            return {
                visible: false,
                visibleCadastrar: false,
                paginatedPessoas: [],
                currentPage: 1,    // Página inicial
                rowsPerPage: 10,   // Quantidade de documentos por página
                totalRecords: 0,   // Total de registros disponíveis
                novaPessoa: {
                    nomePessoa: "",
                    tipoPessoa: "",
                    loginPessoa: "",
                    senha: "",
                    oab: false
                },
                objEditar: {
                    nomePessoa: "",
                    senha: ""
                },
                pessoas: [],
                pessoa_id: "",
                tipoPessoa: localStorage.getItem("tipoUsuario")
            }
        },
        methods: {
            onPageChange(event) {
                this.currentPage = event.page + 1; 
                this.updatePageUsuarios();
            },
         async getPessoas() {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`https://localhost:7091/Pessoa`, {
                        headers: { Authorization: `Bearer ${token}` } });
                    this.pessoas = response.data.body;
                    this.totalRecords = this.pessoas.length;
                    this.updatePageUsuarios();
                } catch (error) {
                    console.error("Erro ao obter usuários:", error);
                }
            },
            updatePageUsuarios() {
                const startIndex = (this.currentPage - 1) * this.rowsPerPage; // Índice inicial para a página
                const endIndex = startIndex + this.rowsPerPage; // Índice final para a página
                this.paginatedPessoas = this.pessoas.slice(startIndex, endIndex); // Filtra os documentos para a página atual
            },
            async cadastrarPessoa(pessoa) {
                try {
                    const token = localStorage.getItem("token");
                    if(pessoa.tipoPessoa === "Procurador"){
                        pessoa.oab = true
                    }
                    await axios.post("https://localhost:7091/Pessoa", pessoa, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    this.getPessoas();
                } catch(error){
                    console.error("Erro ao cadastrar pessoa:", error);
                }
            },
            async deletePessoa(id) {
                try{
                    this.$confirm.require({
                        message: 'Tem certeza que deseja excluir?',
                        header: 'Confirmação',
                        icon: 'pi pi-exclamation-triangle',
                        acceptLabel: 'Sim',
                        rejectLabel: 'Não',
                        accept: async () => {
                            const token = localStorage.getItem("token");
                            const response = await axios.delete(`https://localhost:7091/Pessoa/${id}`, {
                                headers: { Authorization: `Bearer ${token}` } });
                            this.pessoas = response.data.body;
                            this.getPessoas();
                        },
                        reject: () => {}
                    });
                }catch(error){
                    console.error("Erro ao deletar usuário:", error);
                }
            },
            async updatePessoa(pessoa) {
                try {

                    const token = localStorage.getItem("token");
                    const response = await axios.put(`https://localhost:7091/Pessoa`, 
                        {
                            id: pessoa.id,
                            nomePessoa: pessoa.nomePessoa,
                            senhaPessoa: pessoa.senhaPessoa
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Sucesso ao atualizar usuario.',
                        life: 3000 
                    });
                    this.getPessoas();
                    pessoa.editando = false; 
                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao atualizar usuario.',
                        life: 3000 
                    });
                    console.error("Erro ao atualizar usuario:", error);
                }
            }

        },
        mounted() {
            this.getPessoas();
        }
    }
</script>

<style scoped>
    #pessoas{
        max-width: 1200px;
        margin: 0 auto;

    }

    #pessoas-heading, #pessoas-table-rows, .pessoas-table-row{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    #pessoas-heading {
        font-weight: bold;
        padding: 12px;
        border-bottom: 3px solid white;
    }

    #pessoas-heading div, .pessoas-table-row div{
        width: 19%;
    }

    .pessoas-table-row{
        width: 100%;
        padding: 12px;
        border-bottom: 1px solid #CCC;
    }

    #pessoas-heading .pessoas-id, .pessoas-table-row .pessoa-number{
        width: 5%;
    }
    
    .delete-btn{
        background: transparent;
        border: 2px solid #FCBA03;
        color: #FCBA03;
        padding: 8px 12px;
        cursor: pointer;
        transition: 0.3s;
        font-size: 16px;
        border-radius: 5px;
    }

    .delete-btn:hover{
        background: #FCBA03;
        color: white;
    }

    .edit-btn{
        background: transparent;
        border: 2px solid #FCBA03;
        color: #FCBA03;
        padding: 8px 12px;
        cursor: pointer;
        transition: 0.3s;
        font-size: 16px;
        border-radius: 5px;
        margin-right: 10px;
    }

    .edit-btn:hover{
        background: #FCBA03;
        color: #222;
    }

    .save-btn{
        background: transparent;
        border: 2px solid #FCBA03;        
        color: #FCBA03;
        padding: 8px 12px;
        cursor: pointer;
        transition: 0.3s;
        font-size: 16px;
        border-radius: 5px;
        margin-right: 10px;
    }

    .save-btn:hover{
        background: #FCBA03;
        color: white;
    }

    .post-btn{
        background: transparent;
        border: 2px solid #FCBA03;        
        color: #FCBA03;
        padding: 8px 12px;
        cursor: pointer;
        transition: 0.3s;
        font-size: 16px;
        border-radius: 5px;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .post-btn:hover{
        background: #FCBA03;
        color: #222;
    }
</style> 