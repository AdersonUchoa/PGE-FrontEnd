<template>
    <div id="main-banner">
        <h1>PGE-SE</h1>
    </div>
</template>

<script>
    export default {
        name: "Banner",

    }
</script>

<style scoped>
    #main-banner{
        background-image: url('../../public/img/banner.png');
        background-size: cover;
        background-position: center;
        height: 400px;
        display: flex;
        object-position: 15% 10%;
        align-items: center;
        justify-content: flex-start;
    }

    #main-banner h1{
        color: #FFF;
        text-align: center;
        font-size: 50px;
        background-color: #222;
        padding: 20px 40px;
        margin-top: 280px; /* Abaixa um pouco */
    }
</style>