<template>
    <div id="prazos">

        <Dialog  v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Atualizar prazo.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="dataVencimento" class="font-semibold w-24">Data de Vencimento</label>
                <input id="dataVencimento" class="flex-auto" autocomplete="off" v-model="objEditar.dataVencimento" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="statusPrazo" class="font-semibold w-24">Status</label>
                <input id="statusPrazo" class="flex-auto" autocomplete="off" v-model="objEditar.statusPrazo"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="tipoPrazo" class="font-semibold w-24">Tipo</label>
                <input id="tipoPrazo" class="flex-auto" autocomplete="off" v-model="objEditar.tipoPrazo"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="processo" class="font-semibold w-24">Processo</label>
                <input type="number" id="processo" class="flex-auto" autocomplete="off" v-model="objEditar.idProcesso"/>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false">Cancelar</Button>
                <Button type="button" label="Save" @click="async () => { await updatePrazo(objEditar); visible = false}">Salvar</Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="visibleCadastrar" modal header="Cadastrar Prazo" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Criar novo prazo.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="data-vencimento" class="font-semibold w-24">Data de Vencimento</label>
                <input id="data-vencimento" class="flex-auto" autocomplete="off" v-model="novoPrazo.dataVencimento" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="novo-status" class="font-semibold w-24">Status</label>
                <input id="novo-status" class="flex-auto" autocomplete="off" v-model="novoPrazo.statusPrazo"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="novo-tipo" class="font-semibold w-24">Tipo</label>
                <input id="novo-tipo" class="flex-auto" autocomplete="off" v-model="novoPrazo.tipoPrazo"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="novo-processo" class="font-semibold w-24">Processo</label>
                <input type="number" id="novo-processo" class="flex-auto" autocomplete="off" v-model="novoPrazo.idProcesso"/>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleCadastrar = false">Cancelar</Button>
                <Button type="button" label="Salvar" @click="async () => { await cadastrarPrazo(novoPrazo); visibleCadastrar = false}">Salvar</Button>
            </div>
        </Dialog>

        <div>
            <button class="post-btn" @click="visibleCadastrar = true">Cadastrar</button>
        </div>

        <div>
            <div id="prazos-heading">
                <div class="prazo-id">#:</div>
                <div>Data de Vencimento:</div>
                <div>Status:</div>
                <div>Tipo:</div>
                <div>Processo:</div>
                <div>Ações:</div>
            </div>
        </div>
        <div id="prazos-table-rows">
            <div class="prazos-table-row" v-for="prazo in paginatedPrazos" :key="prazo.id">
                <div class="prazo-number">{{ prazo.id }}</div>
                <div v-if="prazo.editando">
                    <input v-model="prazo.dataVencimento" />
                </div>
                <div v-else>{{ prazo.dataVencimento }}</div>

                <div v-if="prazo.editando">
                    <input v-model="prazo.statusPrazo" />
                </div>
                <div v-else>{{ prazo.statusPrazo }}</div>

                <div v-if="prazo.editando">
                    <input v-model="prazo.tipoPrazo" />
                </div>
                <div v-else>{{ prazo.tipoPrazo }}</div>

                <div v-if="prazo.editando">
                    <input v-model="prazo.idProcesso" />
                </div>
                <div v-else>{{ prazo.idProcesso }}</div>
                <div>
                    <button v-if="!prazo.editando" class="edit-btn" @click="() => {objEditar = prazo ; visible = true}">Editar</button>
                    <button v-if="prazo.editando" class="save-btn" @click="updatePrazo(prazo)">Salvar</button>
                    <button class="delete-btn" @click="deletePrazo(prazo.id)">Excluir</button>
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
        name: "PrazosDashboard",
        components: {
            Dialog,
            Button,
            Paginator
        },
        data() {
            return {
                prazos: [],
                visible: false,
                visibleCadastrar: false,
                paginatedPrazos: [],
                currentPage: 1,    // Página inicial
                rowsPerPage: 10,   // Quantidade de documentos por página
                totalRecords: 0,   // Total de registros disponíveis
                objEditar: {
                  dataVencimento: "",
                  statusPrazo: "",
                  tipoPrazo: "",
                  idProcesso: 0  
                },
                prazo_id: "",
                tipoPessoa: localStorage.getItem("tipoUsuario"),
                novoPrazo: {
                    dataVencimento: "", 
                    statusPrazo: "",
                    tipoPrazo: "",
                    idProcesso: 0
                }
            }
        },
        methods: {
            onPageChange(event) {
                this.currentPage = event.page + 1; 
                this.updatePagePrazos();
            },
            async getPrazos() {
                    try {
                        const token = localStorage.getItem("token");
                        const response = await axios.get(`https://localhost:7091/Prazo`, {
                            headers: { Authorization: `Bearer ${token}` } });
                        this.prazos = response.data.body;
                        this.totalRecords = this.prazos.length;
                        this.updatePagePrazos();
                    } catch (error) {
                        console.error("Erro ao obter prazos:", error);
                    }
                },
                updatePagePrazos() {
                    const startIndex = (this.currentPage - 1) * this.rowsPerPage; // Índice inicial para a página
                    const endIndex = startIndex + this.rowsPerPage; // Índice final para a página
                    this.paginatedPrazos = this.prazos.slice(startIndex, endIndex); // Filtra os documentos para a página atual
                },
            async cadastrarPrazo(prazo) {
                try	{
                    const token = localStorage.getItem("token");
                    await axios.post("https://localhost:7091/Prazo", prazo, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.getPrazos();
                } catch(error){
                    console.error("Erro ao cadastrar prazo:", error);
                }
            },
            async deletePrazo(id) {
                try{
                    this.$confirm.require({
                        message: 'Tem certeza que deseja excluir?',
                        header: 'Confirmação',
                        icon: 'pi pi-exclamation-triangle',
                        acceptLabel: 'Sim',
                        rejectLabel: 'Não',
                        accept: async () => {
                            const token = localStorage.getItem("token");
                            const response = await axios.delete(`https://localhost:7091/Prazo/${id}`, {
                                headers: { Authorization: `Bearer ${token}` } });
                            this.prazos = response.data.body;
                            this.getPrazos();
                        },
                        reject: () => {}
                    });
                }catch(error){
                    console.error("Erro ao deletar prazos:", error);
                }
            },
            async updatePrazo(prazo) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.put(`https://localhost:7091/Prazo`, 
                        {
                            id: prazo.id,
                            dataVencimento: prazo.dataVencimento,
                            tipoPrazo: prazo.tipoPrazo,
                            statusPrazo: prazo.statusPrazo,
                            idProcesso: prazo.idProcesso
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Sucesso ao atualizar prazo.',
                        life: 3000 
                    });
                    this.getPrazos(); // Atualiza a lista de prazos
                    prazo.editando = false; // Sai do modo de edição
                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao atualizar prazo.',
                        life: 3000 
                    });
                    console.error("Erro ao atualizar prazo:", error);
                }
            }
        },
        mounted() {
            this.getPrazos();
        }
    }
</script>

<style scoped>
    #prazos{
        max-width: 1200px;
        margin: 0 auto;

    }

    #prazos-heading, #prazos-table-rows, .prazos-table-row{
        display: flex;
        flex-wrap: wrap;
    }

    #prazos-heading {
        font-weight: bold;
        padding: 12px;
        border-bottom: 3px solid #333;
    }

    #prazos-heading div, .prazos-table-row div{
        width: 19%;
    }

    .prazos-table-row{
        width: 100%;
        padding: 12px;
        border-bottom: 1px solid #CCC;
    }

    #prazos-heading .prazo-id, .prazos-table-row .prazo-number{
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