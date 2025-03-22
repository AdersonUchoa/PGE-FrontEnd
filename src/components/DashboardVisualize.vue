<template>
    <div id="meus-processos">
        <div>
            <div id="meus-processos-heading">
                <div class="processo-id">#:</div>
                <div>Assunto:</div>
                <div>Órgão de Tramitação:</div>
                <div>Número do Processo:</div>
                <div>Status:</div>
            </div>
        </div>
        <div id="processos-table-rows">
            <div class="processos-table-row" v-for="processo in paginatedProcessos" :key="processo.id">
                <div class="processo-number">{{ processo.id }}</div>
                <div>{{ processo.assunto }}</div>
                <div>{{ processo.orgaoTramitacao }}</div>
                <div>{{ processo.numeroProcesso }}</div>
                <div>{{ processo.statusProcesso }}</div>
            </div>
        </div>
        <Paginator :rows="rowsPerPage" :totalRecords="totalRecords" :rowsPerPageOptions="[10, 20, 30]" @page="onPageChange" :page="currentPage - 1"></Paginator>
    </div>
</template>

<script>
    import axios from "axios";
    import { Button, InputText, Select } from "primevue";
    import Dialog from 'primevue/dialog';
    import Paginator from 'primevue/paginator';

    export default {
        name: "Dashboard",
        components: {
            Dialog,
            Button,
            Paginator,
            Select,
            InputText
        },
        data() {
            return {
                processos: [],
                processo_id: "",
                tipoPessoa: localStorage.getItem("tipoUsuario"),
                paginatedProcessos: [],
                currentPage: 1,    // Página inicial
                rowsPerPage: 10,   // Quantidade de documentos por página
                totalRecords: 0,   // Total de registros disponíveis
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
                    if (this.tipoPessoa === "Procurador") {
                        const response = await axios.get(`https://localhost:7091/Processo/procurador/${this.$route.params.idProcurador}/processos`, {
                            headers: { Authorization: `Bearer ${token}` }});
                        this.processos = response.data.body;
                        this.totalRecords = this.processos.length;
                        this.updatePageProcessos();
                    } else if (this.tipoPessoa === "Admin") {
                        const response = await axios.get(`https://localhost:7091/Processo/procurador/${this.$route.params.idProcurador}/processos`, {
                            headers: { Authorization: `Bearer ${token}` }});
                        this.processos = response.data.body;
                        this.totalRecords = this.processos.length;
                        this.updatePageProcessos();
                    }

                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao obter processos desse procurador.',
                        life: 3000,
                    })
                    this.$router.push("/meus-processos")
                    console.error("Erro ao obter processos:", error);
                }
            },
            updatePageProcessos() {
                const startIndex = (this.currentPage - 1) * this.rowsPerPage; // Índice inicial para a página
                const endIndex = startIndex + this.rowsPerPage; // Índice final para a página
                this.paginatedProcessos = this.processos.slice(startIndex, endIndex); // Filtra os documentos para a página atual
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
            console.log(this.$route.params.idProcurador);
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