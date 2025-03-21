<template>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="$emit('page-change', currentPage - 1)">⟨ Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="$emit('page-change', currentPage + 1)">Próximo ⟩</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "Paginator",
    props: {
      currentPage: Number,
      totalPages: Number
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  