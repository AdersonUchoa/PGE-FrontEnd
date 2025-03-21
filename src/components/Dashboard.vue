<template>
    <div id="meus-processos">

        <Dialog  v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Atualizar documento.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="dataVencimento" class="font-semibold w-24">Assunto</label>
                <input id="dataVencimento" class="flex-auto" autocomplete="off" v-model="objEditar.assunto" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="statusPrazo" class="font-semibold w-24">Órgão de Tramitação</label>
                <input id="statusPrazo" class="flex-auto" autocomplete="off" v-model="objEditar.orgaoTramitacao"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="tipoPrazo" class="font-semibold w-24">Número do Processo</label>
                <input id="tipoPrazo" class="flex-auto" autocomplete="off" v-model="objEditar.numeroProcesso"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="processo" class="font-semibold w-24">Status</label>
                <input id="processo" class="flex-auto" autocomplete="off" v-model="objEditar.statusProcesso"/>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false">Cancelar</Button>
                <Button type="button" label="Save" @click="async () => { await updateProcesso(objEditar); visible = false}">Salvar</Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="visibleCadastrar" modal header="Cadastrar Processo" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Criar novo processo.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="novo-assunto" class="font-semibold w-24">Assunto</label>
                <input id="novo-assunto" class="flex-auto" autocomplete="off" v-model="novoProcesso.Assunto" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="orgao-tramitacao" class="font-semibold w-24">Órgão de Tramitação</label>
                <input id="orgao-tramitacao" class="flex-auto" autocomplete="off" v-model="novoProcesso.orgaoTramitacao"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="numero-processo" class="font-semibold w-24">Número do Processo</label>
                <input id="numero-processo" class="flex-auto" autocomplete="off" v-model="novoProcesso.numeroProcesso"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="novo-status" class="font-semibold w-24">Status</label>
                <input id="novo-status" class="flex-auto" autocomplete="off" v-model="novoProcesso.statusProcesso"/>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleCadastrar = false">Cancelar</Button>
                <Button type="button" label="Salvar" @click="async () => { await cadastrarProcesso(novoProcesso); visibleCadastrar = false}">Salvar</Button>
            </div>
        </Dialog>

        <div>
            <button class="post-btn" @click="visibleCadastrar = true">Cadastrar</button>
        </div>

        <div>
            <div id="meus-processos-heading">
                <div class="processo-id">#:</div>
                <div>Assunto:</div>
                <div>Órgão de Tramitação:</div>
                <div>Número do Processo:</div>
                <div>Status:</div>
                <div>Ações:</div>
            </div>
        </div>
        <div id="processos-table-rows">
            <div class="processos-table-row" v-for="processo in paginatedProcessos" :key="processo.id">
                <div class="processo-number">{{ processo.id }}</div>
                <div v-if="processo.editando">
                    <input v-model="processo.assunto" />
                </div>
                <div v-else>{{ processo.assunto }}</div>

                <div v-if="processo.editando">
                    <input v-model="processo.orgaoTramitacao" />
                </div>
                <div v-else>{{ processo.orgaoTramitacao }}</div>

                <div v-if="processo.editando">
                    <input v-model="processo.numeroProcesso" />
                </div>
                <div v-else>{{ processo.numeroProcesso }}</div>

                <div v-if="processo.editando">
                    <input v-model="processo.statusProcesso" />
                </div>
                <div v-else>{{ processo.statusProcesso }}</div>
                <div>
                    <button v-if="tipoPessoa !== 'Cliente' && !processo.editando" class="edit-btn" @click="() => {objEditar = processo ; visible = true}">Editar</button>
                    <button v-if="tipoPessoa !== 'Cliente' && processo.editando" class="save-btn" @click="updateProcesso(processo)">Salvar</button>
                    <button v-if="tipoPessoa !== 'Cliente'" class="delete-btn" @click="deleteProcesso(processo.id)">Excluir</button>
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
        name: "Dashboard",
        components: {
            Dialog,
            Button,
            Paginator
        },
        data() {
            return {
                processos: [],
                processo_id: "",
                tipoPessoa: localStorage.getItem("tipoUsuario"),
                visible: false,
                visibleCadastrar: false,
                paginatedProcessos: [],
                currentPage: 1,    // Página inicial
                rowsPerPage: 10,   // Quantidade de documentos por página
                totalRecords: 0,   // Total de registros disponíveis
                novoProcesso: {
                    assunto: "",
                    orgaoTramitacao: "",
                    numeroProcesso: "",
                    statusProcesso: "",
                },
                objEditar: {
                    assunto: "",
                    orgaoTramitacao: "",
                    numeroProcesso: "",
                    statusProcesso: "",
                }
            }
        },
        methods: {
            onPageChange(event) {
                this.currentPage = event.page + 1; 
                this.updatePageProcessos();
            },
            async getProcessos() {
                try {
                    const idPessoa = localStorage.getItem("id");
                    const token = localStorage.getItem("token");
                    if (this.tipoPessoa === "Cliente") {
                        const response = await axios.get(`https://localhost:7091/Processo/cliente/${idPessoa}/processos`, {
                            headers: { Authorization: `Bearer ${token}` } });
                        this.processos = response.data.body;
                        this.totalRecords = this.processos.length;
                        this.updatePageProcessos();
                    } else if (this.tipoPessoa === "Procurador") {
                        const response = await axios.get(`https://localhost:7091/Processo/procurador/${idPessoa}/processos`, {
                            headers: { Authorization: `Bearer ${token}` } });
                        this.processos = response.data.body;
                        this.totalRecords = this.processos.length;
                        this.updatePageProcessos();
                    } else if (this.tipoPessoa === "Admin") {
                        const response = await axios.get(`https://localhost:7091/Processo`, {
                            headers: { Authorization: `Bearer ${token}` } });
                        this.processos = response.data.body;
                        this.totalRecords = this.processos.length;
                        this.updatePageProcessos();
                    }

                } catch (error) {
                    console.error("Erro ao obter processos:", error);
                }
            },
            updatePageProcessos() {
                const startIndex = (this.currentPage - 1) * this.rowsPerPage; // Índice inicial para a página
                const endIndex = startIndex + this.rowsPerPage; // Índice final para a página
                this.paginatedProcessos = this.processos.slice(startIndex, endIndex); // Filtra os documentos para a página atual
            },
            async cadastrarProcesso(processo) {
                try	{
                    const token = localStorage.getItem("token");
                    await axios.post("https://localhost:7091/Processo", processo, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    this.getProcessos();
                } catch(error){
                    console.error("Erro ao cadastrar processos:", error);
                }
            },
            async deleteProcesso(id) {
                try{
                    this.$confirm.require({
                        message: 'Tem certeza que deseja excluir?',
                        header: 'Confirmação',
                        icon: 'pi pi-exclamation-triangle',
                        acceptLabel: 'Sim',
                        rejectLabel: 'Não',
                        accept: async () => {
                            const token = localStorage.getItem("token");
                            const response = await axios.delete(`https://localhost:7091/Processo/${id}`, {
                                headers: { Authorization: `Bearer ${token}` } });
                            this.processos = response.data.body;
                            this.getProcessos();
                        },
                        reject: () => {}
                    });
                }catch(error){
                    console.error("Erro ao deletar processos:", error);
                }
            },

            async updateProcesso(processo) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.put(`https://localhost:7091/Processo`, 
                        {
                            id: processo.id,
                            assunto: processo.assunto,
                            orgaoTramitacao: processo.orgaoTramitacao,
                            numeroProcesso: processo.numeroProcesso,
                            statusProcesso: processo.statusProcesso
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Sucesso ao atualizar documento.',
                        life: 3000 
                    });
                    this.getProcessos(); // Atualiza a lista de processos
                    processo.editando = false; // Sai do modo de edição
                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao atualizar documento.',
                        life: 3000 
                    });
                    console.error("Erro ao atualizar processo:", error);
                }
            }
        },
        mounted() {
            this.getProcessos();
        }
    }
</script>

<style scoped>
    #meus-processos{
        max-width: 1200px;
        margin: 0 auto;

    }

    #meus-processos-heading, #processos-table-rows, .processos-table-row{
        display: flex;
        flex-wrap: wrap;
    }

    #meus-processos-heading {
        font-weight: bold;
        padding: 12px;
        border-bottom: 3px solid #333;
    }

    #meus-processos-heading div, .processos-table-row div{
        width: 19%;
    }

    .processos-table-row{
        width: 100%;
        padding: 12px;
        border-bottom: 1px solid #CCC;
    }

    #meus-processos-heading .processo-id, .processos-table-row .processo-number{
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
        color: #222;
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
        color: #222;
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