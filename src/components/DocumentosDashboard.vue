<template>
    <div id="documentos">
        <Dialog v-model:visible="visibleEditar" modal header="Editar Documento" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Atualizar documento.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="nome" class="font-semibold w-24">Nome</label>
                <input id="nome" class="flex-auto" autocomplete="off" v-model="objEditar.nomeDocumento" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="tipo" class="font-semibold w-24">Tipo</label>
                <input id="tipo" class="flex-auto" autocomplete="off" v-model="objEditar.tipoDocumento"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="processo" class="font-semibold w-24">Processo</label>
                <input type="number" id="processo" class="flex-auto" autocomplete="off" v-model="objEditar.idProcesso"/>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleEditar = false">Cancelar</Button>
                <Button type="button" label="Salvar" @click="async () => { await updateDocumento(objEditar); visibleEditar = false}">Salvar</Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="visibleCadastrar" modal header="Cadastrar Documento" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Criar novo documento.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="novo-nome" class="font-semibold w-24">Nome</label>
                <input id="novo-nome" class="flex-auto" autocomplete="off" v-model="novoDocumento.nomeDocumento" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="novo-tipo" class="font-semibold w-24">Tipo</label>
                <input id="novo-tipo" class="flex-auto" autocomplete="off" v-model="novoDocumento.tipoDocumento"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="novo-processo" class="font-semibold w-24">Processo</label>
                <input type="number" id="novo-processo" class="flex-auto" autocomplete="off" v-model="novoDocumento.idProcesso"/>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleCadastrar = false">Cancelar</Button>
                <Button type="button" label="Salvar" @click="async () => { await cadastrarDocumento(novoDocumento); visibleCadastrar = false}">Salvar</Button>
            </div>
        </Dialog>

        <div>
            <button class="post-btn" @click="visibleCadastrar = true">Cadastrar</button>
        </div>

        <div id="documentos-heading">
            <div class="documento-id">#:</div>
            <div>Nome:</div>
            <div>Tipo:</div>
            <div>Processo:</div>
            <div>Ações:</div>
        </div>

        <div id="documentos-table-rows">
            <div class="documentos-table-row" v-for="doc in paginatedDocuments" :key="doc.id">
                <div class="documento-number">{{ doc.id }}</div>
                <div v-if="doc.editando">
                    <input v-model="doc.nomeDocumento" />
                </div>
                <div v-else>{{ doc.nomeDocumento }}</div>
                <div v-if="doc.editando">
                    <input v-model="doc.tipoDocumento" />
                </div>
                <div v-else>{{ doc.tipoDocumento }}</div>
                <div v-if="doc.editando">
                    <input v-model="doc.idProcesso" />
                </div>
                <div v-else>{{ doc.idProcesso }}</div>
                <div>
                    <button class="edit-btn" @click="() => { objEditar = doc; visibleEditar = true }">Editar</button>
                    <button class="delete-btn" @click="deleteDocumento(doc.id)">Excluir</button>
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
            visibleEditar: false,
            visibleCadastrar: false,
            objEditar: {
                nomeDocumento: "",
                tipoDocumento: "",
                idProcesso: 0,
            },
            novoDocumento: {
                nomeDocumento: "",
                tipoDocumento: "",
                idProcesso: 0,
            },
            documentos: [],
            paginatedDocuments: [],
            currentPage: 1,    // Página inicial
            rowsPerPage: 10,   // Quantidade de documentos por página
            totalRecords: 0,   // Total de registros disponíveis
        }
    },
    methods: {
        onPageChange(event) {
            this.currentPage = event.page + 1; 
            this.updatePageDocuments();
        },
        async getDocumentos() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://localhost:7091/Documento`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.documentos = response.data.body;
                this.totalRecords = this.documentos.length;
                this.updatePageDocuments();
            } catch (error) {
                console.error("Erro ao obter documentos:", error);
            }
        },
        updatePageDocuments() {
            const startIndex = (this.currentPage - 1) * this.rowsPerPage; // Índice inicial para a página
            const endIndex = startIndex + this.rowsPerPage; // Índice final para a página
            this.paginatedDocuments = this.documentos.slice(startIndex, endIndex); // Filtra os documentos para a página atual
        },
        async cadastrarDocumento(doc) {
            try {
                const token = localStorage.getItem("token");
                await axios.post("https://localhost:7091/Documento", doc, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.getDocumentos();
            } catch (error) {
                console.error("Erro ao cadastrar documento:", error);
            }
        },
        async deleteDocumento(id) {
            try {
                this.$confirm.require({
                    message: 'Tem certeza que deseja excluir?',
                    header: 'Confirmação',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'Sim',
                    rejectLabel: 'Não',
                    accept: async () => {
                        const token = localStorage.getItem("token");
                        const response = await axios.delete(`https://localhost:7091/Documento/${id}`, {
                            headers: { Authorization: `Bearer ${token}` } });
                        this.getDocumentos();
                    },
                    reject: () => {}
                    });
            } catch (error) {
                console.error("Erro ao deletar documento:", error);
            }
        },
        async updateDocumento(doc) {
            try {
                const token = localStorage.getItem("token");
                await axios.put("https://localhost:7091/Documento", doc, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Sucesso ao atualizar prazo.',
                    life: 3000 
                });
                this.getDocumentos();
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao atualizar prazo.',
                    life: 3000 
                });
                console.error("Erro ao atualizar documento:", error);
            }
        }
    },
    mounted() {
        this.getDocumentos();
    }
}
</script>

<style scoped>
    #documentos{
        max-width: 1200px;
        margin: 0 auto;

    }

    #documentos-heading, #documentos-table-rows, .documentos-table-row{
        display: flex;
        flex-wrap: wrap;
    }

    #documentos-heading {
        font-weight: bold;
        padding: 12px;
        border-bottom: 3px solid #fff;
    }

    #documentos-heading div, .documentos-table-row div{
        width: 19%;
    }

    .documentos-table-row{
        width: 100%;
        padding: 12px;
        border-bottom: 1px solid #CCC;
    }

    #documentos-heading .documento-id, .documentos-table-row .documento-number{
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
        color: white;
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